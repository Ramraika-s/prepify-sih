"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/server-admin";
import { createRazorpayOrder, verifyCheckoutSignature, razorpayEnv } from "@/lib/razorpay.server";

const SESSION_TYPES = ["quick_chat", "audio_call", "video_call", "premium_counselling"] as const;

export async function createMentorSessionOrder(data: {
  mentorId: string;
  sessionType: (typeof SESSION_TYPES)[number];
  scheduledAt: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const validated = z.object({
    mentorId: z.string().uuid(),
    sessionType: z.enum(SESSION_TYPES),
    scheduledAt: z.string().min(1),
    notes: z.string().max(1000).optional(),
  }).parse(data);

  const { keyId } = razorpayEnv();

  const { data: mentor } = await supabase
    .from("mentors")
    .select("id, full_name, verification_status, is_active")
    .eq("id", validated.mentorId)
    .maybeSingle();
  if (!mentor || mentor.verification_status !== "verified" || !mentor.is_active) {
    throw new Error("This mentor is not available for booking");
  }

  const { data: pricing } = await supabase
    .from("mentor_session_pricing")
    .select("session_type, label, duration_minutes, price_inr, commission_percent, is_active")
    .eq("session_type", validated.sessionType)
    .maybeSingle();
  if (!pricing || !pricing.is_active) throw new Error("This session type is not available");

  const amount = Number(pricing.price_inr);
  const amountPaise = Math.round(amount * 100);
  if (amountPaise < 100) throw new Error("Amount below minimum ₹1.00");

  const commission = Math.round(((amount * Number(pricing.commission_percent)) / 100) * 100) / 100;
  const mentorAmount = Math.round((amount - commission) * 100) / 100;

  const { data: session, error: sessErr } = await supabaseAdmin
    .from("mentor_sessions")
    .insert({
      mentor_id: mentor.id,
      student_id: user.id,
      session_type: validated.sessionType,
      scheduled_at: new Date(validated.scheduledAt).toISOString(),
      duration_minutes: pricing.duration_minutes,
      amount,
      commission,
      mentor_amount: mentorAmount,
      notes: validated.notes ?? null,
      status: "pending",
      payment_status: "pending",
    })
    .select("id")
    .single();
  if (sessErr) throw new Error(`Could not create booking: ${sessErr.message}`);

  const order = await createRazorpayOrder({
    amountPaise,
    receipt: `ms_${session.id.slice(0, 8)}_${Date.now()}`.slice(0, 40),
    notes: { kind: "mentor_session", session_id: session.id, user_id: user.id },
  });

  await supabaseAdmin.from("mentor_sessions").update({ gateway_order_id: order.id }).eq("id", session.id);

  const { error: payErr } = await supabaseAdmin.from("payments").insert({
    user_id: user.id,
    amount,
    currency: "INR",
    gateway: "razorpay",
    gateway_order_id: order.id,
    status: "pending",
  });
  if (payErr) throw new Error(`Failed to record payment: ${payErr.message}`);

  return {
    sessionId: session.id,
    orderId: order.id,
    amountPaise,
    keyId,
    label: pricing.label,
    durationMinutes: pricing.duration_minutes,
    mentorName: mentor.full_name,
  };
}

export async function verifyMentorSessionPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const validated = z.object({
    razorpay_order_id: z.string().min(1),
    razorpay_payment_id: z.string().min(1),
    razorpay_signature: z.string().min(1),
  }).parse(data);

  const ok = verifyCheckoutSignature(
    validated.razorpay_order_id,
    validated.razorpay_payment_id,
    validated.razorpay_signature,
  );
  if (!ok) throw new Error("Invalid payment signature");
  return { ok: true };
}

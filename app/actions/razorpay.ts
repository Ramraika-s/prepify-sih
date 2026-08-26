"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export async function getRazorpayPublicKey() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) throw new Error("Razorpay is not configured.");
  return { keyId };
}

export async function validateCouponForPlan(data: { code: string; planId: string }) {
  const parsed = z.object({ code: z.string().min(1), planId: z.string().uuid() }).parse(data);
  const supabase = await createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session) throw new Error("Not authenticated");

  const { supabaseAdmin } = await import("@/lib/supabase/server-admin");
  const { applyCoupon } = await import("@/lib/razorpay.server");

  const { data: plan, error: planErr } = await supabase
    .from("plans").select("id, price_inr, is_active").eq("id", parsed.planId).maybeSingle();
  if (planErr || !plan || !plan.is_active) throw new Error("Plan not available");

  const { data: coupon } = await supabaseAdmin
    .from("coupons").select("*").ilike("code", parsed.code.trim()).maybeSingle();
  if (!coupon) throw new Error("Invalid coupon code");

  const { finalInr } = applyCoupon(Number(plan.price_inr), plan.id, coupon as never);
  return {
    couponId: coupon.id,
    code: coupon.code,
    originalInr: Number(plan.price_inr),
    finalInr,
    discountInr: Math.round((Number(plan.price_inr) - finalInr) * 100) / 100,
  };
}

export async function createOrderForPlan(data: { planId: string; couponCode?: string }) {
  const parsed = z.object({ planId: z.string().uuid(), couponCode: z.string().trim().min(1).optional() }).parse(data);
  
  const supabase = await createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session) throw new Error("Not authenticated");
  const userId = session.user.id;

  const { supabaseAdmin } = await import("@/lib/supabase/server-admin");
  const { createRazorpayOrder, applyCoupon, razorpayEnv } = await import("@/lib/razorpay.server");
  const { keyId } = razorpayEnv();

  const { data: plan, error: planErr } = await supabase
    .from("plans")
    .select("id, price_inr, is_active, tier, name, billing_period")
    .eq("id", parsed.planId).maybeSingle();
  
  if (planErr || !plan) throw new Error("Plan not found");
  if (!plan.is_active) throw new Error("Plan is not available");
  if (plan.tier === "free" || Number(plan.price_inr) <= 0) throw new Error("This plan cannot be purchased");

  let couponRow: { id: string } | null = null;
  let finalInr = Number(plan.price_inr);
  
  if (parsed.couponCode) {
    const { data: coupon } = await supabaseAdmin
      .from("coupons").select("*").ilike("code", parsed.couponCode.trim()).maybeSingle();
    if (!coupon) throw new Error("Invalid coupon code");
    const res = applyCoupon(Number(plan.price_inr), plan.id, (coupon as never) ?? null);
    finalInr = res.finalInr;
    couponRow = coupon ? { id: (coupon as { id: string }).id } : null;
  }

  const amountPaise = Math.round(finalInr * 100);
  if (amountPaise < 100) throw new Error("Amount below minimum ₹1.00");

  const order = await createRazorpayOrder({
    amountPaise,
    receipt: `plan_${plan.id.slice(0, 8)}_${Date.now()}`.slice(0, 40),
    notes: { user_id: userId, plan_id: plan.id },
  });

  const { error: payErr } = await supabaseAdmin.from("payments").insert({
    user_id: userId,
    amount: finalInr,
    currency: "INR",
    gateway: "razorpay",
    gateway_order_id: order.id,
    status: "pending",
    coupon_id: couponRow?.id ?? null,
  });
  if (payErr) throw new Error(`Failed to record payment: ${payErr.message}`);

  return {
    orderId: order.id,
    amountPaise,
    keyId,
    planName: plan.name,
    finalInr,
  };
}

export async function verifyCheckoutCallback(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const parsed = z.object({
    razorpay_order_id: z.string().min(1),
    razorpay_payment_id: z.string().min(1),
    razorpay_signature: z.string().min(1),
  }).parse(data);

  const supabase = await createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session) throw new Error("Not authenticated");

  const { verifyCheckoutSignature } = await import("@/lib/razorpay.server");
  const ok = verifyCheckoutSignature(parsed.razorpay_order_id, parsed.razorpay_payment_id, parsed.razorpay_signature);
  if (!ok) throw new Error("Invalid payment signature");
  return { ok: true };
}

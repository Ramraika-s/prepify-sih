"use client";

import { useFetch as useQuery } from "@/lib/use-fetch";
const useQueryClient = () => ({ invalidateQueries: (...args: any[]) => {}, cancelQueries: (...args: any[]) => {}, clear: () => {} });
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, Check, Sparkles, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createOrderForPlan,
  verifyCheckoutCallback,
  validateCouponForPlan,
} from "@/app/actions/razorpay";
import { HoverTiltCard } from "@/components/ui/hover-tilt-card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Plan = {
  id: string; name: string; tier: string;
  billing_period: "monthly" | "quarterly" | "yearly" | "lifetime";
  price_inr: number; is_active: boolean;
};

declare global {
  interface Window { Razorpay?: new (opts: unknown) => { open: () => void } }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function UpgradeClient() {
  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();

  const [couponCode, setCouponCode] = useState("");
  const [couponInfo, setCouponInfo] = useState<null | { code: string; finalInr: number; discountInr: number; originalInr: number }>(null);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: plans = [], isLoading, error } = useQuery({
    queryKey: ["pricing-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans").select("*").eq("is_active", true)
        .order("price_inr", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Plan[];
    },
  });

  const { data: activeSub } = useQuery({
    queryKey: ["my-active-sub", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("id, plan_id, status, end_date, plans(name, tier)")
        .eq("user_id", user!.id).eq("status", "active")
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
  });

  useEffect(() => () => { if (pollRef.current) window.clearInterval(pollRef.current); }, []);

  const paidPlans = useMemo(() => plans.filter((p) => p.tier !== "free" && Number(p.price_inr) > 0), [plans]);
  const freePlan = useMemo(() => plans.find((p) => p.tier === "free"), [plans]);

  useGSAP(() => {
    if (plans.length > 0 && containerRef.current) {
      gsap.from(".plan-card", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.2)",
      });
    }
  }, { dependencies: [plans.length, isLoading], scope: containerRef });

  const startConfirmationPolling = (previousSubId: string | null | undefined) => {
    if (pollRef.current) window.clearInterval(pollRef.current);
    let ticks = 0;
    pollRef.current = window.setInterval(async () => {
      ticks++;
      const { data } = await supabase
        .from("subscriptions")
        .select("id, plan_id, status, plans(name, tier)")
        .eq("user_id", user!.id).eq("status", "active")
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (data && data.id !== previousSubId) {
        window.clearInterval(pollRef.current!); pollRef.current = null;
        setConfirmingOrderId(null); setPendingPlanId(null);
        qc.invalidateQueries({ queryKey: ["my-active-sub"] });
        const planName = (data as unknown as { plans?: { name?: string } }).plans?.name ?? "Premium";
        toast.success(`You're on ${planName}!`);
      }
      if (ticks > 40) {
        window.clearInterval(pollRef.current!); pollRef.current = null;
        setConfirmingOrderId(null);
        toast.message("Still processing — we'll update your account as soon as the payment confirms.");
      }
    }, 2000);
  };

  const handleBuy = async (plan: Plan) => {
    if (!user) { router.push("/auth"); return; }
    setPendingPlanId(plan.id);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) throw new Error("Failed to load payment SDK. Check your connection.");

      const order = await createOrderForPlan({ planId: plan.id, couponCode: couponInfo?.code });
      const previousSubId = activeSub?.id ?? null;

      const rzp = new window.Razorpay!({
        key: order.keyId,
        amount: order.amountPaise,
        currency: "INR",
        name: "Prepify",
        description: order.planName,
        order_id: order.orderId,
        prefill: { email: user.email ?? undefined, name: user.user_metadata?.display_name ?? undefined },
        theme: { color: "#6C4FF0" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verifyCheckoutCallback(resp);
            setConfirmingOrderId(order.orderId);
            toast.success("Payment received, activating your plan…");
            startConfirmationPolling(previousSubId);
          } catch (e) {
            toast.error((e as Error).message || "Payment verification failed");
            setPendingPlanId(null);
          }
        },
        modal: {
          ondismiss: () => {
            setPendingPlanId(null);
            toast.info("Checkout cancelled");
          },
        },
      });
      rzp.open();
    } catch (e) {
      toast.error((e as Error).message || "Could not start checkout");
      setPendingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen pb-24 text-white">
      <header className="sticky top-0 bg-black/40 backdrop-blur-2xl border-b border-white/10 z-30 shadow-antigravity">
        <div className="mx-auto max-w-lg px-5 py-4">
          <h1 className="font-heading font-bold text-2xl tracking-tight">Upgrade</h1>
          <p className="text-sm font-sans text-zinc-400">Unlock everything Prepify has to offer</p>
        </div>
      </header>

      <main ref={containerRef} className="mx-auto max-w-lg px-5 py-6 space-y-6">
        {activeSub && (
          <HoverTiltCard className="p-5 flex items-center gap-4 bg-primary/10 border-primary/30">
            <Sparkles className="text-primary" size={24} />
            <div className="text-sm font-sans">
              <div className="font-bold text-white text-lg">You're on {(activeSub as unknown as { plans?: { name?: string } }).plans?.name ?? "a paid plan"}</div>
              {activeSub.end_date && <div className="text-xs text-zinc-400 mt-0.5">Renews / expires {new Date(activeSub.end_date).toLocaleDateString()}</div>}
            </div>
          </HoverTiltCard>
        )}

        {isLoading && <div className="flex justify-center py-12"><Loader2 className="animate-spin text-zinc-400" size={32} /></div>}
        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm p-4 font-sans shadow-lg">Couldn't load plans. Please try again.</div>}

        <HoverTiltCard className="p-5 space-y-4">
          <div className="text-xs font-heading font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2"><Tag size={14} /> Have a coupon?</div>
          {couponInfo ? (
            <div className="flex items-center justify-between rounded-xl bg-primary/20 border border-primary/30 px-4 py-3 text-sm">
              <div className="font-sans text-zinc-200">
                <span className="font-bold text-white font-mono tracking-wider">{couponInfo.code}</span>
                <span className="text-zinc-400"> — you save ₹{couponInfo.discountInr.toLocaleString("en-IN")}</span>
              </div>
              <button onClick={() => { setCouponInfo(null); setCouponCode(""); }} className="text-zinc-400 hover:text-white transition-colors"><X size={16} /></button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              />
              <button
                disabled={!couponCode.trim() || paidPlans.length === 0}
                onClick={async () => {
                  const target = paidPlans[0];
                  if (!target) return;
                  try {
                    const info = await validateCouponForPlan({ code: couponCode.trim(), planId: target.id });
                    setCouponInfo(info);
                    toast.success("Coupon applied");
                  } catch (e) { toast.error((e as Error).message); }
                }}
                className="rounded-xl bg-white text-black px-5 py-2.5 text-sm font-bold disabled:opacity-50 hover:bg-zinc-200 transition-colors"
              >Apply</button>
            </div>
          )}
        </HoverTiltCard>

        {freePlan && (
          <PlanCard plan={freePlan} isCurrent={activeSub?.plan_id === freePlan.id} isFree onBuy={() => {}} loading={false} />
        )}

        {paidPlans.map((plan) => {
          const discounted = couponInfo ? couponInfo.finalInr : null;
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={activeSub?.plan_id === plan.id}
              discountedInr={discounted}
              loading={pendingPlanId === plan.id || confirmingOrderId !== null}
              onBuy={() => handleBuy(plan)}
              confirming={confirmingOrderId !== null && pendingPlanId === plan.id}
            />
          );
        })}

        {!isLoading && plans.length === 0 && (
          <HoverTiltCard className="p-8 text-center text-zinc-400 font-sans">
            No plans available yet.
          </HoverTiltCard>
        )}
      </main>
    </div>
  );
}

function PlanCard({ plan, isCurrent, isFree, discountedInr, onBuy, loading, confirming }: {
  plan: Plan;
  isCurrent: boolean;
  isFree?: boolean;
  discountedInr?: number | null;
  onBuy: () => void;
  loading: boolean;
  confirming?: boolean;
}) {
  const showDiscount = discountedInr != null && discountedInr < Number(plan.price_inr);
  return (
    <HoverTiltCard className={`plan-card p-6 ${isCurrent ? "border-primary/50 bg-primary/5" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-heading font-bold text-xl tracking-tight text-white">{plan.name}</div>
        <span className="text-[10px] font-heading uppercase tracking-widest font-bold rounded-full bg-white/10 px-3 py-1 text-zinc-300">{plan.tier}</span>
      </div>
      <div className="flex items-baseline gap-2 mb-5">
        {showDiscount ? (
          <>
            <span className="text-3xl font-heading font-extrabold text-shadow-metric text-white">₹{discountedInr!.toLocaleString("en-IN")}</span>
            <span className="text-sm font-mono text-zinc-500 line-through">₹{Number(plan.price_inr).toLocaleString("en-IN")}</span>
          </>
        ) : (
          <span className="text-3xl font-heading font-extrabold text-shadow-metric text-white">₹{Number(plan.price_inr).toLocaleString("en-IN")}</span>
        )}
        <span className="text-sm font-sans text-zinc-400">/ {plan.billing_period}</span>
      </div>

      {isCurrent ? (
        <div className="rounded-xl bg-black/40 border border-primary/50 text-primary text-sm font-bold px-4 py-3.5 text-center flex items-center justify-center gap-2">
          <Check size={18} /> Current plan
        </div>
      ) : isFree ? (
        <div className="text-sm font-sans text-zinc-500 text-center py-2">Included by default.</div>
      ) : (
        <button
          disabled={loading}
          onClick={onBuy}
          className="w-full rounded-xl bg-white text-black font-bold px-4 py-3.5 disabled:opacity-70 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
        >
          {confirming ? (<><Loader2 className="animate-spin" size={18} /> Activating…</>)
            : loading ? (<><Loader2 className="animate-spin" size={18} /> Please wait…</>)
            : "Upgrade Now"}
        </button>
      )}
    </HoverTiltCard>
  );
}

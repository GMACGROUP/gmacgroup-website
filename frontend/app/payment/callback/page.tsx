"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

export default function PaymentCallbackPage() {
  const [message, setMessage] = useState("Confirming your payment...");
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("tx_ref");
    const transactionId = params.get("transaction_id");

    if (!reference || !transactionId) {
      setSuccess(false);
      setMessage("The payment callback was incomplete. No enrolment or application was created.");
      return;
    }

    apiClient
      .get<{ status: string }>(`/payments/${encodeURIComponent(reference)}/verify?transaction_id=${encodeURIComponent(transactionId)}`)
      .then((result) => {
        setSuccess(result.status === "successful");
        setMessage(
          result.status === "successful"
            ? "Payment confirmed. Your enrolment or application is now recorded."
            : "Payment could not be confirmed. No enrolment or application was created."
        );
      })
      .catch((error) => {
        setSuccess(false);
        setMessage(error instanceof Error ? error.message : "Payment verification failed.");
      });
  }, []);

  return (
    <main className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
      <section className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-card p-8 text-center">
        <div className={`mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center text-2xl ${success === true ? "bg-emerald-50 text-emerald-700" : success === false ? "bg-red-50 text-brand-red" : "bg-slate-100 text-slate-500"}`}>
          {success === true ? "✓" : success === false ? "!" : "…"}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">
          {success === true ? "Payment confirmed" : success === false ? "Payment not confirmed" : "Checking payment"}
        </h1>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        {success !== null && (
          <Link href={success ? "/dashboard" : "/programmes"} className="inline-block mt-6 px-5 py-3 rounded-xl bg-brand-navy text-white text-sm font-bold">
            {success ? "Open dashboard" : "Return to programmes"}
          </Link>
        )}
      </section>
    </main>
  );
}

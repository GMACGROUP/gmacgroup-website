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
    <section className="border-b border-rule">
      <div className="wrap min-h-[55vh] py-20 sm:py-28">
        <p className="text-[12px] font-medium uppercase tracking-label text-clay">Payment</p>
        <h1 className="display-lg mt-4" role="status">
          {success === true ? "Payment confirmed." : success === false ? "Payment not confirmed." : "Checking your payment..."}
        </h1>
        <p className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-ink-600">{message}</p>
        {success === false && (
          <p className="mt-3 max-w-[56ch] text-[15px] text-ink-500">
            If money left your account, keep your Flutterwave receipt and{" "}
            <Link href="/contact?topic=programmes&subject=Payment%20query" className="text-accent underline underline-offset-4">contact us</Link>; we will
            sort it out.
          </p>
        )}
        {success !== null && (
          <Link href={success ? "/dashboard" : "/programmes"} className="btn-primary mt-10">
            {success ? "Go to your account" : "Back to programmes"}
          </Link>
        )}
      </div>
    </section>
  );
}

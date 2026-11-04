'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, CreditCard, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';

function StripePortalContent() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId') || 'cus_demo_pastdue';
  const returnUrl = searchParams.get('returnUrl') || '/';

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12 / 28');
  const [cvc, setCvc] = useState('888');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Stripe payment processing
    setTimeout(async () => {
      try {
        // Trigger recovery in local API
        await fetch(`/api/webhooks/stripe?projectId=dp_live_demo123`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'stripe-signature': 't=0,v1=dev_test_bypass',
          },
          body: JSON.stringify({
            type: 'invoice.payment_succeeded',
            data: {
              object: {
                customer: customerId,
                id: 'in_demo_recovered_' + Date.now(),
                amount_paid: 4900,
              },
            },
          }),
        }).catch(() => {});
      } catch {}

      setLoading(false);
      setSuccess(true);

      // Auto redirect back to returnUrl after 2.5s
      setTimeout(() => {
        window.location.href = returnUrl;
      }, 2500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between">
      {/* Stripe-style header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-extrabold text-blue-600 text-lg tracking-tight">stripe</div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Customer Portal Sandbox
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main card */}
      <main className="max-w-xl w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Method Updated!</h2>
              <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
                Your card has been verified and your subscription for <strong>$49.00</strong> was charged successfully.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                Returning to your application...
              </div>
              <div className="mt-6">
                <a
                  href={returnUrl}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Click here if you are not redirected automatically
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-100 pb-5 mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h1 className="text-xl font-bold text-slate-900">Update Payment Method</h1>
                  <span className="text-xs font-mono font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Past Due: $49.00
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Alex Mercer (<code className="font-mono">{customerId}</code>)
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-xs text-amber-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Sandbox Demo:</strong> This is a simulation of Stripe's native Billing Portal. No real card will be charged.
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Card Information</label>
                  <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white">
                    <div className="flex items-center px-3 py-2.5 border-b border-slate-200">
                      <CreditCard className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card number"
                        className="w-full text-sm font-mono text-slate-800 outline-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-slate-200">
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="px-3 py-2.5 text-sm font-mono text-slate-800 outline-none"
                        required
                      />
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="CVC"
                        className="px-3 py-2.5 text-sm font-mono text-slate-800 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    defaultValue="Alex Mercer"
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Billing Country</label>
                  <select className="w-full text-sm border border-slate-300 rounded-lg p-2.5 text-slate-800 bg-white focus:border-blue-500 focus:outline-none">
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Vietnam</option>
                    <option>Canada</option>
                    <option>Germany</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authorizing with Stripe...
                    </>
                  ) : (
                    'Save Card & Pay $49.00'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400">
        Powered by <strong>Stripe Billing Portal</strong> & <strong>DunningPulse</strong> · Zero PCI Scope
      </footer>
    </div>
  );
}

export default function StripePortalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Portal...</div>}>
      <StripePortalContent />
    </Suspense>
  );
}

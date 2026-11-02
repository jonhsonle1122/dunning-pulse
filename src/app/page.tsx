'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Mail, Layout, ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';

export default function LandingPage() {
  const [mrr, setMrr] = useState<number>(8000);
  const [failureRate, setFailureRate] = useState<number>(6); // 6% industry average

  const monthlyLost = Math.round(mrr * (failureRate / 100));
  const estimatedRecovered = Math.round(monthlyLost * 0.55); // 55% average recovery rate
  const annualRecovered = estimatedRecovered * 12;
  const roiMultiplier = Math.round(estimatedRecovered / 19);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              DP
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">DunningPulse</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Micro-SaaS Edition
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
            >
              Live Demo
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <Zap className="w-3.5 h-3.5" /> Stop losing $500–$2,000 every month to expired cards
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight sm:leading-none mb-6">
            Recover 30%–60% of failed Stripe payments on <span className="text-blue-600">autopilot</span>.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Default Stripe emails land in spam and lack in-app alerts. Enterprise tools charge $250/mo.
            DunningPulse gives you branded dunning emails and a 1-line in-app alert banner for just <strong>$19/month flat</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              Connect Stripe in 5 Minutes <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#calculator"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold hover:bg-slate-100 transition flex items-center justify-center"
            >
              Calculate Your Lost MRR
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero PCI Scope (SAQ-A)</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> No percentage revenue cuts</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 14-day free trial</span>
          </div>
        </div>
      </section>

      {/* Interactive Churn Loss Calculator */}
      <section id="calculator" className="py-16 px-4 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How much revenue are you leaking right now?
            </h2>
            <p className="text-slate-600 mt-2">
              Payment failures account for up to 40% of all SaaS subscription churn. Slide your metrics below:
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Slider 1: MRR */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Monthly Recurring Revenue (MRR)</label>
                  <span className="text-lg font-bold text-blue-600">${mrr.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={mrr}
                  onChange={(e) => setMrr(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>$1,000</span>
                  <span>$25,000</span>
                  <span>$50,000</span>
                </div>
              </div>

              {/* Slider 2: Failure Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Monthly Payment Failure Rate</label>
                  <span className="text-lg font-bold text-blue-600">{failureRate}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.5"
                  value={failureRate}
                  onChange={(e) => setFailureRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>2% (Low)</span>
                  <span>6% (Average)</span>
                  <span>12% (High)</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-center">
              <div className="p-4 rounded-xl bg-white border border-rose-100 shadow-sm">
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block mb-1">Estimated Monthly Loss</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">${monthlyLost.toLocaleString()}</span>
                <span className="text-xs text-slate-500 block mt-1">Lost to unrecovered cards</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">Est. Recovered with DunningPulse</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">${estimatedRecovered.toLocaleString()}</span>
                <span className="text-xs text-emerald-800 font-medium block mt-1">+${annualRecovered.toLocaleString()}/year back to MRR</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-sm flex flex-col justify-center">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block mb-1">Instant ROI Multiplier</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-700">{roiMultiplier}x ROI</span>
                <span className="text-xs text-blue-800 font-medium block mt-1">Pays for itself in 1–2 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Three surgical layers to catch failed payments
            </h2>
            <p className="text-slate-600 mt-2">
              Designed specifically for bootstrapped SaaS founders who want zero setup hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Branded Dunning Emails</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sent from your own custom domain (e.g. <code>billing@yourapp.com</code>) with proper DKIM/SPF so they actually reach the primary inbox, not the promotions folder.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Zero-Login 1-Click Update</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Deep-links directly to Stripe's secure Billing Portal. Customers update their credit card in 5 seconds without remembering complicated passwords or account logins.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. In-App Past-Due Banner</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Active users who ignore emails still see a clean alert banner inside your dashboard. Embeds via a single 1-line script tag with zero performance footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-10">
            Why Micro-SaaS founders choose DunningPulse
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-4">Feature</th>
                    <th className="p-4 text-blue-600 font-bold">DunningPulse</th>
                    <th className="p-4">Stripe Default</th>
                    <th className="p-4">Enterprise (Churnkey / Baremetrics)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-4 font-medium">Monthly Price</td>
                    <td className="p-4 text-blue-600 font-bold">$19 / month flat</td>
                    <td className="p-4">Free</td>
                    <td className="p-4 text-rose-600 font-medium">$133 – $250+ / month</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Revenue Cut / Take-rate</td>
                    <td className="p-4 text-emerald-600 font-semibold">0% (Zero)</td>
                    <td className="p-4">0%</td>
                    <td className="p-4 text-rose-600">Up to 1%–2% cut</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Custom Domain Email</td>
                    <td className="p-4 text-emerald-600 font-semibold">Yes (Your domain)</td>
                    <td className="p-4 text-slate-400">No (stripe.com)</td>
                    <td className="p-4 text-emerald-600">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">1-Line In-App Banner</td>
                    <td className="p-4 text-emerald-600 font-semibold">Yes (&lt;4KB script)</td>
                    <td className="p-4 text-slate-400">No</td>
                    <td className="p-4">Complex SDK integration</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Setup Time</td>
                    <td className="p-4 font-semibold text-slate-900">&lt; 5 minutes</td>
                    <td className="p-4">Instant</td>
                    <td className="p-4">1–2 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 px-4 bg-slate-950 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">Start saving lost subscriptions today</h2>
          <p className="text-slate-400 mb-8">
            Connect your Stripe account in 5 minutes with restricted read-only keys. Zero risk, 14-day free trial.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg transition"
          >
            Launch Live Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-xs text-slate-500 mt-6">
            © 2026 DunningPulse. All rights reserved. PCI-DSS SAQ-A compliant.
          </p>
        </div>
      </footer>
    </div>
  );
}


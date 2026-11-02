'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  ExternalLink, 
  Settings, 
  RefreshCw, 
  Send, 
  ShieldCheck,
  Zap,
  Copy,
  Check
} from 'lucide-react';

interface CustomerItem {
  id: string;
  stripeCustomerId: string;
  customerEmail: string;
  customerName: string;
  status: 'past_due' | 'recovered' | 'canceled';
  amountCents: number;
  dunningStep: number;
  failedAt: string;
}

export default function DashboardPage() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);

  // Initial state for demo presentation
  const [customers, setCustomers] = useState<CustomerItem[]>([
    {
      id: 'dc_01',
      stripeCustomerId: 'cus_N8xL92aBc1',
      customerEmail: 'david.wilson@techflow.io',
      customerName: 'David Wilson',
      status: 'past_due',
      amountCents: 4900,
      dunningStep: 1,
      failedAt: '2 hours ago',
    },
    {
      id: 'dc_02',
      stripeCustomerId: 'cus_K29xP14mQ8',
      customerEmail: 'elena.rostova@designlab.net',
      customerName: 'Elena Rostova',
      status: 'past_due',
      amountCents: 9900,
      dunningStep: 2,
      failedAt: '3 days ago',
    },
    {
      id: 'dc_03',
      stripeCustomerId: 'cus_M14vB78yZ3',
      customerEmail: 'marcus.tan@growthpulse.co',
      customerName: 'Marcus Tan',
      status: 'recovered',
      amountCents: 7900,
      dunningStep: 1,
      failedAt: 'Yesterday',
    },
    {
      id: 'dc_04',
      stripeCustomerId: 'cus_P77tK90rA4',
      customerEmail: 'sarah.jenkins@hypercloud.dev',
      customerName: 'Sarah Jenkins',
      status: 'recovered',
      amountCents: 12900,
      dunningStep: 1,
      failedAt: '4 days ago',
    },
  ]);

  const recoveredCount = customers.filter((c) => c.status === 'recovered').length;
  const recoveredAmount = customers
    .filter((c) => c.status === 'recovered')
    .reduce((sum, c) => sum + c.amountCents, 0) / 100;

  const pastDueCount = customers.filter((c) => c.status === 'past_due').length;
  const pastDueAmount = customers
    .filter((c) => c.status === 'past_due')
    .reduce((sum, c) => sum + c.amountCents, 0) / 100;

  const recoveryRate = Math.round((recoveredCount / customers.length) * 100);

  // Copy portal link
  const handleCopy = (id: string, customerId: string) => {
    const link = `https://billing.stripe.com/p/session/test_${customerId}?flow=payment_method_update`;
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Simulate webhook test
  const handleSimulatePayment = (action: 'fail' | 'recover') => {
    setSimulationLoading(true);
    setTimeout(() => {
      if (action === 'fail') {
        const newCustomer: CustomerItem = {
          id: `dc_${Date.now()}`,
          stripeCustomerId: `cus_${Math.random().toString(36).substring(2, 8)}`,
          customerEmail: `test.${Math.floor(Math.random() * 900 + 100)}@startup.com`,
          customerName: 'Simulated User',
          status: 'past_due',
          amountCents: 4900,
          dunningStep: 1,
          failedAt: 'Just now',
        };
        setCustomers([newCustomer, ...customers]);
      } else {
        // Recover first past-due customer
        const updated = customers.map((c) => {
          if (c.status === 'past_due') {
            return { ...c, status: 'recovered' as const, failedAt: 'Just recovered' };
          }
          return c;
        });
        setCustomers(updated);
      }
      setSimulationLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                DP
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">DunningPulse</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-md text-sm font-semibold bg-slate-100 text-slate-900">
                Recovery Overview
              </Link>
              <Link href="/dashboard/settings" className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
                Settings & In-App Banner
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/settings"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600">Stripe Live Listener</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Recovered MRR</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">${recoveredAmount.toFixed(2)}</div>
            <span className="text-xs text-slate-500 mt-1 block">{recoveredCount} subscriptions saved</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">At Risk (Past-Due)</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-rose-600">${pastDueAmount.toFixed(2)}</div>
            <span className="text-xs text-slate-500 mt-1 block">{pastDueCount} accounts currently delinquent</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Recovery Success Rate</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-blue-600">{recoveryRate}%</div>
            <span className="text-xs text-slate-500 mt-1 block">Industry benchmark: 35%–45%</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Campaigns</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{pastDueCount}</div>
            <span className="text-xs text-slate-500 mt-1 block">Day 0–5 email + in-app banners</span>
          </div>
        </div>

        {/* Action / Simulation Bar */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Sandbox Test Simulator</h4>
              <p className="text-xs text-slate-600">Test how DunningPulse reacts to incoming Stripe webhook events without real cards.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleSimulatePayment('fail')}
              disabled={simulationLoading}
              className="flex-1 sm:flex-none text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-1.5"
            >
              Simulate Payment Failed
            </button>
            <button
              onClick={() => handleSimulatePayment('recover')}
              disabled={simulationLoading}
              className="flex-1 sm:flex-none text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-1.5"
            >
              Simulate Payment Recovered
            </button>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-8">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Delinquent & Recovered Subscribers</h3>
              <p className="text-xs text-slate-500 mt-0.5">Track every customer undergoing recovery with automated deep links.</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {customers.length} total events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Past-Due Amount</th>
                  <th className="p-4">Current Step</th>
                  <th className="p-4">Event Time</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{c.customerName}</div>
                      <div className="text-xs text-slate-500 font-mono">{c.customerEmail}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.stripeCustomerId}</div>
                    </td>
                    <td className="p-4">
                      {c.status === 'past_due' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Past Due
                        </span>
                      )}
                      {c.status === 'recovered' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Recovered
                        </span>
                      )}
                      {c.status === 'canceled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          Canceled
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      ${(c.amountCents / 100).toFixed(2)}
                    </td>
                    <td className="p-4">
                      {c.status === 'past_due' ? (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Day {c.dunningStep === 1 ? '0' : c.dunningStep === 2 ? '3' : '5'} Notice
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {c.failedAt}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleCopy(c.id, c.stripeCustomerId)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-xs"
                        title="Copy direct 1-click update link"
                      >
                        {copiedLink === c.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy 1-Click Link
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}


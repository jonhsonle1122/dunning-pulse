'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, Eye, Layout, Lock, Save, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const [projectId] = useState('dp_live_demo123');
  const [origin, setOrigin] = useState('https://dunning-pulse-theta.vercel.app');
  const [bannerText, setBannerText] = useState(
    'Your subscription renewal failed. Please update your payment method to maintain uninterrupted service.'
  );
  const [buttonText, setButtonText] = useState('Update Payment Method');
  const [primaryColor, setPrimaryColor] = useState('#dc2626'); // Danger red default
  const [bannerEnabled, setBannerEnabled] = useState(true);

  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const snippetCode = `<script\n  src="${origin}/banner.js"\n  data-project-id="${projectId}"\n  data-customer-id="{{stripe_customer_id}}"\n  async>\n</script>`;

  const webhookUrl = `${origin}/api/webhooks/stripe?projectId=${projectId}`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(snippetCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <span className="font-bold text-lg text-slate-900">Settings & In-App Banner</span>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedSuccess ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Configuration */}
          <div className="lg:col-span-7 space-y-6">
            {/* Stripe Webhook Integration Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" /> 1. Stripe Webhook Integration
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Add this endpoint to your Stripe Dashboard under Developers &gt; Webhooks.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Your Unique Webhook URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={webhookUrl}
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyWebhook}
                      className="px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shrink-0"
                    >
                      {copiedWebhook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Webhook Signing Secret</label>
                  <input
                    type="password"
                    placeholder="whsec_..."
                    defaultValue="whsec_demo_secret_encrypted"
                    className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-blue-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Encrypted at rest using AES-256-GCM.</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Stripe Restricted API Key</label>
                  <input
                    type="password"
                    placeholder="rk_test_... (Requires billing_portal permissions)"
                    defaultValue="rk_test_sample_restricted_key"
                    className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-blue-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Only requires permission to create <code>billing_portal/sessions</code>. Never grant full admin keys.
                  </span>
                </div>
              </div>
            </div>

            {/* In-App Banner Customization Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Layout className="w-4 h-4 text-blue-600" /> 2. In-App Banner Customizer
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Configure how the alert appears when a delinquent subscriber logs into your app.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-800">Enable In-App Banner</span>
                  <input
                    type="checkbox"
                    checked={bannerEnabled}
                    onChange={(e) => setBannerEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Banner Notice Message</label>
                  <textarea
                    rows={2}
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Button Call to Action</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Banner Theme Color</label>
                  <div className="flex items-center gap-3">
                    {[
                      { name: 'Red', hex: '#dc2626' },
                      { name: 'Orange', hex: '#ea580c' },
                      { name: 'Blue', hex: '#2563eb' },
                      { name: 'Slate', hex: '#334155' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setPrimaryColor(c.hex)}
                        className={`w-8 h-8 rounded-full border-2 transition ${primaryColor === c.hex ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-24 text-xs font-mono border border-slate-200 rounded-lg p-2 text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Embed Code Snippet Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900">3. Embed Snippet</h3>
                <button
                  type="button"
                  onClick={handleCopySnippet}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-md transition"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSnippet ? 'Copied!' : 'Copy Snippet'}
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Paste this into your SaaS dashboard HTML (e.g. before the closing <code>&lt;/body&gt;</code> tag):
              </p>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed select-all">
                {snippetCode}
              </pre>
            </div>
          </div>

          {/* Right Column: Live Visual Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Live In-App Preview
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Mock SaaS Dashboard
                </span>
              </div>

              {/* Mock App Window */}
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-lg bg-white">
                {/* Browser bar */}
                <div className="h-8 bg-slate-100 border-b border-slate-200 px-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span>Preview: app.customer-website.com</span>
                  <span className="text-[10px] text-slate-400 font-sans font-medium bg-slate-200 px-1.5 py-0.5 rounded">Mô phỏng</span>
                </div>

                {/* Banner Render Preview */}
                {bannerEnabled && (
                  <div
                    className="p-3 text-white transition-all shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="shrink-0 font-bold">⚠️</span>
                        <span>{bannerText}</span>
                      </div>
                      <button
                        type="button"
                        style={{ color: primaryColor }}
                        className="bg-white font-bold px-3 py-1 rounded shadow-xs shrink-0 text-[11px] hover:opacity-95"
                      >
                        {buttonText}
                      </button>
                    </div>
                  </div>
                )}

                {/* Mock Customer App Content */}
                <div className="p-5 bg-slate-50/60 min-h-[260px] space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">APP</div>
                      <div className="text-xs font-bold text-slate-700">Customer SaaS Dashboard</div>
                    </div>
                    <div className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">Active User</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Workspace API Usage</div>
                      <div className="text-sm font-bold text-slate-800 mt-1">84,210 / 100k</div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-500 h-full w-[84%]" />
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Projects</div>
                      <div className="text-sm font-bold text-slate-800 mt-1">12 Projects</div>
                      <div className="text-[10px] text-emerald-600 mt-1">● All services normal</div>
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Recent Activity</div>
                    <div className="text-xs text-slate-600">Logged in from Chrome (Windows) · 10m ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


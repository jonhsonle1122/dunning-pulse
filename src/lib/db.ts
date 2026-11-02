import fs from 'node:fs';
import path from 'node:path';
import { Account, DunningCustomer, RecoveryEvent, BannerSettings, RecoveryMetrics } from '../types';

interface DatabaseState {
  accounts: Account[];
  customers: DunningCustomer[];
  events: RecoveryEvent[];
  bannerSettings: BannerSettings[];
}

// Default initial state
const defaultState: DatabaseState = {
  accounts: [
    {
      id: 'acc_demo_01',
      email: 'founder@example.com',
      projectId: 'dp_live_demo123',
      senderEmail: 'billing@example.com',
      senderName: 'SaaS Pulse Team',
      createdAt: new Date().toISOString(),
    },
  ],
  customers: [
    {
      id: 'dc_01',
      accountId: 'acc_demo_01',
      stripeCustomerId: 'cus_demo_pastdue',
      customerEmail: 'alex@customer.com',
      customerName: 'Alex Mercer',
      status: 'past_due',
      pastDueAmountCents: 4900,
      currency: 'usd',
      firstFailedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      currentDunningStep: 1,
      lastEmailSentAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dc_02',
      accountId: 'acc_demo_01',
      stripeCustomerId: 'cus_demo_recovered',
      customerEmail: 'sarah@startup.io',
      customerName: 'Sarah Connor',
      status: 'recovered',
      pastDueAmountCents: 9900,
      currency: 'usd',
      firstFailedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      recoveredAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      currentDunningStep: 1,
      lastEmailSentAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  events: [
    {
      id: 'ev_01',
      accountId: 'acc_demo_01',
      dunningCustomerId: 'dc_01',
      eventType: 'payment_failed',
      stripeInvoiceId: 'in_123456',
      amountCents: 4900,
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'ev_02',
      accountId: 'acc_demo_01',
      dunningCustomerId: 'dc_02',
      eventType: 'payment_succeeded',
      stripeInvoiceId: 'in_789012',
      amountCents: 9900,
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
  ],
  bannerSettings: [
    {
      accountId: 'acc_demo_01',
      bannerText: 'Your subscription renewal failed. Please update your payment method to maintain uninterrupted service.',
      buttonText: 'Update Payment Method',
      primaryColor: '#dc2626',
      enabled: true,
    },
  ],
};

class MemoryStore {
  private state: DatabaseState;
  private filePath?: string;

  constructor() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    // Optional file persistence for local development
    try {
      const dataDir = path.resolve(process.cwd(), '.data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      this.filePath = path.join(dataDir, 'db.json');
      if (fs.existsSync(this.filePath)) {
        this.state = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      }
    } catch {
      // In-memory fallback
    }
  }

  private persist() {
    if (this.filePath && process.env.NODE_ENV !== 'test') {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(this.state, null, 2), 'utf8');
      } catch {}
    }
  }

  // Account operations
  getAccountByProjectId(projectId: string): Account | undefined {
    return this.state.accounts.find((a) => a.projectId === projectId);
  }

  getAccountById(id: string): Account | undefined {
    return this.state.accounts.find((a) => a.id === id);
  }

  saveAccount(account: Account): Account {
    const idx = this.state.accounts.findIndex((a) => a.id === account.id);
    if (idx >= 0) {
      this.state.accounts[idx] = account;
    } else {
      this.state.accounts.push(account);
    }
    this.persist();
    return account;
  }

  // Customer operations
  getCustomer(accountId: string, stripeCustomerId: string): DunningCustomer | undefined {
    return this.state.customers.find((c) => c.accountId === accountId && c.stripeCustomerId === stripeCustomerId);
  }

  getCustomersByAccount(accountId: string): DunningCustomer[] {
    return this.state.customers.filter((c) => c.accountId === accountId);
  }

  saveCustomer(customer: DunningCustomer): DunningCustomer {
    const idx = this.state.customers.findIndex((c) => c.id === customer.id);
    customer.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      this.state.customers[idx] = customer;
    } else {
      this.state.customers.push(customer);
    }
    this.persist();
    return customer;
  }

  // Event operations
  logEvent(event: Omit<RecoveryEvent, 'id' | 'createdAt'>): RecoveryEvent {
    const fullEvent: RecoveryEvent = {
      ...event,
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.state.events.unshift(fullEvent);
    this.persist();
    return fullEvent;
  }

  getEventsByAccount(accountId: string, limit = 20): RecoveryEvent[] {
    return this.state.events.filter((e) => e.accountId === accountId).slice(0, limit);
  }

  // Banner Settings
  getBannerSettings(accountId: string): BannerSettings {
    const settings = this.state.bannerSettings.find((s) => s.accountId === accountId);
    if (settings) return settings;
    return {
      accountId,
      bannerText: 'Your subscription renewal failed. Please update your payment method to maintain uninterrupted service.',
      buttonText: 'Update Payment Method',
      primaryColor: '#dc2626',
      enabled: true,
    };
  }

  saveBannerSettings(settings: BannerSettings): BannerSettings {
    const idx = this.state.bannerSettings.findIndex((s) => s.accountId === settings.accountId);
    if (idx >= 0) {
      this.state.bannerSettings[idx] = settings;
    } else {
      this.state.bannerSettings.push(settings);
    }
    this.persist();
    return settings;
  }

  // Recovery Metrics
  getMetrics(accountId: string): RecoveryMetrics {
    const customers = this.getCustomersByAccount(accountId);
    const pastDue = customers.filter((c) => c.status === 'past_due');
    const recovered = customers.filter((c) => c.status === 'recovered');

    const totalPastDueCents = pastDue.reduce((sum, c) => sum + c.pastDueAmountCents, 0);
    const totalRecoveredCents = recovered.reduce((sum, c) => sum + c.pastDueAmountCents, 0);
    const totalFinished = recovered.length + customers.filter((c) => c.status === 'canceled').length;
    const recoveryRatePercent = totalFinished > 0 ? Math.round((recovered.length / totalFinished) * 100) : (recovered.length > 0 ? 100 : 0);

    return {
      totalPastDueCount: pastDue.length,
      totalPastDueCents,
      totalRecoveredCount: recovered.length,
      totalRecoveredCents,
      recoveryRatePercent,
      activeCampaignsCount: pastDue.length,
    };
  }

  // Testing Reset Helper
  resetForTesting() {
    this.state = JSON.parse(JSON.stringify(defaultState));
  }
}

export const db = new MemoryStore();


import { db } from '../lib/db';
import { createPaymentMethodUpdateSession } from '../lib/stripe';
import { decryptSecret } from '../lib/crypto';
import { CustomerStatusResponse } from '../types';

export class BannerService {
  async getCustomerBannerStatus(projectId: string, stripeCustomerId: string): Promise<CustomerStatusResponse> {
    const account = db.getAccountByProjectId(projectId);
    if (!account) {
      return { pastDue: false };
    }

    const customer = db.getCustomer(account.id, stripeCustomerId);
    if (!customer || customer.status !== 'past_due') {
      return { pastDue: false };
    }

    const settings = db.getBannerSettings(account.id);
    if (!settings.enabled) {
      return { pastDue: false };
    }

    // Generate fresh 1-click update session for the banner button
    let stripeKey = 'sk_test_mock_default_key';
    if (account.stripeRestrictedKeyEncrypted) {
      try {
        stripeKey = decryptSecret(account.stripeRestrictedKeyEncrypted);
      } catch {}
    }

    const returnUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dunning-pulse-theta.vercel.app';
    let updateUrl = '#';
    try {
      const session = await createPaymentMethodUpdateSession({
        stripeSecretKey: stripeKey,
        customerId: stripeCustomerId,
        returnUrl,
      });
      updateUrl = session.url;
    } catch {
      updateUrl = 'https://billing.stripe.com';
    }

    return {
      pastDue: true,
      bannerText: settings.bannerText,
      buttonText: settings.buttonText,
      primaryColor: settings.primaryColor,
      updateUrl,
    };
  }
}

export const bannerService = new BannerService();


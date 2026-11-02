import { renderDunningEmail, DunningEmailParams } from './email-templates';

export interface SendDunningEmailParams extends DunningEmailParams {
  toEmail: string;
  fromEmail?: string;
  resendApiKey?: string;
}

export async function sendDunningEmail(params: SendDunningEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const { toEmail, fromEmail, resendApiKey } = params;
  const { subject, html, text } = renderDunningEmail(params);

  const apiKey = resendApiKey || process.env.RESEND_API_KEY;
  const sender = fromEmail || process.env.DEFAULT_FROM_EMAIL || 'billing@dunningpulse.com';

  // If running in development/test or API key is not configured, simulate delivery safely
  if (!apiKey || apiKey.startsWith('re_mock') || process.env.NODE_ENV === 'test') {
    return {
      success: true,
      id: `msg_mock_${Date.now()}`,
    };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [toEmail],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: (errData as any)?.message || res.statusText };
    }

    const data = (await res.json()) as { id: string };
    return { success: true, id: data.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown network error sending email' };
  }
}


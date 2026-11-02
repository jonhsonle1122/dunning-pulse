export interface DunningEmailParams {
  customerName?: string;
  senderName: string;
  appName: string;
  amountFormatted: string;
  updateUrl: string;
  step: 1 | 2 | 3; // 1: Day 0, 2: Day 3, 3: Day 5
  supportEmail?: string;
}

export function renderDunningEmail(params: DunningEmailParams): { subject: string; html: string; text: string } {
  const { customerName, senderName, appName, amountFormatted, updateUrl, step, supportEmail } = params;
  const greeting = customerName ? `Hi ${customerName},` : 'Hi there,';

  let subject = '';
  let headline = '';
  let mainBody = '';
  let urgencyNotice = '';

  if (step === 1) {
    subject = `Action required: Failed payment for your ${appName} subscription`;
    headline = 'Payment could not be processed';
    mainBody = `We were unable to process your recent renewal of <strong>${amountFormatted}</strong> for your <strong>${appName}</strong> subscription. This usually happens when a card expires or a bank requests additional authorization.`;
    urgencyNotice = 'Please take a moment to update your payment method to ensure uninterrupted service.';
  } else if (step === 2) {
    subject = `Reminder: Please update your payment method for ${appName}`;
    headline = 'Friendly reminder: Outstanding payment';
    mainBody = `We recently tried to process your subscription renewal of <strong>${amountFormatted}</strong> for <strong>${appName}</strong>, but the payment failed.`;
    urgencyNotice = 'Your account access remains active, but please update your billing details soon so your service is not paused.';
  } else {
    subject = `Final notice: Your ${appName} subscription is about to be paused`;
    headline = 'Final notice regarding your account';
    mainBody = `This is our final reminder regarding the outstanding balance of <strong>${amountFormatted}</strong> on your <strong>${appName}</strong> account.`;
    urgencyNotice = 'If you do not update your payment method, your subscription will be canceled and access to your premium features will be restricted.';
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #f3f4f6; background-color: #ffffff;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #111827;">${appName}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #b91c1c;">${headline}</h2>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #374151;">${greeting}</p>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #374151;">${mainBody}</p>
              <p style="margin: 0 0 28px; font-size: 15px; line-height: 1.6; color: #4b5563;">${urgencyNotice}</p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${updateUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 12px 28px; border-radius: 6px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                      Update Payment Method
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 28px 0 0; font-size: 13px; line-height: 1.5; color: #6b7280; text-align: center;">
                This link takes you directly to a secure, encrypted billing portal hosted by Stripe.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; font-size: 13px; color: #9ca3af; text-align: center;">
              Sent by ${senderName} on behalf of ${appName}.<br>
              ${supportEmail ? `Need help? Reply to this email or contact <a href="mailto:${supportEmail}" style="color: #4b5563;">${supportEmail}</a>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
${appName}
${headline}

${greeting}

${mainBody.replace(/<[^>]+>/g, '')}
${urgencyNotice}

Update your payment details via our secure billing portal:
${updateUrl}

Sent by ${senderName} on behalf of ${appName}.
${supportEmail ? `Need help? Contact: ${supportEmail}` : ''}
  `.trim();

  return { subject, html, text };
}


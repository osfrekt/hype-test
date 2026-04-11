import { Resend } from "resend";

const FROM_EMAIL = "HypeTest <reports@hypetest.ai>";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendResearchReport(email: string, productName: string, resultId: string) {
  const reportUrl = `https://hypetest.ai/research/${resultId}`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your HypeTest report: ${productName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 32px;">
          <strong style="font-size: 18px; color: #1a1f36;">HypeTest</strong>
        </div>
        <h1 style="font-size: 22px; color: #1a1f36; margin-bottom: 8px;">Your research is ready</h1>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Consumer research for <strong>${productName}</strong> is complete.
          Your report includes purchase intent, willingness-to-pay, feature importance, and consumer concerns.
        </p>
        <a href="${reportUrl}" style="display: inline-block; background: #1a1f36; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          View your report
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; line-height: 1.5;">
          This link is permanent. You can share it with anyone.
          <br/>Results are AI-simulated, not from real consumers.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 11px;">
          Rekt Brands Inc. | 1207 Delaware Ave, #4069, Wilmington, DE 19806
          <br/>
          <a href="https://hypetest.ai/privacy" style="color: #94a3b8;">Privacy Policy</a>
        </p>
      </div>
    `,
  });
}

export async function sendDiscoveryReport(email: string, brandName: string, resultId: string) {
  const reportUrl = `https://hypetest.ai/discover/${resultId}`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Product Discovery results: ${brandName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 32px;">
          <strong style="font-size: 18px; color: #1a1f36;">HypeTest</strong>
        </div>
        <h1 style="font-size: 22px; color: #1a1f36; margin-bottom: 8px;">Your discovery results are ready</h1>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Product Discovery for <strong>${brandName}</strong> is complete.
          We generated and tested product concepts with a simulated consumer panel. See which concepts scored highest.
        </p>
        <a href="${reportUrl}" style="display: inline-block; background: #1a1f36; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          View your results
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; line-height: 1.5;">
          This link is permanent. You can share it with anyone.
          <br/>Results are AI-simulated, not from real consumers.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 11px;">
          Rekt Brands Inc. | 1207 Delaware Ave, #4069, Wilmington, DE 19806
          <br/>
          <a href="https://hypetest.ai/privacy" style="color: #94a3b8;">Privacy Policy</a>
        </p>
      </div>
    `,
  });
}

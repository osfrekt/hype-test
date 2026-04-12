import { Resend } from "resend";

const FROM_EMAIL = "HypeTest <reports@hypetest.ai>";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FOOTER = `
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <p style="color: #94a3b8; font-size: 11px; line-height: 1.6;">
    Rekt Brands Inc. | 1207 Delaware Ave, #4069, Wilmington, DE 19806
    <br/>
    <a href="https://hypetest.ai/privacy" style="color: #94a3b8;">Privacy Policy</a>
    &nbsp;|&nbsp;
    <a href="https://hypetest.ai/terms" style="color: #94a3b8;">Terms of Service</a>
  </p>
  <p style="color: #94a3b8; font-size: 10px; margin-top: 8px;">
    This is a transactional email sent because you submitted research on HypeTest.
    If you did not request this, please ignore this email or contact
    <a href="mailto:support@hypetest.ai" style="color: #94a3b8;">support@hypetest.ai</a>.
  </p>
`;

export async function sendFollowUpEmail(email: string, productName: string, intentScore: number) {
  const suggestions = intentScore >= 60
    ? [
        { title: "Test your pricing", desc: "Find the revenue-maximizing price point", href: "https://hypetest.ai/pricing-test/new" },
        { title: "A/B test concepts", desc: "Compare two versions of your product", href: "https://hypetest.ai/ab-test/new" },
        { title: "Test your product name", desc: "See which name resonates most", href: "https://hypetest.ai/name-test/new" },
      ]
    : [
        { title: "Try a different concept", desc: "Test an alternative product idea", href: "https://hypetest.ai/research/new" },
        { title: "Find your audience", desc: "Discover which demographic wants this most", href: "https://hypetest.ai/audience-test/new" },
        { title: "Discover new products", desc: "Let AI generate concepts for your brand", href: "https://hypetest.ai/discover/new" },
      ];

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Next steps for ${productName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <strong style="font-size: 18px; color: #1a1f36;">HypeTest</strong>
        <h1 style="font-size: 20px; color: #1a1f36; margin: 24px 0 8px;">Your research on ${productName} scored ${intentScore}% purchase intent</h1>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          ${intentScore >= 60
            ? "Strong results. Here are the next steps to refine your product before launch:"
            : "The results suggest room for improvement. Here are ways to iterate:"}
        </p>
        ${suggestions.map(s => `
          <div style="background: #f8fafc; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px;">
            <a href="${s.href}" style="color: #1a1f36; font-weight: 600; font-size: 14px; text-decoration: none;">${s.title}</a>
            <p style="color: #64748b; font-size: 12px; margin: 4px 0 0;">${s.desc}</p>
          </div>
        `).join("")}
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
          This is a one-time follow-up based on your research results.
        </p>
        ${FOOTER}
      </div>
    `,
  });
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
          AI-simulated consumer research for <strong>${productName}</strong> is complete.
          Your report includes purchase intent, willingness-to-pay, feature importance, and consumer concerns.
        </p>
        <a href="${reportUrl}" style="display: inline-block; background: #1a1f36; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          View your report
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; line-height: 1.5;">
          This link is permanent and accessible to anyone who has it.
          <br/>Results are AI-simulated and should be used for directional insights only, not high-stakes decisions.
        </p>
        ${FOOTER}
      </div>
    `,
  });
}

export async function sendAbTestReport(email: string, nameA: string, nameB: string, resultId: string) {
  const reportUrl = `https://hypetest.ai/ab-test/${resultId}`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your A/B Test: ${nameA} vs ${nameB}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 32px;">
          <strong style="font-size: 18px; color: #1a1f36;">HypeTest</strong>
        </div>
        <h1 style="font-size: 22px; color: #1a1f36; margin-bottom: 8px;">Your A/B test results are ready</h1>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          AI-simulated A/B concept test for <strong>${nameA}</strong> vs <strong>${nameB}</strong> is complete.
          See which concept won with the same consumer panel.
        </p>
        <a href="${reportUrl}" style="display: inline-block; background: #1a1f36; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          View your results
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; line-height: 1.5;">
          This link is permanent and accessible to anyone who has it.
          <br/>Results are AI-simulated and should be used for directional insights only, not high-stakes decisions.
        </p>
        ${FOOTER}
      </div>
    `,
  });
}

export async function sendNameTestReport(email: string, names: string[], resultId: string) {
  const reportUrl = `https://hypetest.ai/name-test/${resultId}`;
  const nameList = names.join(", ");

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Name Test results: ${nameList}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 32px;">
          <strong style="font-size: 18px; color: #1a1f36;">HypeTest</strong>
        </div>
        <h1 style="font-size: 22px; color: #1a1f36; margin-bottom: 8px;">Your name test results are ready</h1>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          AI-simulated name testing for <strong>${nameList}</strong> is complete.
          See which names ranked highest with the consumer panel.
        </p>
        <a href="${reportUrl}" style="display: inline-block; background: #1a1f36; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          View your results
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; line-height: 1.5;">
          This link is permanent and accessible to anyone who has it.
          <br/>Results are AI-simulated and should be used for directional insights only, not high-stakes decisions.
        </p>
        ${FOOTER}
      </div>
    `,
  });
}

export async function sendAdTestReport(email: string, creativeNames: string[], resultId: string) {
  const reportUrl = `https://hypetest.ai/ad-test/${resultId}`;
  const nameList = creativeNames.join(" vs ");

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Ad Test results: ${nameList}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 32px;">
          <strong style="font-size: 18px; color: #1a1f36;">HypeTest</strong>
        </div>
        <h1 style="font-size: 22px; color: #1a1f36; margin-bottom: 8px;">Your ad test results are ready</h1>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          AI-simulated ad creative testing for <strong>${nameList}</strong> is complete.
          See attention, clarity, persuasion, and click likelihood scores from the consumer panel.
        </p>
        <a href="${reportUrl}" style="display: inline-block; background: #1a1f36; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          View your results
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; line-height: 1.5;">
          This link is permanent and accessible to anyone who has it.
          <br/>Results are AI-simulated and should be used for directional insights only, not high-stakes decisions.
        </p>
        ${FOOTER}
      </div>
    `,
  });
}

export async function sendLogoTestReport(email: string, logoNames: string[], resultId: string) {
  const reportUrl = `https://hypetest.ai/logo-test/${resultId}`;
  const nameList = logoNames.join(", ");

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Logo Test results: ${nameList}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 32px;">
          <strong style="font-size: 18px; color: #1a1f36;">HypeTest</strong>
        </div>
        <h1 style="font-size: 22px; color: #1a1f36; margin-bottom: 8px;">Your logo test results are ready</h1>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          AI-simulated logo testing for <strong>${nameList}</strong> is complete.
          See first impression, memorability, brand fit, distinctiveness, and trust scores from the consumer panel.
        </p>
        <a href="${reportUrl}" style="display: inline-block; background: #1a1f36; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          View your results
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; line-height: 1.5;">
          This link is permanent and accessible to anyone who has it.
          <br/>Results are AI-simulated and should be used for directional insights only, not high-stakes decisions.
        </p>
        ${FOOTER}
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
          AI-simulated Product Discovery for <strong>${brandName}</strong> is complete.
          We generated and tested product concepts with a simulated consumer panel. See which concepts scored highest.
        </p>
        <a href="${reportUrl}" style="display: inline-block; background: #1a1f36; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          View your results
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; line-height: 1.5;">
          This link is permanent and accessible to anyone who has it.
          <br/>Results are AI-simulated and should be used for directional insights only, not high-stakes decisions.
        </p>
        ${FOOTER}
      </div>
    `,
  });
}

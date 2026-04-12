export async function sendSlackNotification(
  webhookUrl: string,
  productName: string,
  intentScore: number,
  wtpMid: number,
  resultUrl: string
) {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `HypeTest Research Complete: *${productName}*`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: `Research Complete: ${productName}` },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Purchase Intent:*\n${intentScore}%` },
            { type: "mrkdwn", text: `*Estimated WTP:*\n$${wtpMid}` },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "View Report" },
              url: resultUrl,
            },
          ],
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "AI-simulated research via HypeTest. Not real consumer data.",
            },
          ],
        },
      ],
    }),
  });
}

export async function sendDiscoverySlackNotification(
  webhookUrl: string,
  brandName: string,
  topConceptName: string,
  topConceptIntent: number,
  resultUrl: string
) {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `HypeTest Discovery Complete: *${brandName}*`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: `Discovery Complete: ${brandName}` },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Top Concept:*\n${topConceptName}` },
            { type: "mrkdwn", text: `*Purchase Intent:*\n${topConceptIntent}%` },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "View Results" },
              url: resultUrl,
            },
          ],
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "AI-simulated research via HypeTest. Not real consumer data.",
            },
          ],
        },
      ],
    }),
  });
}

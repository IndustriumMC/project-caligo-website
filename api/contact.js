const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 12_000;
const MIN_FORM_TIME_MS = 1_200;
const RATE_LIMIT_MS = 30_000;
const recentRequests = new Map();

const successPage = (message) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#06080f"><title>Project Caligo | Contact</title>
<style>html{color-scheme:dark;background:#06080f;color:#edf1ff;font-family:Avenir,"Helvetica Neue",Arial,sans-serif}body{display:grid;min-height:100vh;margin:0;padding:2rem;place-items:center}.panel{width:min(90vw,42rem);border-top:2px solid #8d9bff;padding-top:2rem}p{color:#9da8c2;line-height:1.7}a{display:inline-block;margin-top:1.5rem;color:#b9c4ff}</style></head>
<body><main class="panel"><h1>${message}</h1><p>A Caligo team member will reply by email.</p><a href="/#contact">Return to Project Caligo</a></main></body></html>`;

const errorPage = (message) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#06080f"><title>Project Caligo | Contact</title></head>
<body style="margin:0;padding:3rem;background:#06080f;color:#edf1ff;font-family:Arial,sans-serif"><main><h1>We couldn’t send your request.</h1><p>${message}</p><p><a style="color:#b9c4ff" href="mailto:contact@industrium.net">Email contact@industrium.net</a> or <a style="color:#b9c4ff" href="/#contact">return to the form</a>.</p></main></body></html>`;

const sendResult = (response, status, body, html = false) => {
  response.statusCode = status;
  response.setHeader("Cache-Control", "no-store");
  if (html) {
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(status >= 400 ? errorPage(body.error) : successPage("Request received."));
    return;
  }
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
};

const readBody = async (request, contentType) => {
  if (request.body && typeof request.body === "object") return request.body;

  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new Error("BODY_TOO_LARGE");
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(body));
  }
  return JSON.parse(body || "{}");
};

const normalize = (value, maxLength) =>
  String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const escapeDiscord = (value) => value.replace(/([\\`*_{}\[\]()<>#+\-.!|])/g, "\\$1");

const isSameOrigin = (request) => {
  const origin = request.headers.origin;
  if (!origin) return true;

  try {
    const expectedHost = request.headers["x-forwarded-host"] || request.headers.host;
    return new URL(origin).host === expectedHost;
  } catch {
    return false;
  }
};

const getClientAddress = (request) =>
  String(request.headers["x-forwarded-for"] || request.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();

export default async function contact(request, response) {
  const contentType = request.headers["content-type"] || "";
  const htmlResponse = contentType.includes("application/x-www-form-urlencoded");
  const send = (status, body) => sendResult(response, status, body, htmlResponse);

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return send(405, { error: "Method not allowed." });
  }

  if (!isSameOrigin(request)) return send(403, { error: "Request origin was rejected." });

  if (!contentType.includes("application/json") && !htmlResponse) {
    return send(415, { error: "The form format is not supported." });
  }

  let body;
  try {
    body = await readBody(request, contentType);
  } catch (error) {
    const tooLarge = error instanceof Error && error.message === "BODY_TOO_LARGE";
    return send(tooLarge ? 413 : 400, { error: "The request could not be read." });
  }

  const honeypot = normalize(body.website, 200);
  const startedAt = Number(body.startedAt);
  const missingEnhancementTimer = !Number.isFinite(startedAt);
  if (honeypot || (!htmlResponse && missingEnhancementTimer) || (!missingEnhancementTimer && Date.now() - startedAt < MIN_FORM_TIME_MS)) {
    return send(200, { ok: true });
  }

  const email = normalize(body.email, 254).toLowerCase();
  const network = normalize(body.network, 100);
  const message = normalize(body.message, 1800);

  if (!EMAIL_PATTERN.test(email)) {
    return send(400, { error: "Enter a valid email address." });
  }

  const clientAddress = getClientAddress(request);
  const now = Date.now();
  for (const [address, requestedAt] of recentRequests) {
    if (now - requestedAt >= RATE_LIMIT_MS) recentRequests.delete(address);
  }
  const previousRequest = recentRequests.get(clientAddress) || 0;
  if (now - previousRequest < RATE_LIMIT_MS) {
    return send(429, { error: "Please wait 30 seconds before sending another request." });
  }
  recentRequests.set(clientAddress, now);

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL is not configured.");
    return send(503, { error: "Contact delivery is temporarily unavailable." });
  }

  const fields = [
    { name: "Reply email", value: escapeDiscord(email), inline: false },
    { name: "Network", value: network ? escapeDiscord(network) : "Not provided", inline: false },
  ];

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Project Caligo",
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: "New Mirage access request",
            description: message ? escapeDiscord(message).slice(0, 4096) : "No additional details provided.",
            color: 9280511,
            fields,
            footer: { text: "project-caligo-website" },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!webhookResponse.ok) {
      console.error(`Discord webhook returned ${webhookResponse.status}.`);
      return send(502, { error: "We couldn’t deliver your request just now." });
    }

    return send(200, { ok: true });
  } catch (error) {
    console.error("Discord webhook request failed.", error instanceof Error ? error.message : "Unknown error");
    return send(502, { error: "We couldn’t deliver your request just now." });
  }
}

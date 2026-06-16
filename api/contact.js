// Vercel Serverless Function — receives the contact form POST and sends
// an email via Resend. Env vars (set in the Vercel dashboard):
//   RESEND_API_KEY  — required, your Resend API key
//   CONTACT_TO      — recipient, defaults to info@carepack.ee
//   CONTACT_FROM    — sender, defaults to Resend's onboarding test address
//                     (no domain verification needed to start)

const escapeHtml = (str = "") =>
  String(str).replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch],
  );

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email is not configured" });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const name = (body.name || "").toString().trim();
  const phone = (body.phone || "").toString().trim();
  const email = (body.email || "").toString().trim();
  const message = (body.message || "").toString().trim();

  // Honeypot: bots fill hidden fields; humans leave them empty.
  if ((body.company || "").toString().trim()) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const to = process.env.CONTACT_TO || "info@carepack.ee";
  const from = process.env.CONTACT_FROM || "Carepack <onboarding@resend.dev>";

  const html = `
    <h2>New request from carepack.ee</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ""}
    ${message ? `<p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>` : ""}
  `.trim();

  const payload = {
    from,
    to: [to],
    subject: `Carepack — new request from ${name}`,
    html,
    // Lets you reply straight to the customer from your inbox.
    ...(email ? { reply_to: email } : {}),
  };

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error("Resend error", resp.status, detail);
      return res.status(502).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Resend request failed", err);
    return res.status(502).json({ error: "Failed to send email" });
  }
}

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

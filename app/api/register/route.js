// Event details used in the confirmation email (keep in sync with app/page.js).
const EVENT = {
  name: "OBS Conference",
  date: "January 2, 2027",
  time: "9 AM–5 PM WAT",
  city: "Ibadan, Nigeria",
};

// Escape user input before putting it into HTML
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function sendEmail({ to, subject, html, text, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) return { ok: false, error: "RESEND_API_KEY or RESEND_FROM is not set" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html, text, ...(replyTo && { reply_to: replyTo }) }),
      signal: AbortSignal.timeout(8000), // don't let a slow email service hang registration
    });
    if (!res.ok) return { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
}

function confirmationEmail(name) {
  const n = esc(name);
  return {
    subject: `You're registered for ${EVENT.name}`,
    text: [
      `Hi ${name},`,
      "",
      `Your seat at ${EVENT.name} is saved.`,
      "",
      `Date: ${EVENT.date}`,
      `Time: ${EVENT.time}`,
      `Where: ${EVENT.city}. Venue details coming soon.`,
      "",
      "We'll be in touch on WhatsApp with arrival details.",
      "",
      "See you there,",
      "The OBS Team",
    ].join("\n"),
    html: `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#1a1a1a">
  <p>Hi ${n},</p>
  <p>Your seat at <strong>${EVENT.name}</strong> is saved.</p>
  <p><strong>Date:</strong> ${EVENT.date}<br>
     <strong>Time:</strong> ${EVENT.time}<br>
     <strong>Where:</strong> ${EVENT.city}. Venue details coming soon.</p>
  <p>We'll be in touch on WhatsApp with arrival details.</p>
  <p>See you there,<br>The OBS Team</p>
</div>`,
  };
}

function teamEmail(body) {
  const rows = Object.entries(body)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`)
    .join("");
  return {
    subject: `New registration: ${body.name}`,
    text: Object.entries(body).map(([k, v]) => `${k}: ${v ?? ""}`).join("\n"),
    html: `<p>New ${EVENT.name} registration:</p><table style="font-family:Arial,sans-serif;font-size:14px">${rows}</table>`,
  };
}

export async function POST(req) {
  const body = await req.json();
  if (!body.name || !body.email || !body.phone) return Response.json({ error: "Missing fields" }, { status: 400 });
  console.log("New registration:", body);

  
  const sends = [sendEmail({ to: body.email, ...confirmationEmail(body.name) })];
  const teamInbox = process.env.RESEND_TEAM_INBOX; 
  if (teamInbox) sends.push(sendEmail({ to: teamInbox, replyTo: body.email, ...teamEmail(body) }));

  const [userResult, teamResult] = await Promise.all(sends);
  if (!userResult.ok) console.error(`[register] Confirmation email to ${body.email} failed:`, userResult.error);
  if (teamResult && !teamResult.ok) console.error("[register] Team copy failed:", teamResult.error);

  return Response.json({ ok: true });
}

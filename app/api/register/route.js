import { register, tooMany, storeMode, normEmail, normPhone } from "../../../lib/registrations";

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
    const res = await fetch(process.env.RESEND_API_URL || "https://api.resend.com/emails", {
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

function confirmationEmail(name, seat) {
  const n = esc(name);
  return {
    subject: `You're registered for ${EVENT.name}`,
    text: [
      `Hi ${name},`,
      "",
      `Your seat at ${EVENT.name} is saved.`,
      "",
      `Seat number: ${seat}`,
      "Please keep this email; you'll be asked for your seat number at check-in.",
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
  <p style="margin:20px 0;padding:14px 18px;border:2px dashed #1D6340;border-radius:10px;display:inline-block">
     <span style="font-size:13px;color:#555">Seat number</span><br>
     <strong style="font-size:26px;letter-spacing:1px;color:#1D6340">${esc(seat)}</strong></p>
  <p style="font-size:14px;color:#555">Please keep this email; you'll be asked for your seat number at check-in.</p>
  <p><strong>Date:</strong> ${EVENT.date}<br>
     <strong>Time:</strong> ${EVENT.time}<br>
     <strong>Where:</strong> ${EVENT.city}. Venue details coming soon.</p>
  <p>We'll be in touch on WhatsApp with arrival details.</p>
  <p>See you there,<br>The OBS Team</p>
</div>`,
  };
}

function teamEmail(body, seat) {
  const rows = Object.entries(body)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`)
    .join("");
  return {
    subject: `New registration ${seat}: ${body.name}`,
    text: Object.entries(body).map(([k, v]) => `${k}: ${v ?? ""}`).join("\n"),
    html: `<p>New ${EVENT.name} registration:</p><table style="font-family:Arial,sans-serif;font-size:14px">${rows}</table>`,
  };
}

// Fields the form sends. Anything else is dropped, so nothing unexpected reaches storage or the team email.
const FIELDS = ["name", "email", "phone", "city", "otherCity", "org", "first", "accom", "merch"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ATTEMPTS = { limit: 5, windowSec: 10 * 60 }; // per device/network: plenty for typos, too few for scripts

const fail = (status, error, message) => Response.json({ error, message }, { status });

function clientIp(req) {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req) {
  let raw;
  try { raw = await req.json(); } catch { return fail(400, "bad_request", "Please try again."); }
  // Hidden field real people never see or fill in: answer as if it worked, save nothing.
  if (raw?.website) return Response.json({ ok: true });

  const body = Object.fromEntries(FIELDS.map((k) => [k, typeof raw?.[k] === "string" ? raw[k].trim().slice(0, 200) : ""]));
  body.email = normEmail(body.email);
  if (!body.name || !body.email || !body.phone) return fail(400, "missing_fields", "Please fill in your name, email and WhatsApp number.");
  if (!EMAIL_RE.test(body.email)) return fail(400, "bad_email", "Please check your email address.");
  if (normPhone(body.phone).length < 7) return fail(400, "bad_phone", "Please check your WhatsApp number.");

  if (!storeMode()) {
    console.error("[register] No registration store configured (set REDIS_REST_URL and REDIS_REST_TOKEN)");
    return fail(503, "closed", "Registration isn't open yet. Please check back soon.");
  }

  let result;
  try {
    if (await tooMany(`ip:${clientIp(req)}`, ATTEMPTS.limit, ATTEMPTS.windowSec))
      return fail(429, "too_many", "Too many attempts. Please wait a few minutes and try again.");
    result = await register(body);
  } catch (err) {
    console.error("[register] Could not save registration:", err?.message || err);
    return fail(503, "unavailable", "We couldn't save your registration just now. Please try again in a minute.");
  }

  if (!result.created) {
    // Don't reveal the seat number here: anyone can type someone else's email. It is in their confirmation email.
    return fail(409, "already_registered",
      "You're already registered with this email or WhatsApp number. Your seat number is in your confirmation email.");
  }
  const { seat } = result;
  console.log(`[register] ${seat} registered`);

  const sends = [sendEmail({ to: body.email, ...confirmationEmail(body.name, seat) })];
  const teamInbox = process.env.RESEND_TEAM_INBOX;
  if (teamInbox) sends.push(sendEmail({ to: teamInbox, replyTo: body.email, ...teamEmail({ seat, ...body }, seat) }));

  const [userResult, teamResult] = await Promise.all(sends);
  if (!userResult.ok) console.error(`[register] Confirmation email for ${seat} failed:`, userResult.error);
  if (teamResult && !teamResult.ok) console.error(`[register] Team copy for ${seat} failed:`, teamResult.error);

  return Response.json({ ok: true, seat, emailed: userResult.ok });
}

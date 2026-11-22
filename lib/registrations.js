// Registration storage: one registration per email and per phone number, each with its own seat number.
//
// Production: Supabase. Run supabase/conference_registrations.sql once, then set SUPABASE_URL and SUPABASE_SECRET_KEY
//   (the project's secret / service_role key; server only, never NEXT_PUBLIC_). The duplicate check and the
//   seat number happen in one database call, so two people can never get the same seat.
// Development: with no Supabase set, registrations go to .data/registrations.json (git-ignored).
import { promises as fs } from "fs";
import path from "path";

const SEAT_PREFIX = "OBS27-";
const SB_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SB_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const FILE = path.join(process.cwd(), ".data", "registrations.json");

export const seatLabel = (n) => SEAT_PREFIX + String(n).padStart(4, "0");

// Store mode: "supabase" when configured; "file" in development (or when REGISTRATION_STORE=file); otherwise none,
// so a live site without a database refuses registrations instead of silently losing them.
export function storeMode() {
  if (SB_URL && SB_KEY) return "supabase";
  if (process.env.NODE_ENV !== "production" || process.env.REGISTRATION_STORE === "file") return "file";
  return null;
}

export const normEmail = (e = "") => String(e).trim().toLowerCase();

// "+234 803 123 4567", "0803 123 4567" and "2348031234567" are the same Nigerian number.
export function normPhone(p = "") {
  let d = String(p).replace(/\D/g, "");
  if (d.length === 13 && d.startsWith("234")) d = d.slice(3);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
}

async function rpc(fn, args) {
  const headers = { apikey: SB_KEY, "Content-Type": "application/json" };
  if (SB_KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${SB_KEY}`; // legacy service_role JWT
  const res = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST", headers, body: JSON.stringify(args), cache: "no-store", signal: AbortSignal.timeout(8000),
  });
  const out = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`Supabase ${fn} ${res.status}: ${out?.message || out?.hint || "error"}`);
  return out;
}

// ---- file store (development) ----
let queue = Promise.resolve();
const locked = (fn) => (queue = queue.then(fn, fn));
async function readFile() {
  try { return JSON.parse(await fs.readFile(FILE, "utf8")); }
  catch { return { seq: 0, byEmail: {}, byPhone: {}, registrations: [] }; }
}
async function writeFile(db) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE + ".tmp", JSON.stringify(db, null, 2));
  await fs.rename(FILE + ".tmp", FILE);
}
const hits = new Map(); // rate limits in development: kept in memory

/** Saves a registration. Returns { created: true, seat } or, if the email or phone is already registered, { created: false, seat }. */
export async function register(reg) {
  const email = normEmail(reg.email), phone = normPhone(reg.phone);
  const record = { ...reg, email, phoneNormalized: phone, registeredAt: new Date().toISOString() };
  if (storeMode() === "supabase") {
    const [row] = await rpc("conference_register", { r: { ...record, phone_normalized: phone } });
    return { created: row.created, seat: row.seat };
  }
  return locked(async () => {
    const db = await readFile();
    const existing = db.byEmail[email] ?? db.byPhone[phone];
    if (existing) return { created: false, seat: seatLabel(existing) };
    const n = ++db.seq;
    db.byEmail[email] = n;
    db.byPhone[phone] = n;
    db.registrations.push({ seat: seatLabel(n), ...record });
    await writeFile(db);
    return { created: true, seat: seatLabel(n) };
  });
}

/** Counts an attempt for `key`; true if it is over `limit` attempts within `windowSec`. */
export async function tooMany(key, limit, windowSec) {
  if (storeMode() === "supabase") return (await rpc("conference_registration_attempt", { k: key, window_seconds: windowSec })) > limit;
  const now = Date.now();
  const h = hits.get(key);
  const cur = h && h.until > now ? h : { n: 0, until: now + windowSec * 1000 };
  cur.n += 1;
  hits.set(key, cur);
  return cur.n > limit;
}

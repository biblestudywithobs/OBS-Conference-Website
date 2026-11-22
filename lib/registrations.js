// Registration storage: one registration per email and per phone number, each with its own seat number.
//
// Production: Redis over its REST API (Upstash-compatible; works on Vercel, Netlify or any host). Set
//   REDIS_REST_URL and REDIS_REST_TOKEN (KV_REST_API_* and UPSTASH_REDIS_REST_* names also work).
//   The duplicate check and the seat number are one atomic step, so two people can never get the same seat.
// Development: with no Redis set, registrations go to .data/registrations.json (git-ignored).
import { promises as fs } from "fs";
import path from "path";

const SEAT_PREFIX = "OBS27-";
const URL = process.env.REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const FILE = path.join(process.cwd(), ".data", "registrations.json");

export const seatLabel = (n) => SEAT_PREFIX + String(n).padStart(4, "0");

// Store mode: "redis" when configured; "file" in development (or when REGISTRATION_STORE=file); otherwise none,
// so a live site without a database refuses registrations instead of silently losing them.
export function storeMode() {
  if (URL && TOKEN) return "redis";
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

async function redis(cmd) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || out.error) throw new Error(`Redis: ${out.error || res.status}`);
  return out.result;
}

// KEYS: email, phone, seat counter, registrations hash. ARGV: the registration as JSON.
const REGISTER = `
local seat = redis.call('GET', KEYS[1]) or redis.call('GET', KEYS[2])
if seat then return {0, tonumber(seat)} end
local n = redis.call('INCR', KEYS[3])
redis.call('SET', KEYS[1], n)
redis.call('SET', KEYS[2], n)
redis.call('HSET', KEYS[4], n, ARGV[1])
return {1, n}`;

// KEYS: counter. ARGV: window in seconds. Returns the attempt count in the current window.
const HIT = `
local n = redis.call('INCR', KEYS[1])
if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return n`;

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
  if (storeMode() === "redis") {
    const [created, n] = await redis(["EVAL", REGISTER, 4, `obs27:email:${email}`, `obs27:phone:${phone}`,
      "obs27:seat", "obs27:registrations", JSON.stringify(record)]);
    return { created: created === 1, seat: seatLabel(n) };
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
  if (storeMode() === "redis") return (await redis(["EVAL", HIT, 1, `obs27:rl:${key}`, windowSec])) > limit;
  const now = Date.now();
  const h = hits.get(key);
  const cur = h && h.until > now ? h : { n: 0, until: now + windowSec * 1000 };
  cur.n += 1;
  hits.set(key, cur);
  return cur.n > limit;
}

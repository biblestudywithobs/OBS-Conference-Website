# OBS Conference ’27 — Website

The website for **OBS Conference ’27**, a one-day gathering by Open Bible School.

> Bring your Bible. Bring your questions. Come as you are.
> **January 2, 2027 · 9 AM–5 PM WAT · Ibadan, Nigeria · Registration is free**

A single landing page: hero, conference overview (our story and vision), what to
expect, facilitators, registration form and footer.

---

## Quick start

Requirements: **Node.js 18.18+** (20 LTS recommended) and npm.

```bash
git clone https://github.com/biblestudywithobs/OBS-Conference-Website.git
cd OBS-Conference-Website
git checkout integration
npm install
npm run dev
```

Open http://localhost:3000.

To test on your phone, run `npm run dev -- -H 0.0.0.0` and open
`http://<your-computer's-IP>:3000` on a phone on the same Wi-Fi.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (run this before opening a PR) |
| `npm run start` | Serve the production build |

---

## Tech stack

- **Next.js 15** (App Router) + **React 19**, plain JavaScript
- **Plain CSS** in `app/globals.css` (no Tailwind in this app)
- **three.js** for the hero animation, loaded on demand so it never slows the first paint
- Fonts via `next/font/google`: Bebas Neue (display), Montserrat (UI), Lora (book pages)

---

## Project structure

```
app/
  layout.js              fonts, page title and description
  page.js                the landing page, section by section
  globals.css            all styles (desktop first, mobile rules at max-width: 760px)
  api/register/route.js  POST endpoint the registration form submits to
  components/
    Nav.js               sticky header; menu button and dropdown on mobile
    BookScene.js         three.js hero: particles gather into an open Bible
    Cursor.js            mouse tracker (dot + trailing ring), desktop only
    Book.js              "Conference overview" two-page book
    Typed.js             the fountain pen that writes the overview text
    Expect.js            "What to expect": four moments with photo switcher
    Facilitators.js      facilitator cards (placeholders until the lineup is final)
    RegisterForm.js      registration form
    Reveal.js            fade/slide-in on scroll
    Chrome.js            scroll progress bar and the "Reduce motion" toggle
public/images/           photos used on the page
frontend/                earlier Next 16 + TypeScript + Tailwind version (see below)
```

---

## Motion and accessibility

The page is animated, but everything works without the animations:

- **Hero:** on every page load, particles swirl in and gather into an open
  Bible, light rises off the pages, and particles part around the mouse. It
  pauses when scrolled out of view, uses fewer particles on phones, and is
  skipped if WebGL isn't available.
- **Overview:** a pen writes "Our story", then "Our vision". Screen readers get
  the full text straight away.
- **Mouse tracker:** only on devices with a mouse or trackpad; hidden in text fields.
- **Reduce motion:** if the visitor's device asks for reduced motion, or they
  switch on *Reduce motion* in the footer, all animation stops and content shows
  immediately.

Keep it that way: any new animation must respect
`prefers-reduced-motion` and `[data-reduce="true"]` on `<html>`.

---

## Registration

The form posts JSON to `/api/register` (`app/api/register/route.js`, storage in `lib/registrations.js`):

```json
{ "name": "", "email": "", "phone": "", "city": "", "otherCity": "",
  "org": "", "first": "Yes|No", "accom": "Yes|No", "merch": "OBS T-shirt" }
```

- **Seat numbers:** every registration gets the next seat number (`OBS27-0001`, `OBS27-0002`, …). It is shown
  on the page and included in the confirmation email and the team copy.
- **One registration per person:** the same email, or the same WhatsApp number in any format (`+234 803…`,
  `0803…`), is refused with "You're already registered". The seat number is not shown again on the page
  (anyone could type someone else's email); it is in the person's confirmation email.
- **Attempt limit:** 5 attempts per device/network every 10 minutes, then "Too many attempts".
- **Bots:** a hidden `website` field; submissions that fill it are ignored.
- **Emails (Resend):** confirmation to the registrant and, if `RESEND_TEAM_INBOX` is set, a copy to the team.
  An email failure never fails the registration; it is logged.
- **Storage:** Supabase (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`). Run `supabase/conference_registrations.sql` once in the
  project's SQL editor: it creates the `conference_registrations` table (with the seat number) and two functions. The
  duplicate check and the seat number are one database call, so two people can never get the same seat. Only the
  server's secret key can read or write the table (RLS on, no public access). With no Supabase configured, the
  live site answers "Registration isn't open yet" rather than losing registrations. In development,
  registrations go to `.data/registrations.json` (git-ignored); delete it to start again from seat 1.
  Registrations can be viewed and exported (CSV) from the Supabase Table Editor.

## Environment variables and secrets

Copy `.env.example` to `.env.local` and fill in real values locally:

```bash
# .env.local  (git-ignored — never commit it)
RESEND_API_KEY=
RESEND_FROM="OBS Conference <hello@your-verified-domain>"
```

- **Never commit API keys** or paste them into code, issues, PRs or chat.
  `.env*` files are already in `.gitignore`.
- In production, set the same variables in the hosting provider's settings.
- Use an **OBS-owned** Resend account with a verified domain and a
  sending-only key, not a personal key.

---

## Branches and workflow

```
feature/<task>  ──PR──▶  integration  ──PR (when stable)──▶  main
```

1. Start from the latest `integration`:
   ```bash
   git checkout integration && git pull
   git checkout -b feature/<short-task-name>
   ```
2. Keep PRs small and focused. Run `npm run build` and check the page on a
   phone-sized screen before opening the PR.
3. Open the PR into **`integration`**, not `main`. At least one review before merging.
4. When `integration` is tested end to end, it is merged into `main`, which is
   what goes live.

| Branch | Purpose |
|---|---|
| `main` | Production. Only updated from `integration`. |
| `integration` | Where all work is combined and tested. |
| `feature/*` | One task each. |

---

## Two versions in this repo (temporary)

The team built two versions in parallel; both were merged into `integration`
so nothing is lost:

| Location | Origin | Stack |
|---|---|---|
| repo root (`app/`) | `johnkay-obs-design` | Next.js 15, JavaScript, plain CSS — **the active version** (designer feedback, 3D hero and mobile work are here) |
| `frontend/` | `frontend/Daniel` | Next.js 16, TypeScript, Tailwind |

Run the older one with `cd frontend && npm install && npm run dev -- -p 3001`.
Once the team agrees, anything still useful from `frontend/` gets moved into the
root app and the folder is removed.

---

## Still to do

- [ ] Set the Supabase and Resend keys in the hosting settings
- [ ] Add the "What to expect" overview photo (`public/images/expect.jpg`)
- [ ] Facilitator names and photos
- [ ] Venue and arrival details
- [ ] Contact email and real social links (Instagram, YouTube, WhatsApp)
- [ ] Decide on hosting (e.g. Vercel) and a domain
- [ ] Retire the `frontend/` version

---

© 2027 Open Bible School · *Enter the Word. Find your place.*

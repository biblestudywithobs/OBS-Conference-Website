"use client";
const cities = [
  "Ibadan", "Lagos", "Abuja", "Abeokuta", "Ado-Ekiti", "Akure", "Asaba", "Awka",
  "Bauchi", "Benin City", "Calabar", "Enugu", "Ile-Ife", "Ilorin", "Jos", "Kaduna",
  "Kano", "Lokoja", "Makurdi", "Maiduguri", "Minna", "Ogbomosho", "Osogbo", "Owerri",
  "Port Harcourt", "Sokoto", "Uyo", "Warri", "Yola",
];

import { useState } from "react";

const merch = ["Branded bottle", "OBS T-shirt", "Branded jotter", "Pen"];

const inputClass =
  "mt-1 w-full rounded-sm border border-green/20 bg-white/60 px-3 py-2.5 text-sm font-normal text-ink outline-none placeholder:text-green/40 focus:border-green focus:ring-2 focus:ring-green/30";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  optional = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  optional?: boolean;
}) {
  return (
    <label className="block text-xs font-semibold text-green">
      {label}
      {optional && <span className="font-normal opacity-70"> (optional)</span>}
      <input
        name={name}
        type={type}
        required={!optional}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function YesNo({ legend, name }: { legend: string; name: string }) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold text-green">{legend}</legend>
      <div className="mt-1 grid grid-cols-2 gap-2">
        {["Yes", "No"].map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 rounded-sm border border-green/20 bg-white/60 px-3 py-2.5 text-sm text-green has-checked:border-green has-checked:bg-green has-checked:text-cream"
          >
            <input type="radio" name={name} value={option} required className="accent-gold" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}



function CitySelect() {
  const [city, setCity] = useState("");

  return (
    <div>
      <label className="block text-xs font-semibold text-green">
        City
        <select
          name="city"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`${inputClass} invalid:text-green/40 [&>option]:text-ink`}
        >
          <option value="" disabled>
            Where are you coming from?
          </option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value="Other">Other / outside Nigeria</option>
        </select>
      </label>
      {city === "Other" && (
        <input
          name="cityOther"
          required
          placeholder="Type your city and country"
          className={inputClass}
        />
      )}
    </div>
  );
}
export default function Register() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Registration (not sent anywhere yet):", data);
    setSubmitted(true);
  }

  return (
    <section id="visit" className="scroll-mt-20 bg-green px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.2fr]">
        <div className="text-cream">
          <h2 className="font-display text-5xl uppercase leading-[0.95] md:text-7xl">
            Growing in the Word <br /> begins here.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-cream/90">
            One day. Open Scriptures. Honest conversations. A community gathered to know God and
            understand His Word more deeply. We would love to have you with us.
          </p>
          <ul className="mt-8 space-y-3 border-t border-cream/20 pt-6 text-sm">
            <li>January 2, 2027 · 9 AM–5 PM WAT</li>
            <li>Ibadan, Nigeria</li>
            <li>Registration is FREE</li>
          </ul>
          <p className="mt-6 text-xs text-cream/70">Exact venue and arrival details to be confirmed.</p>
        </div>

        <div className="rounded-sm bg-cream p-6 shadow-xl md:p-8">
          {submitted ? (
            <div className="py-16 text-center">
              <h3 className="font-display text-4xl uppercase text-green">Your seat is saved.</h3>
              <p className="mt-3 text-sm text-green/80">
                Thank you for registering. We will be in touch on WhatsApp with details.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-display text-3xl uppercase text-green">Let’s save your place.</h3>
                <p className="text-[11px] text-green/70">All fields are required unless marked optional.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" name="fullName" placeholder="Your full name" />
                <Field label="Email" name="email" type="email" placeholder="you@example.com" />
                <Field label="WhatsApp phone" name="phone" type="tel" placeholder="+234 800 000 0000" />
                <CitySelect />
              </div>
              <Field
                label="Church / ministry / organisation"
                name="organisation"
                placeholder="Your community or organisation"
                optional
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <YesNo legend="First time at OBS conference?" name="firstTime" />
                <YesNo legend="Need accommodation?" name="accommodation" />
              </div>
              <p className="text-[11px] text-green/70">
                Accommodation is a request; availability and details will be confirmed.
              </p>

              <fieldset>
                <legend className="text-[11px] font-semibold uppercase tracking-widest text-green">
                  Choose one merchandise preference
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {merch.map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center justify-center rounded-sm border border-green/20 bg-white/60 px-2 py-5 text-center text-xs font-semibold text-green has-checked:border-green has-checked:bg-green has-checked:text-cream"
                    >
                      <input type="radio" name="merch" value={item} required className="sr-only" />
                      {item}
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-green/70">
                  Preference only. Pricing and availability to be confirmed.
                </p>
              </fieldset>

              <button
                type="submit"
                className="flex w-full items-center justify-between rounded-sm bg-red px-5 py-4 text-sm font-semibold text-cream transition hover:brightness-110"
              >
                Secure My Seat — Free <span>↗</span>
              </button>
              <p className="text-[11px] text-green/70">
                In the live service, details will be used to coordinate conference attendance.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
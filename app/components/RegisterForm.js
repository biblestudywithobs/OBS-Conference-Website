"use client";
import { useEffect, useRef, useState } from "react";

const merch = ["Branded bottle", "OBS T-shirt", "Branded jotter", "Pen"];
const areas = ["Adamasingba", "Agbowo (UI)", "Agodi", "Agugu", "Akobo", "Apata", "Beere", "Bodija", "Challenge", "Dugbe", "Eleyele", "Gbagi", "Idi-Ape", "Iwo Road", "Iyaganku", "Jericho", "Mokola", "Molete", "Moniya", "Oje", "Oke-Ado", "Ojoo", "Oluyole", "Ring Road", "Samonda", "Sango"];

function YesNo({ name, label }) {
  return (
    <fieldset><legend>{label}</legend>
      <div className="two">
        {["Yes", "No"].map((v) => (
          <label key={v} className="radio"><input type="radio" name={name} value={v} required /> {v}</label>
        ))}
      </div>
    </fieldset>
  );
}

export default function RegisterForm() {
  const [status, setStatus] = useState("idle");
  const [pick, setPick] = useState(merch[0]);
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null); // { seat, emailed } once registered
  const [error, setError] = useState("");
  const box = useRef(null);

  // The form is replaced by a much shorter card, so bring the answer (and the seat number) into view.
  useEffect(() => {
    if (status !== "done" && status !== "registered") return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.reduce === "true";
    box.current?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, [status]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, merch: pick }) });
      const out = await res.json().catch(() => ({}));
      if (res.ok) { setResult(out); setStatus("done"); return; }
      setError(out.message || "Something went wrong. Please try again.");
      setStatus(out.error === "already_registered" ? "registered" : "error");
    } catch { setError("Couldn't reach the server. Check your connection and try again."); setStatus("error"); }
  }

  if (status === "done") return (
    <div className="card pop" role="status" ref={box}>
      <h3 className="display green">You&apos;re in.</h3>
      {result?.seat && (
        <div className="seat"><span>Your seat number</span><strong>{result.seat}</strong></div>
      )}
      <p>{result?.emailed === false
        ? "Please note your seat number; you'll need it at check-in. We'll be in touch on WhatsApp."
        : "We've emailed your confirmation with this seat number. Keep it for check-in. We'll be in touch on WhatsApp."}</p>
    </div>
  );
  if (status === "registered") return (
    <div className="card pop" role="status" ref={box}>
      <h3 className="display green">You&apos;re already in.</h3>
      <p>{error}</p>
      <button type="button" className="btn-outline again" onClick={() => setStatus("idle")}>Register someone else</button>
    </div>
  );

  return (
    <form className="card" onSubmit={onSubmit}>
      <h3 className="display green">Let&apos;s save your place.</h3>
      {/* Hidden from people; bots that fill every field are ignored. */}
      <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <p className="note">All fields are required unless marked optional.</p>
      <div className="two">
        <label>Full name<input name="name" placeholder="Your full name" required autoComplete="name" /></label>
        <label>Email<input name="email" type="email" placeholder="you@example.com" required autoComplete="email" /></label>
        <label>WhatsApp phone<input name="phone" type="tel" placeholder="+234 800 000 0000" required autoComplete="tel" /></label>
        <label>City / area
          <select name="city" required value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="" disabled>Select your area in Ibadan</option>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
            <option value="Outside Ibadan">Outside Ibadan</option>
          </select>
        </label>
      </div>
      {city === "Outside Ibadan" && <label className="drop">Which city are you coming from?<input name="otherCity" placeholder="Your city" required /></label>}
      <label>Church / ministry / organisation (optional)<input name="org" placeholder="Your community or organisation" /></label>
      <div className="two">
        <YesNo name="first" label="First time at OBS conference?" />
        <YesNo name="accom" label="Need accommodation?" />
      </div>
      <p className="note">Accommodation is a request; availability and details will be confirmed.</p>
      <p className="rule">Choose one merchandise preference</p>
      <div className="merch">
        {merch.map((m) => (
          <button type="button" key={m} className={pick === m ? "on" : ""} aria-pressed={pick === m} onClick={() => setPick(m)}>{m}</button>
        ))}
      </div>
      <p className="note">Preference only. Pricing and availability to be confirmed.</p>
      <button className="btn-red submit" disabled={status === "sending"}>{status === "sending" ? "Saving…" : "Secure My Seat — Free"} <span>↗</span></button>
      {status === "error" && <p role="alert" className="err">{error}</p>}
    </form>
  );
}

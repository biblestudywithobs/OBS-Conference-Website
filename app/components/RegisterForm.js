"use client";
import { useEffect, useRef, useState } from "react";
import { Alert, ArrowUpRight, Bottle, Check, Jotter, Pen, Shirt, Spinner, Undo } from "./icons";

const ORDER = ["name", "email", "phone", "city", "firstTime", "accommodation", "merch", "size"];
const MERCH = ["Branded water bottle", "OBS T-shirt", "Branded jotter", "Pen"];
const MERCH_ICONS = [Bottle, Shirt, Jotter, Pen];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const EMPTY = { name: "", email: "", phone: "", city: "", organisation: "", firstTime: "", accommodation: "", merch: "", size: "", website: "" };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  const digits = v.phone.replace(/\D/g, "");
  if (!/^\+?[\d\s().-]{7,22}$/.test(v.phone) || digits.length < 7 || digits.length > 15)
    e.phone = "Enter a valid WhatsApp number with country code.";
  if (v.city.trim().length < 2) e.city = "Enter the city you’re coming from.";
  if (!["Yes", "No"].includes(v.firstTime)) e.firstTime = "Choose Yes or No.";
  if (!["Yes", "No"].includes(v.accommodation)) e.accommodation = "Choose Yes or No.";
  if (!MERCH.includes(v.merch)) e.merch = "Choose one merchandise preference.";
  if (v.merch === "OBS T-shirt" && !SIZES.includes(v.size)) e.size = "Choose a T-shirt size.";
  return e;
}

export default function RegisterForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | error | success | already
  const [message, setMessage] = useState("");
  const [seat, setSeat] = useState("");
  const formRef = useRef(null);
  const doneRef = useRef(null);
  const busy = useRef(false);

  useEffect(() => {
    if (status === "success" || status === "already") doneRef.current?.focus();
  }, [status]);

  function set(field, value) {
    const clearSize = field === "merch" && value !== "OBS T-shirt";
    setValues((v) => ({ ...v, [field]: value, ...(clearSize ? { size: "" } : {}) }));
    setErrors((e) => ({ ...e, [field]: undefined, ...(clearSize ? { size: undefined } : {}) }));
    if (status === "error") setStatus("idle");
  }

  async function submit(ev) {
    ev.preventDefault();
    if (busy.current) return;
    const found = validate(values);
    setErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) { formRef.current?.querySelector(`[name="${first}"]`)?.focus(); return; }

    busy.current = true;
    setStatus("loading");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name, email: values.email, phone: values.phone, city: values.city,
          org: values.organisation, first: values.firstTime, accom: values.accommodation,
          merch: values.merch === "OBS T-shirt" ? `OBS T-shirt (${values.size})` : values.merch,
          website: values.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setSeat(data.seat || ""); setStatus("success"); }
      else if (data.error === "already_registered") { setMessage(data.message); setStatus("already"); }
      else { setMessage(data.message || "Something went wrong. Please try again."); setStatus("error"); }
    } catch {
      setMessage("We couldn’t reach the server. Check your connection and try again.");
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }

  function again() {
    setValues(EMPTY); setErrors({}); setSeat(""); setStatus("idle");
    requestAnimationFrame(() => formRef.current?.querySelector("input")?.focus());
  }

  const err = (k) => errors[k] && <span className="field-error" id={`error-${k}`}><Alert size={14} />{errors[k]}</span>;

  const field = (name, label, placeholder, type = "text", autoComplete) => (
    <label className="form-field">
      <span>{label}</span>
      <input name={name} value={values[name]} onChange={(e) => set(name, e.target.value)} type={type}
        placeholder={placeholder} autoComplete={autoComplete} required={name !== "organisation"}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `error-${name}` : undefined} />
      {err(name)}
    </label>
  );

  const yesNo = (name, legend) => (
    <fieldset className="choice-group">
      <legend>{legend}</legend>
      <div className="choice-row">
        {["Yes", "No"].map((o) => (
          <label key={o} className={`radio-choice ${values[name] === o ? "checked" : ""}`}>
            <input type="radio" name={name} value={o} checked={values[name] === o} onChange={() => set(name, o)} required
              aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `error-${name}` : undefined} />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {err(name)}
    </fieldset>
  );

  if (status === "success" || status === "already") {
    const ok = status === "success";
    return (
      <div className="registration-form success-state">
        {ok ? <Check size={48} /> : <Alert size={48} />}
        <h3 ref={doneRef} tabIndex={-1}>{ok ? "YOU’RE IN." : "YOU’RE ALREADY IN."}</h3>
        {ok && seat && (
          <div className="seat-card">
            <span>Your seat number</span>
            <strong>{seat}</strong>
          </div>
        )}
        <p>{ok ? "Your place is saved. We’ve sent a confirmation with your seat number to your email. Please keep it for check-in." : message}</p>
        <p className="eyebrow">JANUARY 2, 2027 · 9 AM–5 PM WAT<br />IBADAN, NIGERIA</p>
        <button className="primary-action" onClick={again}>Register someone else <Undo size={18} /></button>
      </div>
    );
  }

  return (
    <form className="registration-form" ref={formRef} onSubmit={submit} noValidate aria-busy={status === "loading"}>
      <h3>LET’S SAVE YOUR PLACE.</h3>
      <p className="form-hint">All fields are required unless marked optional.</p>
      <fieldset disabled={status === "loading"} className="form-fields">
        <legend className="sr-only">Your conference registration details</legend>
        <div className="form-row">
          {field("name", "Full name", "Your full name", "text", "name")}
          {field("email", "Email", "you@example.com", "email", "email")}
        </div>
        <div className="form-row">
          {field("phone", "WhatsApp phone", "+234 800 000 0000", "tel", "tel")}
          {field("city", "City", "Where are you coming from?", "text", "address-level2")}
        </div>
        {field("organisation", "Church / ministry / organisation (optional)", "Your community or organisation", "text", "organization")}
        <div className="form-row">
          {yesNo("firstTime", "First time at OBS conference?")}
          {yesNo("accommodation", "Need accommodation?")}
        </div>
        <p className="form-hint">Accommodation is a request; availability and details will be confirmed.</p>
        <fieldset className="merch-group">
          <legend>CHOOSE ONE MERCHANDISE PREFERENCE</legend>
          <div className="merch-options">
            {MERCH.map((m, i) => {
              const Icon = MERCH_ICONS[i];
              return (
                <label key={m} className={`merch-choice ${values.merch === m ? "checked" : ""}`}>
                  <input className="sr-only" type="radio" name="merch" value={m} checked={values.merch === m}
                    onChange={() => set("merch", m)} required aria-invalid={!!errors.merch}
                    aria-describedby={errors.merch ? "error-merch" : undefined} />
                  <Icon size={23} />
                  <span>{m === "Branded water bottle" ? "Branded bottle" : m}</span>
                  {values.merch === m && <Check className="merch-check" size={14} />}
                </label>
              );
            })}
          </div>
          {err("merch")}
          {values.merch === "OBS T-shirt" && (
            <fieldset className="size-group">
              <legend>T-shirt size</legend>
              <div className="size-options">
                {SIZES.map((s) => (
                  <label key={s} className={values.size === s ? "checked" : ""}>
                    <input type="radio" className="sr-only" name="size" value={s} checked={values.size === s}
                      onChange={() => set("size", s)} required aria-invalid={!!errors.size}
                      aria-describedby={errors.size ? "error-size" : undefined} />
                    {s}
                  </label>
                ))}
              </div>
              {err("size")}
            </fieldset>
          )}
          <p className="form-hint">Preference only. Pricing and availability to be confirmed.</p>
        </fieldset>
        {/* Hidden from people; bots that fill it are ignored by the server */}
        <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
          value={values.website} onChange={(e) => set("website", e.target.value)} />
      </fieldset>
      {status === "error" && (
        <div className="submission-error" role="alert">
          <Alert />
          <div>
            <strong>Let’s try that again.</strong>
            <p>{message} Your details are still here.</p>
          </div>
        </div>
      )}
      <button className="submit-button" type="submit" disabled={status === "loading"}>
        {status === "loading"
          ? <><Spinner className="spinner" size={20} />Saving your place…</>
          : <>{status === "error" ? "Try again" : "Secure My Seat — Free"}<ArrowUpRight size={20} /></>}
      </button>
      <p className="sr-only" role="status" aria-live="polite">
        {status === "loading" ? "Saving your registration." : Object.values(errors).filter(Boolean).length ? "Please check the highlighted fields." : ""}
      </p>
      <p className="form-hint">Your details are only used to coordinate conference attendance.</p>
    </form>
  );
}

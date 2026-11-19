"use client";
import { useEffect, useRef, useState } from "react";

// Writes paragraphs out with a fountain pen when scrolled into view.
// The full text is kept (hidden) so the layout never jumps, and screen
// readers get the whole text at once.
//   start  – set false to hold this block until another one finishes
//   onDone – called once everything is written
const WET = 14; // most recent characters still look "wet"

function Pen({ lift }) {
  return (
    <span className={`pen ${lift ? "lift" : ""}`} aria-hidden="true">
      <span className="pen-in">
        <svg viewBox="0 0 20 92" width="20" height="92">
          <rect x="3" y="2" width="14" height="40" rx="6" fill="#1D6340" />
          <rect x="14.5" y="6" width="2.4" height="26" rx="1.2" fill="#D9902F" />
          <rect x="3" y="40" width="14" height="3.5" fill="#D9902F" />
          <path d="M3.5 43.5h13l-1.5 16h-10z" fill="#0d2a1c" />
          <path d="M5 59.5h10L10 92z" fill="#D9902F" />
          <path d="M10 92V72" stroke="#5a3a12" strokeWidth=".9" />
          <circle cx="10" cy="70.5" r="1.4" fill="#5a3a12" />
        </svg>
        <i className="ink" />
      </span>
    </span>
  );
}

export default function Typed({ paras, speed = 9, delay = 0, start = true, onDone }) {
  const ref = useRef(null);
  const done = useRef(onDone);
  done.current = onDone;
  const total = paras.reduce((a, p) => a + p.length, 0);
  const [n, setN] = useState(0);
  const [pen, setPen] = useState(true);

  useEffect(() => {
    const reduce = () =>
      matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.reduce === "true";
    if (reduce()) { setN(total); setPen(false); done.current?.(); return; }
    if (!start) return;
    let raf, t0, finished = false, began = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || began) return;
      began = true; io.disconnect();
      const tick = (t) => {
        if (!t0) t0 = t + delay;
        const k = Math.min(total, Math.max(0, Math.floor((t - t0) / speed)));
        setN(k);
        if (k < total) raf = requestAnimationFrame(tick);
        else if (!finished) { finished = true; done.current?.(); setTimeout(() => setPen(false), 900); }
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [total, speed, delay, start]);

  const writing = n > 0 && n < total;
  const lifting = n === total && pen;
  let from = 0;
  return (
    <div ref={ref}>
      <div className="sr">{paras.join(" ")}</div>
      <div aria-hidden="true">
        {paras.map((p, i) => {
          const vis = Math.max(0, Math.min(p.length, n - from));
          const here = (writing && vis > 0 && vis < p.length) || (writing && vis === p.length && n - from === p.length) || (lifting && i === paras.length - 1);
          from += p.length;
          const wetFrom = writing ? Math.max(0, vis - WET) : vis;
          return (
            <p key={i}>
              {p.slice(0, wetFrom)}
              {wetFrom < vis && <span className="wet">{p.slice(wetFrom, vis)}</span>}
              {here && pen && <Pen lift={lifting} />}
              <span className="ghost">{p.slice(vis)}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
}

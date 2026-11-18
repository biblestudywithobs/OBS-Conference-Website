"use client";
import { useEffect, useRef, useState } from "react";

// Types paragraphs out when scrolled into view. Full text is kept (hidden) so the layout never jumps.
export default function Typed({ paras, speed = 7, delay = 0 }) {
  const ref = useRef(null);
  const total = paras.reduce((a, p) => a + p.length, 0);
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce = () =>
      matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.reduce === "true";
    if (reduce()) { setN(total); return; }
    let raf, t0, started = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true; io.disconnect();
      const tick = (t) => {
        if (!t0) t0 = t + delay;
        const k = Math.min(total, Math.max(0, Math.floor((t - t0) / speed)));
        setN(k);
        if (k < total) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [total, speed, delay]);

  let start = 0;
  return (
    <div ref={ref}>
      <div className="sr">{paras.join(" ")}</div>
      <div aria-hidden="true">
        {paras.map((p, i) => {
          const vis = Math.max(0, Math.min(p.length, n - start));
          const typing = n < total && vis > 0 && vis < p.length;
          start += p.length;
          return (
            <p key={i}>
              {p.slice(0, vis)}{typing && <i className="caret" />}
              <span className="ghost">{p.slice(vis)}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
}

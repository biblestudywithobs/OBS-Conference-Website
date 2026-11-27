"use client";
import { useEffect, useRef } from "react";

// Mouse tracker: a dot that sits on the pointer and a ring that trails it.
// The ring grows over links and buttons and shrinks on click.
// Only for mouse/trackpad; touch devices keep their normal behaviour.
const HOVER = "a, button, label, select, summary, [role=button], [tabindex=\"0\"]";

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const p = { x: innerWidth / 2, y: innerHeight / 2 };
    const r = { x: p.x, y: p.y };
    let shown = false, raf = 0;

    const reduced = () =>
      matchMedia("(prefers-reduced-motion: reduce)").matches || root.dataset.motion === "reduced";

    const onMove = (e) => {
      p.x = e.clientX; p.y = e.clientY;
      if (!shown) { shown = true; r.x = p.x; r.y = p.y; root.classList.add("cursor-on"); }
      const t = e.target instanceof Element ? e.target : null;
      root.classList.toggle("cursor-hover", !!t?.closest(HOVER));
      root.classList.toggle("cursor-text", !!t?.closest("input:not([type=radio]), textarea"));
      root.classList.toggle("cursor-dark", !!t?.closest(".b-overview, .b-gathering, .b-seat, .registration-section, .site-footer, .hero-photo"));
    };
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");
    const onLeave = () => { shown = false; root.classList.remove("cursor-on"); };

    const tick = () => {
      const k = reduced() ? 1 : 0.18;
      r.x += (p.x - r.x) * k;
      r.y += (p.y - r.y) * k;
      dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      ring.current.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown);
    addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      root.classList.remove("has-cursor", "cursor-on", "cursor-hover", "cursor-text", "cursor-dark", "cursor-down");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true"><i /></div>
      <div ref={dot} className="cursor-dot" aria-hidden="true"><i /></div>
    </>
  );
}

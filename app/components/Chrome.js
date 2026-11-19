"use client";
import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      ref.current.style.transform = `scaleX(${p})`;
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return <div className="progress" ref={ref} aria-hidden="true" />;
}

export function MotionToggle() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => { setReduce(localStorage.getItem("obs-reduce") === "true"); }, []);
  useEffect(() => {
    document.documentElement.dataset.reduce = String(reduce);
    localStorage.setItem("obs-reduce", String(reduce));
  }, [reduce]);
  return <button type="button" className="motion" onClick={() => setReduce(!reduce)}>Reduce motion: {reduce ? "on" : "off"}</button>;
}

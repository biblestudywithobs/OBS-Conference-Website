"use client";
import { useEffect, useState } from "react";

const links = [
  ["#experience", "The experience"],
  ["#facilitators", "Facilitators"],
  ["#visit", "Plan your visit"],
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${open ? "open" : ""}`}>
      <a href="#top" className="brand" onClick={close}><span className="mark">OBS</span><span>Conference ’27</span></a>
      <nav id="site-menu">
        {links.map(([href, label]) => <a key={href} href={href} onClick={close}>{label}</a>)}
        <a href="#register" className="btn-outline" onClick={close}>Save my seat <span>↗</span></a>
      </nav>
      <button type="button" className="menu-btn" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
        <span className="sr">{open ? "Close menu" : "Open menu"}</span>
        <i /><i /><i />
      </button>
    </header>
  );
}

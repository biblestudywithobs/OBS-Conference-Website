"use client";
import { useState } from "react";

const items = [
  { n: "01", t: "Bible study", d: "Open the text together and study it with care.", pos: { left: "28%", bottom: "6%" } },
  { n: "02", t: "Discussions", d: "Honest conversation in small groups.", pos: { left: "10%", top: "62%" } },
  { n: "03", t: "Q&A", d: "Bring your questions and hear them answered.", pos: { left: "56%", top: "62%" } },
  { n: "04", t: "Live podcast", d: "A recorded conversation with the room listening in.", pos: { left: "78%", top: "68%" } },
];

export default function Expect() {
  const [open, setOpen] = useState(1);
  return (
    <div className="photo expect-photo">
      {items.map((it, i) => (
        <button key={it.n} className={`pill ${open === i ? "on" : ""}`} style={it.pos}
          aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
          <b>{it.n}</b> {it.t} <span>{open === i ? "–" : "+"}</span>
          {open === i && <em>{it.d}</em>}
        </button>
      ))}
    </div>
  );
}

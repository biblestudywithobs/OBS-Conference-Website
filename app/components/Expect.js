"use client";
import { useState } from "react";
import Reveal from "./Reveal";

const I = {
  book: <><path d="M2 5c3-1 7-1 10 1 3-2 7-2 10-1v14c-3-1-7-1-10 1-3-2-7-2-10-1z" /><path d="M12 6v14" /></>,
  people: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6" /><circle cx="17" cy="7" r="2.5" /><path d="M17 12c3 0 5 1.5 5 5" /></>,
  help: <><circle cx="12" cy="12" r="9.5" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.1" /></>,
  mic: <><rect x="9" y="2.5" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
};

const items = [
  { n: "01", t: "Bible study", title: "OBS Bible Study", icon: "book", img: "study", bg: "#8a5a34", d: "Read in context and discover more through guided study of Scripture.", pos: { left: "28%", bottom: "14%" } },
  { n: "02", t: "Discussions", title: "Table Discussions", icon: "people", img: "discussion", bg: "#6d7f3f", d: "Share what you see in the text. Listen, learn, and grow around the table.", pos: { left: "10%", top: "58%" } },
  { n: "03", t: "Q&A", title: "Questions & Answers", icon: "help", img: "qa", bg: "#3f6f7f", d: "Bring honest questions into a thoughtful, Scripture-centred conversation.", pos: { left: "56%", top: "58%" } },
  { n: "04", t: "Live podcast", title: "OBS Podcast Live Recording", icon: "mic", img: "podcast", bg: "#7f3f4a", d: "Be in the room for a conversation that takes the day’s learning further.", pos: { left: "78%", top: "66%" } },
];

export default function Expect() {
  const [open, setOpen] = useState(1);
  const it = items[open];
  return (
    <>
      <div className="photo expect-photo">
        {items.map((x, i) => (
          <button key={x.n} className={`pill ${open === i ? "on" : ""}`} style={x.pos} aria-pressed={open === i} onClick={() => setOpen(i)}>
            <b>{x.n}</b> {x.t} <span>+</span>
          </button>
        ))}
        <div className="bgs" aria-hidden="true">
          {items.map((x, i) => (
            <div key={x.img} className={`bg ${open === i ? "on" : ""}`} style={{ backgroundColor: x.bg, backgroundImage: `url(/images/${x.img}.jpg)` }} />
          ))}
        </div>
        <div className="cap" key={open}><small>{it.n} · {it.title}</small><p>{it.d}</p></div>
      </div>
      <div className="moments">
        {items.map((x, i) => (
          <Reveal as="article" key={x.n} delay={i * 120} className={`moment ${open === i ? "on" : ""}`}>
            <div className="top">
              <span>{x.n}</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{I[x.icon]}</svg>
            </div>
            <h3>{x.title}</h3>
            <p>{x.d}</p>
            <button className="go" onClick={() => setOpen(i)}>{open === i ? "Selected activity" : "Explore this moment"} <span>↗</span></button>
          </Reveal>
        ))}
      </div>
    </>
  );
}

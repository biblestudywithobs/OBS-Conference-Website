"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import RegisterForm from "./RegisterForm";
import {
  ArrowDown, ArrowUpRight, Book, Calendar, Close, Menu, Mic, People, Pin, Plus, Question, SOCIAL, Ticket,
} from "./icons";

const COPY = {
  heroLine1: "THE WORD IS WORTH",
  heroLine2: "GATHERING Around.",
  invitationHeading: "Come with questions.\nLeave with a deeper understanding.",
  invitation:
    "A day to open the Scriptures, ask honest questions, learn together, and grow in our understanding of God's Word. Come ready to listen, share, search the Scriptures, and be strengthened in your walk with Jesus. Because we believe the Bible should be understood, lived, and studied together.",
  activitiesHeading: "WHAT TO EXPECT AT OBS CONFERENCE",
  activitiesIntro: "Four moments. One shared pursuit: growing in the knowledge of God's Word.",
  growthHeading: "THERE’S ROOM TO GROW IN THE WORD",
  growth:
    "You don't have to have all the answers. Come with your questions, an open heart, and a willingness to learn. We grow together in the knowledge of God's Word.",
  registrationHeading: "GROWING IN THE WORD\nBEGINS HERE.",
  registration:
    "One day. Open Scriptures. Honest conversations. A community gathered to know God and understand His Word more deeply. We would love to have you with us.",
};

const ACTIVITIES = [
  { title: "OBS Bible Study", short: "Bible study", icon: Book, image: "/assets/obs-study.jpg", position: "50% 47%",
    description: "Read in context and discover more through guided study of Scripture.",
    detail: "Read in context. Look more closely. Grow in understanding through guided study of the Bible.",
    alt: "OBS attendees listening and studying together." },
  { title: "Table Discussions", short: "Discussions", icon: People, image: "/assets/obs-discussion.jpg", position: "50% 30%",
    description: "Share what you see in the text. Listen, learn, and grow around the table.",
    detail: "Share what you see in the text. Listen, learn, and grow around the table.",
    alt: "Two OBS attendees listening with open notes; a general gathering photograph." },
  { title: "Questions & Answers", short: "Q&A", icon: Question, image: "/assets/obs-speaker.jpg", position: "50% 38%",
    description: "Bring honest questions into a thoughtful, Scripture-centred conversation.",
    detail: "Bring honest questions into a thoughtful, Scripture-centred conversation.",
    alt: "An OBS speaker addressing the gathering from a lectern; a general conference photograph." },
  { title: "OBS Podcast Live Recording", short: "Live podcast", icon: Mic, image: "/assets/obs-listening.jpg", position: "50% 30%",
    description: "Be in the room for a conversation that takes the day’s learning further.",
    detail: "Be in the room for a conversation that takes the day’s learning further.",
    alt: "OBS attendees listening with a Bible and notebook; a general gathering photograph." },
];
const POINTS = [[32, 52], [16, 33], [60, 30], [86, 34]];

const STORY = [
  "OBS Conference is an annual gathering organised by Open Bible School (OBS), born out of a deep hunger for God's Word and a desire to know, understand, and rightly interpret the Scriptures.",
  "The story of OBS dates back to 2020, when what started as a small gathering of a few friends in a living room gradually became something much more. We would come together, sometimes from morning until night, to study God's Word, exploring deep biblical and theological concepts such as Christology, Pneumatology, Soteriology, and Hermeneutics. It was a community of friends united by one thing: an insatiable desire to know God through His Word.",
  "Over the years, that hunger continued to grow. In 2026, we felt a burden to make this experience open to more people, extending beyond our immediate circle of friends and creating a space where anyone with a genuine desire to study and understand the Bible could participate. This conviction gave birth to Open Bible School (OBS).",
  "OBS Conference is an extension of that original vision: bringing people together to study the Bible, ask questions, engage in meaningful conversations, and grow in their understanding of God's Word.",
  "We envision an environment where biblical learning goes beyond surface-level knowledge, encouraging participants to think deeply, engage with Scripture, challenge their understanding, and develop a lifelong commitment to studying the Word.",
  "The conference is open to everyone who desires to know God more deeply, grow in their understanding of Scripture, and become more intentional about living out His Word.",
  "Our desire is simple: that everyone who attends leaves with a deeper understanding of the Scriptures, a greater love for God, and a renewed commitment to being a student of His Word.",
];
// Each word gets a delay so the text "writes" itself in over WRITE_MS.
const WRITE_MS = 10000;
const TOTAL = STORY.reduce((n, p) => n + p.length + 1, 0);
const WORDS = (() => {
  let at = 0;
  return STORY.map((p) => p.split(" ").map((word) => {
    const delay = (at / TOTAL) * WRITE_MS, duration = ((word.length + 1) / TOTAL) * WRITE_MS;
    at += word.length + 1;
    return { word, delay, duration };
  }));
})();

const SECTIONS = [
  ["top", "The Word Is Worth Gathering Around"],
  ["invitation", "Come With Questions. Leave With a Deeper Understanding."],
  ["threshold", "Conference Overview"],
  ["gathering", "What to Expect at OBS Conference"],
  ["seat", "There’s Room to Grow in the Word"],
  ["facilitators", "In Good Company"],
  ["register", "Growing in the Word Begins Here"],
  ["visit", "Footer"],
];

// Official links: fill in when available; until then the icons show as "coming soon".
const SOCIAL_LINKS = { Instagram: null, YouTube: null, WhatsApp: null };

function PrimaryAction({ children, href = "#register" }) {
  return <a href={href} className="primary-action">{children}<ArrowUpRight size={18} /></a>;
}

function Facts() {
  return (
    <dl className="b-facts">
      {[["WHEN", "January 2, 2027"], ["TIME", "9 AM–5 PM WAT"], ["WHERE", "Ibadan, Nigeria"], ["YOUR INVITATION", "Registration is FREE"]].map(([k, v]) => (
        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  );
}

function Overview({ reduced }) {
  const ref = useRef(null);
  const [state, setState] = useState("waiting"); // waiting | writing | complete

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => { if (mq.matches || reduced) setState("complete"); };
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, [reduced]);

  useEffect(() => {
    if (state !== "waiting" || !ref.current) return;
    if (!("IntersectionObserver" in window)) { setState("complete"); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setState((s) => (s === "waiting" ? "writing" : s)); io.disconnect(); }
    }, { threshold: 0, rootMargin: "0px 0px -18% 0px" });
    io.observe(ref.current.querySelector(".overview-book"));
    return () => io.disconnect();
  }, [state]);

  useEffect(() => {
    if (state !== "writing") return;
    const t = setTimeout(() => setState("complete"), WRITE_MS);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <section ref={ref} className="b-overview section-pad" id="threshold" aria-labelledby="threshold-heading" data-writing-state={state}>
      <div className="overview-heading">
        <h2 id="threshold-heading">CONFERENCE OVERVIEW</h2>
        <button className="overview-reveal" type="button" aria-controls="overview-story" onClick={() => setState("complete")} aria-disabled={state === "complete"}>
          {state === "complete" ? "Full story visible" : "Show Full Story"} <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="overview-book" id="overview-story">
        {[[0, 1, 2], [3, 4, 5, 6]].map((paras, page) => (
          <article key={page} className={`overview-page overview-page-${page + 1}`} aria-label={`Conference overview, page ${page + 1} of 2`}>
            <div className="overview-running-head" aria-hidden="true">
              <span>OPEN BIBLE SCHOOL</span><span>{page === 0 ? "OUR STORY" : "OUR VISION"}</span>
            </div>
            <div className="overview-prose">
              {paras.map((p) => (
                <p key={p}>
                  <span className="overview-accessible">{STORY[p]}</span>
                  <span aria-hidden="true">
                    {WORDS[p].map(({ word, delay, duration }, i) => (
                      <Fragment key={i}>
                        <span className="overview-word" style={{ "--ink-delay": `${delay}ms`, "--ink-duration": `${duration}ms` }}>{word}</span>
                        {i < WORDS[p].length - 1 ? " " : ""}
                      </Fragment>
                    ))}
                  </span>
                </p>
              ))}
            </div>
            <div className="overview-folio" aria-hidden="true"><span>OBS CONFERENCE ’27</span><span>0{page + 1}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Gathering() {
  const [sel, setSel] = useState(0);
  const btns = useRef([]);
  const current = ACTIVITIES[sel];
  const onKey = (e, i) => {
    const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % 4
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i + 3) % 4
      : e.key === "Home" ? 0 : e.key === "End" ? 3 : null;
    if (next !== null) { e.preventDefault(); setSel(next); btns.current[next]?.focus({ preventScroll: true }); }
  };
  return (
    <section className="b-gathering section-pad" id="gathering" aria-labelledby="gathering-heading">
      <div className="section-heading">
        <div><h2 id="gathering-heading">{COPY.activitiesHeading}</h2></div>
        <p>{COPY.activitiesIntro}</p>
      </div>
      <div className="gathering-preview" id="activity-image" role="group" aria-label="Selected conference activity">
        <div className="activity-photo-stack">
          {ACTIVITIES.map((a, i) => (
            <img key={a.title} src={a.image} alt={sel === i ? a.alt : ""} aria-hidden={sel !== i}
              className={sel === i ? "active" : ""} style={{ objectPosition: a.position }} decoding="async" />
          ))}
        </div>
        {ACTIVITIES.map((a, i) => (
          <button key={a.title} className={`preview-point ${sel === i ? "selected" : ""}`}
            style={{ left: `${POINTS[i][0]}%`, top: `${POINTS[i][1]}%` }} onClick={() => setSel(i)}
            aria-label={a.title} aria-pressed={sel === i} aria-controls="activity-image activity-description">
            <span>0{i + 1}</span><b>{a.short}</b><Plus size={14} />
          </button>
        ))}
        <div className="activity-image-description" id="activity-description" aria-live="polite" aria-atomic="true">
          <h3>{current.title}</h3>
          <p>{current.detail}</p>
        </div>
      </div>
      <div className="b-activities" role="group" aria-label="Conference activities">
        {ACTIVITIES.map((a, i) => {
          const Icon = a.icon;
          return (
            <button key={a.title} ref={(el) => { btns.current[i] = el; }} className={sel === i ? "selected" : ""}
              onClick={() => setSel(i)} onKeyDown={(e) => onKey(e, i)} aria-pressed={sel === i}
              aria-controls="activity-image activity-description">
              <div><span>0{i + 1}</span><Icon size={22} /></div>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <span className="activity-discover">{sel === i ? "Selected activity" : "Explore this moment"}<ArrowUpRight size={16} /></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SocialIcons() {
  return (
    <div className="social-icons" aria-label="OBS social media">
      {Object.entries(SOCIAL).map(([name, uri]) => {
        const href = SOCIAL_LINKS[name];
        const style = { "--social-icon": `url("${uri}")` };
        return href ? (
          <a key={name} href={href} aria-label={name} className="social-icon" style={style}><span aria-hidden="true" /></a>
        ) : (
          <span key={name} role="img" aria-label={`${name} — official link coming soon`} title={`${name} — official link coming soon`}
            className="social-icon unavailable" style={style}><span aria-hidden="true" /></span>
        );
      })}
    </div>
  );
}

// Reduced motion: device setting, overridable from the footer toggle (remembered in this browser).
function useMotion() {
  const [system, setSystem] = useState(false);
  const [choice, setChoice] = useState(null);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setSystem(mq.matches);
    try {
      if (new URLSearchParams(location.search).get("motion") === "reduced") setChoice(true);
      else { const s = localStorage.getItem("obs-b-motion"); if (s !== null) setChoice(s === "reduced"); }
    } catch {}
    const on = () => setSystem(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const reduced = choice ?? system;
  useEffect(() => { document.documentElement.dataset.motion = reduced ? "reduced" : "full"; }, [reduced]);
  const toggle = () => setChoice((c) => {
    const next = !(c ?? system);
    try { localStorage.setItem("obs-b-motion", next ? "reduced" : "full"); } catch {}
    return next;
  });
  return [reduced, toggle];
}

export default function Site() {
  const [reduced, toggleMotion] = useMotion();
  const [menu, setMenu] = useState(false);
  const menuBtn = useRef(null);

  useEffect(() => {
    const goRegister = () => requestAnimationFrame(() => {
      document.getElementById("register")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
      document.getElementById("register-heading")?.focus({ preventScroll: true });
    });
    const onClick = (e) => {
      if (e.target.closest?.('a[href="#register"]')) { e.preventDefault(); goRegister(); setMenu(false); }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduced]);

  return (
    <>
      <a className="skip-link" href="#register">Skip to registration</a>
      <header className="b-header">
        <a href="#top" className="b-brand" aria-label="Open Bible School — home">
          <img src="/assets/obs-logo-green.png" alt="OBS" />
          <span>Conference ’27</span>
        </a>
        <nav className="b-desktop-nav" aria-label="Main navigation">
          <a href="#threshold">The experience</a>
          <a href="#facilitators">Facilitators</a>
          <a href="#visit">Plan your visit</a>
          <a href="#register" className="header-seat">Save my seat <ArrowUpRight size={16} /></a>
        </nav>
        <button ref={menuBtn} className="b-menu-button" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu}
          aria-controls="b-mobile-menu" onClick={() => setMenu(!menu)}>
          {menu ? <Close /> : <Menu />}
        </button>
      </header>
      {menu && (
        <nav className="b-mobile-menu" id="b-mobile-menu" aria-label="Mobile navigation"
          onKeyDown={(e) => { if (e.key === "Escape") { setMenu(false); menuBtn.current?.focus(); } }}>
          {SECTIONS.slice(1, 7).map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}
        </nav>
      )}

      <main>
        <section id="top" className="b-hero" aria-labelledby="hero-heading">
          <div className="hero-title-row">
            <h1 id="hero-heading">{COPY.heroLine1}<br /><span>{COPY.heroLine2}</span></h1>
            <div className="hero-identity">
              <p className="hero-event-name">OBS CONFERENCE ’27</p>
              <p className="hero-description">Bring your Bible.<br /> Bring your questions.<br />Come as you are.</p>
            </div>
          </div>
          <div className="hero-photo">
            <picture><img src="/assets/obs-hero.jpg" alt="OBS attendees sharing a joyful moment together outside the gathering." fetchPriority="high" /></picture>
            <div className="hero-image-caption">
              <p>A day to study Scripture deeply,<br />ask honestly, and grow together.</p>
              <PrimaryAction>Secure My Seat — Free</PrimaryAction>
            </div>
          </div>
          <Facts />
        </section>

        <section className="b-invitation section-pad" id="invitation" aria-labelledby="invitation-heading">
          <div><h2 id="invitation-heading">{COPY.invitationHeading}</h2></div>
          <div>
            <p>{COPY.invitation}</p>
            <a className="text-link" href="#threshold">Meet the gathering <ArrowDown size={16} /></a>
          </div>
        </section>

        <Overview reduced={reduced} />
        <Gathering />

        <section className="b-seat section-pad" id="seat" aria-labelledby="seat-heading">
          <div className="seat-detail"><img src="/assets/obs-community.jpg" alt="Four OBS participants smiling together after the gathering." /></div>
          <div className="seat-invitation">
            <h2 id="seat-heading">{COPY.growthHeading}</h2>
            <p>{COPY.growth}</p>
            <PrimaryAction>Claim My Seat</PrimaryAction>
          </div>
        </section>

        <section className="facilitators section-pad" id="facilitators">
          <div className="section-heading">
            <div><h2>IN GOOD COMPANY.</h2></div>
            <p>Thoughtful guides. Shared discovery.<br />Official facilitator lineup coming soon.</p>
          </div>
          <div className="profile-grid">
            {[1, 2, 3].map((n) => (
              <article key={n} className="profile" aria-label={`Facilitator ${n} — to be announced`}>
                <div className="portrait-crop"><img src={`/assets/facilitator-${n}.jpg`} alt="Anonymous silhouette — facilitator to be announced" loading="lazy" /></div>
                <h3>To Be Announced</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="registration-section section-pad" id="register">
          <div className="registration-intro">
            <h2 id="register-heading" tabIndex={-1}>{COPY.registrationHeading}</h2>
            <p>{COPY.registration}</p>
            <ul className="visit-details">
              <li><Calendar />January 2, 2027 · 9 AM–5 PM WAT</li>
              <li><Pin />Ibadan, Nigeria</li>
              <li><Ticket />Registration is FREE</li>
            </ul>
            <p className="small-note">Exact venue and arrival details to be confirmed.</p>
          </div>
          <RegisterForm />
        </section>

        <footer className="site-footer section-pad" id="visit">
          <div>
            <img src="/assets/obs-logo-gold.png" alt="OBS — Open Bible School" />
            <h3>A gathering by Open Bible School.</h3>
            <p>Opening the Scriptures. Growing in understanding.<br />Making room for one another.</p>
          </div>
          <div>
            <p className="eyebrow">MAKE A DAY OF IT</p>
            <p>January 2, 2027<br />9 AM–5 PM WAT<br />Ibadan, Nigeria</p>
            <p className="small-note">Venue announcement coming soon.</p>
          </div>
          <div>
            <p className="eyebrow">STAY IN THE CONVERSATION</p>
            <p>Contact email · to be announced</p>
            <SocialIcons />
            <p className="small-note">Official contact links coming soon.</p>
          </div>
          <div className="footer-bottom">
            <span>© 2027 Open Bible School</span>
            <span>ENTER THE WORD. FIND YOUR PLACE.</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}>Back to top ↑</button>
            <button aria-pressed={reduced} onClick={toggleMotion}>Reduce motion: {reduced ? "on" : "off"}</button>
          </div>
        </footer>
      </main>
    </>
  );
}

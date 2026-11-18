import Reveal from "./components/Reveal";
import Expect from "./components/Expect";
import Book from "./components/Book";
import RegisterForm from "./components/RegisterForm";
import { ScrollProgress, MotionToggle } from "./components/Chrome";

const facts = [
  ["When", "January 2, 2027"],
  ["Time", "9 AM–5 PM WAT"],
  ["Where", "Ibadan, Nigeria"],
  ["Your invitation", "Registration is FREE"],
];
const socials = [
  ["Instagram", <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" /></>],
  ["YouTube", <><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="M10 9.5l5 2.5-5 2.5z" /></>],
  ["WhatsApp", <><path d="M3 21l1.6-4.8A9 9 0 1 1 8 19.6z" /><path d="M9 8.5c.3 3 2.5 5.2 6 6.3l1-1.5-2-1-1 .7c-1-.4-1.8-1.2-2.2-2.2l.7-1-1-2z" /></>],
];

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <header className="nav">
        <a href="#top" className="brand"><span className="mark">OBS</span><span>Conference ’27</span></a>
        <nav>
          <a href="#experience">The experience</a>
          <a href="#facilitators">Facilitators</a>
          <a href="#visit">Plan your visit</a>
          <a href="#register" className="btn-outline">Save my seat <span>↗</span></a>
        </nav>
      </header>

      <main id="top">
        <section className="wrap hero">
          <h1 className="display">
            <span className="line green"><span style={{ "--d": "100ms" }}>The Word is worth</span></span>
            <span className="line red"><span style={{ "--d": "300ms" }}>gathering around.</span></span>
          </h1>
          <Reveal className="hero-side" delay={500}>
            <h2>OBS Conference ’27</h2>
            <p>Bring your Bible.<br />Bring your questions.<br />Come as you are.</p>
          </Reveal>
        </section>

        <section className="wrap">
          <Reveal className="photo hero-photo" delay={200}>
            <p>A day to study Scripture deeply, ask honestly, and grow together.</p>
            <a href="#register" className="btn-amber">Secure My Seat — Free <span>↗</span></a>
          </Reveal>
          <dl className="facts">
            {facts.map(([k, v], i) => (
              <Reveal key={k} delay={i * 110}><dt>{k}</dt><dd>{v}</dd></Reveal>
            ))}
          </dl>
        </section>

        <section className="wrap intro">
          <Reveal as="h2" className="display red">Come with questions. Leave with a deeper understanding.</Reveal>
          <Reveal delay={200}>
            <p>A day to open the Scriptures, ask honest questions, learn together, and grow in our understanding of God&apos;s Word. Come ready to listen, share, search the Scriptures, and be strengthened in your walk with Jesus. Because we believe the Bible should be understood, lived, and studied together.</p>
            <a href="#overview" className="link">Meet the gathering <span>↓</span></a>
          </Reveal>
        </section>

        <section id="overview" className="dark tight">
          <div className="wrap">
            <Reveal className="head">
              <h2 className="display cream">Conference overview</h2>
              <a href="#overview" className="link small">Full story visible <span>↗</span></a>
            </Reveal>
            <Reveal delay={150}><Book /></Reveal>
          </div>
        </section>

        <section id="experience" className="dark">
          <div className="wrap">
            <Reveal className="head">
              <h2 className="display cream">What to expect at OBS Conference</h2>
              <p>Four moments. One shared pursuit: growing in the knowledge of God&apos;s Word.</p>
            </Reveal>
            <Expect />
            <div className="grow">
              <Reveal className="photo grow-photo" />
              <Reveal delay={200} className="grow-copy">
                <h2 className="display cream">There’s room to grow in the Word</h2>
                <p>Whatever your background, there is a seat for you. Come with your Bible and your questions.</p>
                <a href="#register" className="btn-amber">Secure My Seat — Free <span>↗</span></a>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="facilitators" className="wrap placeholder">
          <Reveal as="h2" className="display green">Facilitators</Reveal>
          <Reveal as="p" delay={150}>Add your facilitators here.</Reveal>
        </section>

        <section id="register" className="reg">
          <div className="wrap reg-grid">
            <Reveal className="reg-copy">
              <h2 className="display cream">Growing in the Word<br />begins here.</h2>
              <p>One day. Open Scriptures. Honest conversations. A community gathered to know God and understand His Word more deeply. We would love to have you with us.</p>
              <ul id="visit">
                <li>January 2, 2027 · 9 AM–5 PM WAT</li>
                <li>Ibadan, Nigeria</li>
                <li>Registration is FREE</li>
              </ul>
              <small>Exact venue and arrival details to be confirmed.</small>
            </Reveal>
            <Reveal delay={200}><RegisterForm /></Reveal>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-grid">
          <Reveal>
            <div className="mark big">OBS</div>
            <h3>A gathering by Open Bible School.</h3>
            <p>Opening the Scriptures. Growing in understanding.<br />Making room for one another.</p>
          </Reveal>
          <Reveal delay={120}>
            <h4>Make a day of it</h4>
            <p>January 2, 2027<br />9 AM–5 PM WAT<br />Ibadan, Nigeria</p>
            <small>Venue announcement coming soon.</small>
          </Reveal>
          <Reveal delay={240}>
            <h4>Stay in the conversation</h4>
            <p>Contact email · to be announced</p>
            <div className="socials">
              {socials.map(([label, shape]) => (
                <a key={label} href="#" aria-label={label}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{shape}</svg>
                </a>
              ))}
            </div>
            <small>Official contact links coming soon.</small>
          </Reveal>
        </div>
        <div className="wrap foot-bar">
          <span>© 2027 Open Bible School</span>
          <span className="tag">Enter the Word. Find your place.</span>
          <a href="#top">Back to top ↑</a>
          <MotionToggle />
        </div>
      </footer>
    </>
  );
}

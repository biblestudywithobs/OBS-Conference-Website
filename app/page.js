import Expect from "./components/Expect";
import RegisterForm from "./components/RegisterForm";

const facts = [
  ["When", "January 2, 2027"],
  ["Time", "9 AM–5 PM WAT"],
  ["Where", "Ibadan, Nigeria"],
  ["Your invitation", "Registration is FREE"],
];

export default function Home() {
  return (
    <>
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
            <span className="green">The Word is worth</span>
            <span className="red">gathering around.</span>
          </h1>
          <div className="hero-side">
            <h2>OBS Conference ’27</h2>
            <p>Bring your Bible.<br />Bring your questions.<br />Come as you are.</p>
          </div>
        </section>

        <section className="wrap">
          <div className="photo hero-photo">
            <p>A day to study Scripture deeply, ask honestly, and grow together.</p>
            <a href="#register" className="btn-amber">Secure My Seat — Free <span>↗</span></a>
          </div>
          <dl className="facts">
            {facts.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </section>

        <section className="wrap intro">
          <h2 className="display red">Come with questions. Leave with a deeper understanding.</h2>
          <div>
            <p>A day to open the Scriptures, ask honest questions, learn together, and grow in our understanding of God&apos;s Word. Come ready to listen, share, search the Scriptures, and be strengthened in your walk with Jesus. Because we believe the Bible should be understood, lived, and studied together.</p>
            <a href="#experience" className="link">Meet the gathering ↓</a>
          </div>
        </section>

        <section id="experience" className="dark">
          <div className="wrap">
            <div className="head">
              <h2 className="display cream">What to expect at OBS Conference</h2>
              <p>Four moments. One shared pursuit: growing in the knowledge of God&apos;s Word.</p>
            </div>
            <Expect />
          </div>
        </section>

        <section id="overview" className="dark tight">
          <div className="wrap">
            <div className="head">
              <h2 className="display cream">Conference overview</h2>
            </div>
            <div className="book">
              <article>
                <div className="running"><span>Open Bible School</span><span>Our story</span></div>
                <p>OBS Conference is an annual gathering organised by Open Bible School (OBS), born out of a deep hunger for God&apos;s Word and a desire to know, understand, and rightly interpret the Scriptures.</p>
                <p>The story of OBS dates back to 2020, when what started as a small gathering of a few friends in a living room gradually became something much more. We would come together, sometimes from morning until night, to study God&apos;s Word, exploring deep biblical and theological concepts such as Christology, Pneumatology, Soteriology, and Hermeneutics. It was a community of friends united by one thing: an insatiable desire to know God through His Word.</p>
                <p>Over the years, that hunger continued to grow. In 2026, we felt a burden to make this experience open to more people, extending beyond our immediate circle of friends and creating a space where anyone with a genuine desire to study and understand the Bible could participate.</p>
              </article>
              <article>
                <div className="running"><span>Open Bible School</span><span>Our vision</span></div>
                <p>OBS Conference is an extension of that original vision: bringing people together to study the Bible, ask questions, engage in meaningful conversations, and grow in their understanding of God&apos;s Word.</p>
                <p>We envision an environment where biblical learning goes beyond surface-level knowledge, encouraging participants to think deeply, engage with Scripture, challenge their understanding, and develop a lifelong commitment to studying the Word.</p>
                <p>The conference is open to everyone who desires to know God more deeply, grow in their understanding of Scripture, and become more intentional about living out His Word.</p>
                <p>Our desire is simple: that everyone who attends leaves with a deeper understanding of the Scriptures, a greater love for God, and a renewed commitment to being a student of His Word.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="facilitators" className="wrap placeholder">
          <h2 className="display green">Facilitators</h2>
          <p>Add your facilitators here.</p>
        </section>

        <section id="register" className="reg">
          <div className="wrap reg-grid">
            <div className="reg-copy">
              <h2 className="display cream">Growing in the Word<br />begins here.</h2>
              <p>One day. Open Scriptures. Honest conversations. A community gathered to know God and understand His Word more deeply. We would love to have you with us.</p>
              <ul id="visit">
                <li>January 2, 2027 · 9 AM–5 PM WAT</li>
                <li>Ibadan, Nigeria</li>
                <li>Registration is FREE</li>
              </ul>
              <small>Exact venue and arrival details to be confirmed.</small>
            </div>
            <RegisterForm />
          </div>
        </section>
      </main>
    </>
  );
}

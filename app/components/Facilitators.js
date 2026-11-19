import Reveal from "./Reveal";

// Placeholder cards until the facilitator lineup is confirmed.
const facilitators = [1, 2, 3];

function Silhouette() {
  return (
    <svg viewBox="0 0 200 260" aria-hidden="true">
      <circle cx="100" cy="95" r="42" />
      <path d="M20 260c0-60 36-100 80-100s80 40 80 100z" />
    </svg>
  );
}

export default function Facilitators() {
  return (
    <section id="facilitators" className="wrap facil">
      <Reveal className="facil-head">
        <h2 className="display green">In good company.</h2>
        <p>Thoughtful guides. Shared discovery. Official facilitator lineup coming soon.</p>
      </Reveal>
      <div className="facil-grid">
        {facilitators.map((id, i) => (
          <Reveal as="article" key={id} delay={i * 120}>
            <div className="facil-photo"><Silhouette /></div>
            <h3>To be announced</h3>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

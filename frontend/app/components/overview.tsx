const pages = [
  {
    label: "Our story",
    number: "01",
    paragraphs: [
      "OBS Conference is an annual gathering organised by Open Bible School (OBS), born out of a deep hunger for God’s Word and a desire to know, understand, and rightly interpret the Scriptures.",
      "The story of OBS dates back to 2020, when what started as a small gathering of a few friends in a living room gradually became something much more. We would come together, sometimes from morning until night, to study God’s Word, exploring deep biblical and theological concepts such as Christology, Pneumatology, Soteriology, and Hermeneutics. It was a community of friends united by one thing: an insatiable desire to know God through His Word.",
      "Over the years, that hunger continued to grow. In 2026, we felt a burden to make this experience open to more people, extending beyond our immediate circle of friends and creating a space where anyone with a genuine desire to study and understand the Bible could participate. This conviction gave birth to Open Bible School (OBS).",
    ],
  },
  {
    label: "Our vision",
    number: "02",
    paragraphs: [
      "OBS Conference is an extension of that original vision: bringing people together to study the Bible, ask questions, engage in meaningful conversations, and grow in their understanding of God’s Word.",
      "We envision an environment where biblical learning goes beyond surface-level knowledge, encouraging participants to think deeply, engage with Scripture, challenge their understanding, and develop a lifelong commitment to studying the Word.",
      "The conference is open to everyone who desires to know God more deeply, grow in their understanding of Scripture, and become more intentional about living out His Word.",
      "Our desire is simple: that everyone who attends leaves with a deeper understanding of the Scriptures, a greater love for God, and a renewed commitment to being a student of His Word.",
    ],
  },
];

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20 bg-forest px-6 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-5xl uppercase text-cream md:text-6xl">
            Conference Overview
          </h2>
          <span className="hidden border-b border-cream/20 pb-1 text-[11px] text-cream/60 md:block">
            Full story visible ↗
          </span>
        </div>

        <div className="mt-8 grid overflow-hidden rounded-lg border-2 border-green bg-cream shadow-2xl md:grid-cols-2 md:divide-x md:divide-green/20">
          {pages.map((page) => (
            <article key={page.label} className="flex flex-col p-8 md:p-10">
              <header className="flex justify-between border-b border-green/20 pb-3 text-[10px] font-semibold uppercase tracking-widest text-green">
                <span>Open Bible School</span>
                <span>{page.label}</span>
              </header>
              <div className="mt-6 flex-1 space-y-4 font-serif text-[15px] leading-relaxed text-ink">
                {page.paragraphs.map((p) => (
                  <p key={p.slice(0, 30)}>{p}</p>
                ))}
              </div>
              <footer className="mt-8 flex justify-between text-[10px] uppercase tracking-widest text-green/70">
                <span>OBS Conference ’27</span>
                <span>{page.number}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
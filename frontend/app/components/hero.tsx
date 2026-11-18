import Image from "next/image";

const details = [
  { label: "When", value: "January 2, 2027" },
  { label: "Time", value: "9 AM–5 PM WAT" },
  { label: "Where", value: "Ibadan, Nigeria" },
  { label: "Your invitation", value: "Registration is FREE" },
];

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <h1 className="font-display text-6xl uppercase leading-[0.95] text-green md:text-8xl">
          The Word is worth
          <span className="block text-red">gathering around.</span>
        </h1>
        <div className="md:pt-4 md:text-right">
          <p className="font-display text-3xl uppercase text-green">OBS Conference ’27</p>
          <p className="mt-2 text-sm leading-relaxed text-green/80">
            Bring your Bible.
            <br />
            Bring your questions.
            <br />
            Come as you are.
          </p>
        </div>
      </div>

      <div className="relative mt-8 aspect-[4/3] overflow-hidden md:aspect-[16/7]">
        <Image
          src="/images/hero.jpg"
          alt="Attendees at a previous OBS conference"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-end">
          <p className="max-w-xs text-sm text-white">
            A day to study Scripture deeply, ask honestly, and grow in the Word.
          </p>
          <a
            href="#visit"
            className="rounded-sm bg-gold px-6 py-3 text-sm font-semibold text-forest transition hover:brightness-95"
          >
            Secure My Seat — Free ↗
          </a>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-6 border-b border-green/20 pb-6 md:grid-cols-4">
        {details.map((item) => (
          <div key={item.label}>
            <dt className="text-[11px] font-semibold uppercase tracking-widest text-green/70">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-green">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
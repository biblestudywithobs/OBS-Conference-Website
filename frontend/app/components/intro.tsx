export default function Intro() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.4fr_1fr] md:items-center">
      <h2 className="font-display text-5xl uppercase leading-[0.95] text-red md:text-7xl">
        Come with questions. Leave with a deeper understanding.
      </h2>
      <div>
        <p className="text-sm leading-relaxed text-green/90">
          A day to open the Scriptures, ask honest questions, learn together, and grow in our
          understanding of God’s Word. Come ready to listen, share, search the Scriptures, and be
          strengthened in your walk with Jesus. Because we believe the Bible should be understood,
          lived, and studied together.
        </p>
        <a
          href="#overview"
          className="mt-6 inline-block border-b border-green/40 text-sm text-green transition hover:text-red"
        >
          Meet the gathering ↓
        </a>
      </div>
    </section>
  );
}
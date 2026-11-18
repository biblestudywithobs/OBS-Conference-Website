"use client";

import Image from "next/image";
import { useState } from "react";

const overview = {
  title: "Attendees at a previous OBS conference",
  image: "/images/experience-overview.jpg",
};

const moments = [
  {
    title: "OBS Bible Study",
    short: "Bible study",
    text: "Read in context and discover more through guided study of Scripture.",
    image: "/images/moment-bible-study.jpg",
    pill: "left-[22%] top-[72%]",
  },
  {
    title: "Table Discussions",
    short: "Discussions",
    text: "Share what you see in the text. Listen, learn, and grow around the table.",
    image: "/images/moment-table.jpg",
    pill: "left-[6%] top-[48%]",
  },
  {
    title: "Questions & Answers",
    short: "Q&A",
    text: "Bring honest questions into a thoughtful, Scripture-centred conversation.",
    image: "/images/moment-qa.jpg",
    pill: "left-[44%] top-[54%]",
  },
  {
    title: "OBS Podcast Live Recording",
    short: "Live podcast",
    text: "Be in the room for a conversation that takes the day’s learning further.",
    image: "/images/moment-podcast.jpg",
    pill: "right-[8%] top-[50%]",
  },
];

// slide 0 is the overview, slides 1-4 are the moments
const slides = [overview, ...moments];

export default function Experience() {
  const [active, setActive] = useState<number | null>(null);
  const currentSlide = active === null ? 0 : active + 1;
  const showingOverview = active === null;

  return (
    <section id="experience" className="scroll-mt-20 bg-forest px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-md font-display text-5xl uppercase leading-[0.95] text-cream md:text-6xl">
            What to expect at OBS Conference
          </h2>
          <p className="max-w-xs text-sm text-cream/70">
            Four moments. One shared pursuit: growing in the knowledge of God’s Word.
          </p>
        </div>

        <div className="relative mt-10 aspect-[4/3] overflow-hidden md:aspect-[16/8]">
          {/* All photos stacked; only the current one is visible */}
          {slides.map((slide, i) => (
            <div
              key={slide.image}
              aria-hidden={i !== currentSlide}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                i === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className={`object-cover transition-transform duration-[1400ms] ease-out motion-reduce:transition-none ${
                  i === currentSlide ? "scale-100" : "scale-105"
                }`}
              />
            </div>
          ))}

          {/* Floating labels (overview only) */}
          <div
            aria-hidden={!showingOverview}
            className={`transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${
              showingOverview ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {moments.map((m, i) => (
              <button
                key={m.short}
                onClick={() => setActive(i)}
                tabIndex={showingOverview ? 0 : -1}
                className={`absolute flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg transition-transform duration-300 ease-out hover:scale-105 ${m.pill} ${
                  i === 3 ? "bg-gold text-forest" : "bg-forest/90 text-cream"
                }`}
              >
                <span className="opacity-60">0{i + 1}</span>
                {m.short}
                <span>+</span>
              </button>
            ))}
          </div>

          {/* Back to overview */}
          <button
            onClick={() => setActive(null)}
            tabIndex={showingOverview ? -1 : 0}
            aria-hidden={showingOverview}
            className={`absolute left-4 top-4 rounded-full bg-forest/90 px-3 py-1.5 text-xs font-semibold text-cream shadow-lg transition-all duration-500 ease-in-out hover:scale-105 motion-reduce:transition-none ${
              showingOverview ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            ← Overview
          </button>

          {/* Captions: each fades in and slides up after its photo starts to appear */}
          {moments.map((m, i) => (
            <div
              key={m.title}
              aria-hidden={active !== i}
              className={`absolute bottom-0 left-0 max-w-xs bg-cream p-5 transition-all duration-700 ease-out motion-reduce:transition-none ${
                active === i
                  ? "translate-y-0 opacity-100 delay-200"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              <h3 className="font-display text-2xl uppercase text-green">{m.title}</h3>
              <p className="mt-1 text-xs text-green/80">{m.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {moments.map((m, i) => (
            <button
              key={m.title}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`border-t pt-4 text-left transition-colors duration-500 ease-in-out ${
                i === active ? "border-gold text-gold" : "border-cream/20 text-cream"
              }`}
            >
              <span className="text-xs opacity-60">0{i + 1}</span>
              <h4 className="mt-3 text-sm font-semibold">{m.title}</h4>
              <p className="mt-2 text-xs opacity-70">{m.text}</p>
              <span className="mt-3 inline-block text-xs">
                {i === active ? "Selected activity ↗" : "Explore this moment ↗"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
import Image from "next/image";

export default function Invitation() {
  return (
    <section className="bg-forest px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[0.8fr_1fr]">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src="/images/invitation.jpg"
            alt="Friends gathered at a previous OBS conference"
            fill
            sizes="(min-width: 768px) 460px, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="font-display text-5xl uppercase leading-[0.95] text-cream md:text-7xl">
            There’s room to grow in the Word
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/80">
            You don’t have to have all the answers. Come with your questions, an open heart, and a
            willingness to learn. We grow together in the knowledge of God’s Word.
          </p>
          <a
            href="#visit"
            className="mt-8 inline-block rounded-sm bg-gold px-6 py-3 text-sm font-semibold text-forest transition hover:brightness-95"
          >
            Claim My Seat ↗
          </a>
        </div>
      </div>
    </section>
  );
}
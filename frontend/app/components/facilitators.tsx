const facilitators = [{ id: 1 }, { id: 2 }, { id: 3 }];

function Silhouette() {
  return (
    <svg viewBox="0 0 200 260" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="95" r="42" fill="#08190e" />
      <path d="M20 260c0-60 36-100 80-100s80 40 80 100z" fill="#08190e" />
    </svg>
  );
}

export default function Facilitators() {
  return (
    <section id="facilitators" className="scroll-mt-20 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="font-display text-5xl uppercase text-green md:text-6xl">In good company.</h2>
          <p className="max-w-xs text-sm text-green/80 md:text-right">
            Thoughtful guides. Shared discovery. Official facilitator lineup coming soon.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {facilitators.map((f) => (
            <div key={f.id}>
              <div className="aspect-[3/4] overflow-hidden bg-gradient-to-b from-green/70 to-forest">
                <Silhouette />
              </div>
              <p className="mt-4 font-display text-2xl uppercase text-green">To be announced</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
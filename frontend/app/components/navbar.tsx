const links = [
  { label: "The experience", href: "#experience" },
  { label: "Facilitators", href: "#facilitators" },
  { label: "Plan your visit", href: "#visit" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-green/15 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <a
          href="#"
          className="font-display text-2xl uppercase leading-none tracking-wide text-green sm:text-3xl"
        >
          Bible Conference ’27
        </a>

        <ul className="hidden items-center gap-8 text-sm text-green md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition hover:text-red">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#visit"
              className="rounded-sm border border-green/30 px-5 py-2 transition hover:bg-green hover:text-cream"
            >
              Save my seat ↗
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
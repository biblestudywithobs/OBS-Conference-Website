import { FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";

// TODO: replace each "#" with the real link once the team has them
const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: <FaInstagram />,
  },
  {
    label: "YouTube",
    href: "#",
    icon: <FaYoutube />,
  },
  {
    label: "WhatsApp",
    href: "#",
    icon: <FaWhatsapp />,
  },
];

export default function Footer() {
  return (
    <footer className="bg-forest px-6 pt-14 text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-5xl text-gold">OBS</p>
          <p className="mt-2 text-sm">A gathering by Open Bible School.</p>
          <p className="mt-2 max-w-xs text-xs text-cream/70">
            Opening the Scriptures. Growing in understanding. Making room for one another.
          </p>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-gold">
            Make a day of it
          </h4>
          <ul className="mt-3 space-y-1 text-sm text-cream/80">
            <li>January 2, 2027</li>
            <li>9 AM–5 PM WAT</li>
            <li>Ibadan, Nigeria</li>
            <li className="text-xs text-cream/60">Venue announcement coming soon.</li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-gold">
            Stay in the conversation
          </h4>
          <p className="mt-3 text-sm text-cream/80">Contact email · to be announced</p>

          <ul className="mt-5 flex gap-6">
            {socials.map(({ label, href, icon }) => (
              <li key={label}>
                <a
                  href={href}
                  className="flex flex-col items-center gap-2 text-cream/80 transition-colors duration-300 hover:text-gold"
                >
                  {icon}
                  <span className="text-xs">{label}</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs text-cream/60">Official contact links coming soon.</p>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-cream/15 py-6 text-[11px] text-cream/60 sm:flex-row sm:items-center">
        <span>© 2027 Open Bible School</span>
        <span className="uppercase tracking-widest text-gold">Enter the Word. Find your place.</span>
        <a href="#" className="hover:text-gold">Back to top ↑</a>
      </div>
    </footer>
  );
}
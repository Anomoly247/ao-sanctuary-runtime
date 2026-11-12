const AO_NETWORK_LINKS = [
  {
    href: "https://anomoriginals.lol/",
    label: "Anom Originals",
    role: "Canonical AO universe",
    domain: "anomoriginals.lol",
  },
  {
    href: "https://anomartsy.xyz/",
    label: "Anom Artsy",
    role: "Public art / Homeworld",
    domain: "anomartsy.xyz",
  },
  {
    href: "https://anomarsty.lol/",
    label: "Anomarsty",
    role: "Glow + mount economy",
    domain: "anomarsty.lol",
  },
  {
    href: "https://universe.anomoriginals.lol/",
    label: "AO Sanctuary",
    role: "Social sanctuary runtime",
    domain: "universe.anomoriginals.lol",
  },
] as const;

export default function AONetworkDirectory() {
  return (
    <footer className="ao-network-footer" aria-labelledby="ao-network-title">
      <div className="ao-network-inner">
        <div className="ao-network-intro">
          <p className="ao-network-kicker">AO NETWORK // CONNECTED WORLDS</p>
          <h2 id="ao-network-title">One universe. Many doors.</h2>
          <p>
            Each property has its own purpose, while the wider AO identity stays connected across art, sanctuary, and Glow.
          </p>
        </div>
        <nav className="ao-network-links" aria-label="AO Network properties">
          {AO_NETWORK_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ao-network-link"
              aria-label={`${link.label}, ${link.role}, ${link.domain}; opens in a new tab`}
            >
              <span className="ao-network-link-label">{link.label}</span>
              <span className="ao-network-link-role">{link.role}</span>
              <span className="ao-network-link-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <p className="ao-network-note">
          Canonical links are shown exactly as maintained by Anom Originals. Each door opens in a new tab.
        </p>
      </div>
    </footer>
  );
}

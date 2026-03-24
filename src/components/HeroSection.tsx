export function HeroSection() {
  return (
    <section className="hero-section" id="top" aria-labelledby="hero-heading">
      <p className="hero-eyebrow">Portfolio prototype</p>
      <h1 id="hero-heading" className="hero-title">
        Work, volunteer, and a bit about me
      </h1>
      <p className="hero-lede">
        Browse projects and volunteer roles below, or use the form to try the
        fields you will eventually persist with a backend.
      </p>
      <a className="hero-cta" href="#projects">
        View projects
      </a>
    </section>
  )
}

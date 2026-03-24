export function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-heading">
      <div className="section-heading">
        <h2 id="about-heading">About</h2>
        <p className="section-subtitle">
          General bio—separate from Projects and Volunteer. Edit this copy when
          you are ready to personalize the site.
        </p>
      </div>
      <div className="about-panel">
        <p>
          I care about interfaces that stay fast under real data, teams that share
          a single source of truth for UI, and documentation that actually gets
          read.
        </p>
        <p>
          When you wire up a CMS or GitHub-backed data source later, you can keep
          this section static or drive it from the same content layer as your
          projects.
        </p>
      </div>
    </section>
  )
}

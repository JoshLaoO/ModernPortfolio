export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__inner">
        <p className="site-footer__label">Contact</p>
        <a className="site-footer__email" href="mailto:hello@example.com">
          hello@example.com
        </a>
        <ul className="site-footer__social" aria-label="Social links">
          <li>
            <a href="#" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
        <p className="site-footer__note">
          Front-end prototype — no backend yet. Update links when you are ready.
        </p>
      </div>
    </footer>
  )
}

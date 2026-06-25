export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__inner">
        <p className="site-footer__label">Contact</p>
        <a className="site-footer__email" href="mailto:jgarlao@gmail.com">
          jgarlao@gmail.com
        </a>
        <ul className="site-footer__social" aria-label="Social links">
          <li>
            <a href="https://github.com/JoshLaoO" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/josh-lao/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

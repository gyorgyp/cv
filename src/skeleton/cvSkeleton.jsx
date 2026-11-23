// Shown only while there is no CV data yet. Reuses the real layout classes
// so the page does not jump when the content arrives.
export function CvSkeleton({ dark }) {
  return (
    <div id="top" className={`cv-root ${dark ? "theme-dark" : "theme-light"}`}>
      <div className="cv-shell" role="status" aria-live="polite" aria-busy="true">
        <span className="cv-sr-only">Loading CV…</span>
        <header className="cv-header">
          <div>
            <div className="cv-skel cv-skel-name" />
            <div className="cv-skel cv-skel-role" />
          </div>
        </header>
        <div className="cv-grid" aria-hidden="true">
          <aside className="cv-sidebar">
            {[0, 1, 2].map((i) => (
              <section key={i}>
                <div className="cv-skel cv-skel-title" />
                <div className="cv-skel cv-skel-line" />
                <div className="cv-skel cv-skel-line short" />
              </section>
            ))}
          </aside>
          <main className="cv-main">
            <div className="cv-skel cv-skel-title" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="cv-skel cv-skel-block" />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

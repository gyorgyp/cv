import React, { useState, useEffect, useRef } from "react";
import { cvData } from "./assets/cvData";
import "./cv.css";

const THEME_KEY = "pg-cv-theme";
const BOLD_PHRASES = ["eliminating","on-site client visits"," user experience (UX)","ensuring smooth","immediate troubleshooting","dramatically faster","80%","100% clarity","zero ambiguity","client really liked"];
const BOLD_PHRASES_PATTERN = new RegExp(
  `(${BOLD_PHRASES.slice()
    .sort((first, second) => second.length - first.length)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "g"
);

function renderWithBoldPhrases(text) {
  return text.split(BOLD_PHRASES_PATTERN).map((part, partIndex) =>
    BOLD_PHRASES.includes(part) ? <strong key={partIndex}>{part}</strong> : part
  );
}

function getInitialTheme() {
  if (typeof window === "undefined") return false;
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "dark") return true;
    if (saved === "light") return false;
  } catch (e) {}
  // No explicit choice saved yet: fall back to system preference.
  return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

export default function CV() {
  const [dark, setDark] = useState(getInitialTheme);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const footerRef = useRef(null);
  const entryRefs = useRef([]);
  const closingIndexRef = useRef(null);
  const pendingScrollIndexRef = useRef(null);
  const scrollAnimationFrameRef = useRef(null);
  // Accordion: only one experience entry open at a time; first one open by default.
  const [openIndex, setOpenIndex] = useState(-1);

  function scrollToY(targetY) {
    if (scrollAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimationFrameRef.current);
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function animateScroll(timestamp) {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 300, 1);
      const easedProgress =
        progress < 0.5
          ? 4 * progress ** 3
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        scrollAnimationFrameRef.current = window.requestAnimationFrame(animateScroll);
      } else {
        scrollAnimationFrameRef.current = null;
      }
    }

    scrollAnimationFrameRef.current = window.requestAnimationFrame(animateScroll);
  }

  // Remember the visitor's explicit choice so a reload (F5) keeps the same theme.
  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch (e) {}
  }, [dark]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return undefined;
    if (!("IntersectionObserver" in window)) {
      setShowBackToTop(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setShowBackToTop(entry.isIntersecting);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top" className={`cv-root ${dark ? "theme-dark" : "theme-light"}`}>
      <div className="cv-shell">
        <header className="cv-header">
          <div>
            <div className="cv-name-row">
            <h1 className="cv-name">{cvData.name}</h1>
            <ul className="theme-toggle-list">
              <li
                className="theme-toggle"
                role="button"
                tabIndex={0}
                onClick={() => setDark((d) => !d)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDark((d) => !d);
                  }
                }}
                aria-pressed={dark}
                aria-label="Toggle light and dark mode"
              />
            </ul>
            </div>
            <p className="cv-role">{cvData.title}</p>            
          </div>
          <div>
            <ul className="cv-contact-list">
              <li>
                <a href={cvData.contact.linkedinUrl} target="_blank" rel="noreferrer">
                  <svg className="cv-contact-icon cv-contact-icon-linkedin" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.78C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.78 24h20.44c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                  </svg>
                  {cvData.contact.linkedin}
                </a>
              </li>
              <li>
                <a href={cvData.contact.githubUrl} target="_blank" rel="noreferrer">
                  <svg className="cv-contact-icon cv-contact-icon-github" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.75 2.34 3.13 1.65.1-.72.4-1.2.7-1.48-2.47-.28-5.06-1.24-5.06-5.5 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.13-1.45 3.07-1.15 3.07-1.15.62 1.54.23 2.68.12 2.96.72.78 1.15 1.78 1.15 3 0 4.27-2.6 5.21-5.08 5.49.4.35.76 1.02.76 2.05v3.04c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
                  </svg>
                  {cvData.contact.github}
                </a>
              </li>
              <li>
                <a href={`mailto:${cvData.contact.email}`}>
                  <svg className="cv-contact-icon cv-contact-icon-gmail" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M3.5 6.5 12 13l8.5-6.5M4 6v12m16-12v12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    <path d="M4 18V7.2m16-.1V18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                    <path d="M4 18h3m10 0h3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                  </svg>
                  {cvData.contact.emailDisplay}
                </a>
              </li>
            </ul>
          </div>           
        </header>

        <div className="cv-grid">
          <aside className="cv-sidebar">

            <section id="profile">
              <h2 className="cv-section-label">Profile</h2>
              <p className="cv-profile-text">{cvData.profile}</p>            
            </section>

            <section id="skills">
              <h2 className="cv-section-label">Core skills</h2>
              <ul className="cv-tag-list">
                {cvData.coreSkills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </section>

             <section id="ai">
              <h2 className="cv-section-label">AI</h2>
              <ul className="cv-tag-list">
                {cvData.ai.map((ai) => (
                  <li key={ai}>{ai}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="cv-section-label">Currently learning</h2>
              <div className="cv-pill-row">
                {cvData.currentlyLearning.map((item) => (
                  <span className="cv-pill" key={item}>{item}</span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="cv-section-label">Languages</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {cvData.languages.map((lang) => (
                  <div className="cv-lang-row" key={lang.name}>
                    <span>{lang.name}</span>
                    <span className="lang-level">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <main className="cv-main">

            <section id="experience">
              <h2 className="cv-section-label">Experience</h2>
              <div className="cv-timeline">
                {cvData.experience.map((job, index) => {
                  const isOpen = index === openIndex;
                  return (
                    <div
                      className={`cv-entry${isOpen ? " open" : ""}`}
                      key={job.company + job.period}
                      ref={(element) => {
                        entryRefs.current[index] = element;
                      }}
                    >
                      <button
                        type="button"
                        className="cv-entry-head"
                        onClick={() => {
                          closingIndexRef.current = openIndex === -1 ? null : openIndex;
                          pendingScrollIndexRef.current = isOpen || openIndex === -1 ? null : index;
                          setOpenIndex(isOpen ? -1 : index);
                        }}
                        aria-expanded={isOpen}
                      >
                        <span className="cv-entry-head-main">
                          <h3 className="cv-entry-role">{job.role}</h3>
                        </span>
                        <span className="cv-entry-toggle-icon" aria-hidden="true">+</span>
                      </button>
                      <div className="cv-entry-company">
                        <span>{job.company}</span>
                        <span className="cv-entry-period">{job.period}</span>
                      </div>
                      <div
                        className="cv-entry-collapse"
                        onTransitionEnd={(event) => {
                          if (
                            event.target !== event.currentTarget ||
                            event.propertyName !== "grid-template-rows" ||
                            index !== closingIndexRef.current ||
                            pendingScrollIndexRef.current === null
                          ) {
                            return;
                          }

                          const targetEntry = entryRefs.current[pendingScrollIndexRef.current];
                          closingIndexRef.current = null;
                          pendingScrollIndexRef.current = null;

                          if (!targetEntry) return;
                          const top = targetEntry.getBoundingClientRect().top;
                          if (top < 0) scrollToY(window.scrollY + top);
                        }}
                      >
                        <div className="cv-entry-collapse-inner">
                          <ul className="cv-entry-bullets">
                            {job.bullets.map((bullet, i) => {
                              const text = typeof bullet === "string" ? bullet : bullet.text;
                              const subBullets = typeof bullet === "string" ? [] : bullet.subBullets;

                              return (
                                <li key={i}>
                                  {renderWithBoldPhrases(text)}
                                  {subBullets.length > 0 && (
                                    <ul className="cv-entry-sub-bullets">
                                      {subBullets.map((subBullet, subIndex) => (
                                        <li key={subIndex}>{renderWithBoldPhrases(subBullet)}</li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                          <div className="cv-entry-tech">
                            Tech: <span>{job.tech}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="education">
              <h2 className="cv-section-label">Education</h2>
              {cvData.education.map((edu) => (
                <div className="cv-edu-item" key={edu.school}>
                  <div>
                    <div className="cv-edu-school">{edu.school}</div>
                    <div className="cv-edu-degree">{edu.degree}</div>
                  </div>
                  <div className="cv-edu-period">{edu.period}</div>
                </div>
              ))}
            </section>

            <section id="certifications">
              <h2 className="cv-section-label">Certifications &amp; training</h2>
              <div className="cv-cert-columns">
                <div>
                  {cvData.certifications.map((cert) => (
                    <div className="cv-cert-item" key={cert.name}>
                      <span className="cv-cert-name">{cert.name}</span>
                      <span className="cv-cert-year">{cert.year}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {cvData.training.map((tr) => (
                    <div className="cv-cert-item" key={tr.name}>
                      <span className="cv-cert-name">{tr.name}</span>
                      <span className="cv-cert-year">{tr.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>

        <footer className="cv-footer" ref={footerRef}>
          <span>© {new Date().getFullYear()} {cvData.name}</span>
          <div className="cv-footer-tech">
            <span>Built with</span>
            <ul>
              {["React"].map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
          <ul className="cv-footer-nav">
            {cvData.nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
          <a
            className={`cv-footer-top${showBackToTop ? " is-visible" : ""}`}
            href="#top"
            aria-hidden={!showBackToTop}
            tabIndex={showBackToTop ? 0 : -1}
          >
            ↑ Back to top
          </a>
        </footer>
      </div>
    </div>
  );
}
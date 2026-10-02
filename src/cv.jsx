import React, { useState, useEffect, useRef } from "react";
import { cvData } from "./cvData";
import "./cv.css";

const THEME_KEY = "pg-cv-theme";
const BOLD_PHRASES = ["eliminating","on-site client visits"," user experience (UX)","ensuring smooth","immediate troubleshooting","dramatically faster","80%","100% clarity","zero ambiguity","direct positive feedback"];
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
  // Accordion: only one experience entry open at a time; first one open by default.
  const [openIndex, setOpenIndex] = useState(0);

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
            <ul className="cv-contact-list">              
              <li><a href={cvData.contact.linkedinUrl} target="_blank" rel="noreferrer">{cvData.contact.linkedin}</a></li>
              <li><a href={cvData.contact.githubUrl} target="_blank" rel="noreferrer">{cvData.contact.github}</a></li>
              <li><a href={`mailto:${cvData.contact.email}`}>{cvData.contact.email}</a></li>
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
                    <div className={`cv-entry${isOpen ? " open" : ""}`} key={job.company + job.period}>
                      <button
                        type="button"
                        className="cv-entry-head"
                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
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
                      <div className="cv-entry-collapse">
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
              {["React", "JavaScript", "CSS", "Vite", "ESLint"].map((technology) => (
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
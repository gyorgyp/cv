import React, { useState, useEffect } from "react";
import { cvData } from "./cvData";
import "./cv.css";

const THEME_KEY = "pg-cv-theme";

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
  // Accordion: only one experience entry open at a time; first one open by default.
  const [openIndex, setOpenIndex] = useState(0);

  // Remember the visitor's explicit choice so a reload (F5) keeps the same theme.
  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch (e) {}
  }, [dark]);

  return (
    <div className={`cv-root ${dark ? "theme-dark" : "theme-light"}`}>
      <div className="cv-shell">
        <header className="cv-header">
          <div>
            <h1 className="cv-name">{cvData.name}</h1>
            <p className="cv-role">{cvData.title}</p>
            <ul className="cv-contact-list">
              <li><a href={cvData.contact.phoneHref}>{cvData.contact.phone}</a></li>
              <li><a href={`mailto:${cvData.contact.email}`}>{cvData.contact.email}</a></li>
              <li><a href={cvData.contact.linkedinUrl} target="_blank" rel="noreferrer">{cvData.contact.linkedin}</a></li>
            </ul>
          </div>
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
        </header>

        <div className="cv-grid">
          <aside className="cv-sidebar">
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
            <section id="profile">
              <h2 className="cv-section-label">Profile</h2>
              <p className="cv-profile-text">{cvData.profile}</p>
              <p className="cv-additional">{cvData.additionalStrengths}</p>
            </section>

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
                          <span className="cv-entry-period">{job.period}</span>
                        </span>
                        <span className="cv-entry-toggle-icon" aria-hidden="true">+</span>
                      </button>
                      <div className="cv-entry-company">{job.company}</div>
                      <div className="cv-entry-collapse">
                        <div className="cv-entry-collapse-inner">
                          <ul className="cv-entry-bullets">
                            {job.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
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

        <footer className="cv-footer">
          <span>© {new Date().getFullYear()} {cvData.name}</span>
          <ul className="cv-footer-nav">
            {cvData.nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  );
}

// Loads the CV document from the API and shows it with a stale-while-revalidate cache:
//   - first visit        : status "loading" until the API answers (no bundled fallback any more)
//   - repeat visits      : the last API response from localStorage is shown immediately ("refreshing"),
//                          then re-checked in the background; the UI only changes if the content did
//   - API down/slow      : cached content stays on screen; with no cache, status becomes "error"
import { useCallback, useEffect, useRef, useState } from "react";

const CACHE_KEY = "pg-cv-data:v1"; // bump the version to invalidate every visitor's cache
const TIMEOUT_MS = 10_000;

// kind: "timeout" | "network" | "http" | "invalid"; code is a short, safe-to-display label.
class CvLoadError extends Error {
  constructor(kind, code) {
    super(code);
    this.kind = kind;
    this.code = code;
  }
}

function describeError(err) {
  if (err instanceof CvLoadError) return { kind: err.kind, code: err.code };
  if (err?.name === "AbortError") return { kind: "timeout", code: "timeout" }; // our own request timeout
  return { kind: "network", code: "network" }; // fetch rejected: offline, DNS, blocked, CORS...
}

const arr = (v) => (Array.isArray(v) ? v : []);
const stripProtocol = (u = "") => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

// Guards the UI against partial documents and fills display strings the document may not carry.
export function normalizeCv(doc) {
  const c = doc.contact ?? {};
  return {
    ...doc,
    contact: {
      ...c,
      linkedin: c.linkedin ?? stripProtocol(c.linkedinUrl),
      github: c.github ?? stripProtocol(c.githubUrl),
      emailDisplay: c.emailDisplay ?? c.email ?? "",
    },
    nav: arr(doc.nav),
    coreSkills: arr(doc.coreSkills),
    ai: arr(doc.ai),
    currentlyLearning: arr(doc.currentlyLearning),
    languages: arr(doc.languages),
    experience: arr(doc.experience),
    education: arr(doc.education),
    certifications: arr(doc.certifications),
    training: arr(doc.training),
  };
}

function parseCv(raw) {
  try {
    const doc = JSON.parse(raw);
    return doc && typeof doc === "object" && typeof doc.name === "string" && doc.name ? normalizeCv(doc) : null;
  } catch {
    return null;
  }
}

// localStorage can be missing, full or blocked (private mode): never let it break the page.
const readCache = () => {
  try {
    return localStorage.getItem(CACHE_KEY);
  } catch {
    return null;
  }
};
const writeCache = (raw) => {
  try {
    localStorage.setItem(CACHE_KEY, raw);
  } catch {
    /* ignore */
  }
};

function initialState() {
  const raw = readCache();
  const data = raw ? parseCv(raw) : null;
  return data
    ? { data, status: "refreshing", error: null, raw }
    : { data: null, status: "loading", error: null, raw: null };
}

// status: "loading" (nothing to show yet) | "refreshing" (cached content shown) | "ready" | "error" (nothing to show)
// error:  null, or { kind, code } when status is "error"
export function useCv(url) {
  const [state, setState] = useState(initialState);
  const [attempt, setAttempt] = useState(0);
  const rawRef = useRef(state.raw); // response text currently on screen

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    setState((s) => (s.data ? s : { ...s, status: "loading", error: null })); // a retry shows the skeleton again

    (async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new CvLoadError("http", `HTTP ${res.status}`);
        const raw = await res.text();
        const data = parseCv(raw);
        if (!data) throw new CvLoadError("invalid", "invalid data");
        if (cancelled) return;

        if (raw === rawRef.current) {
          setState((s) => ({ ...s, status: "ready", error: null })); // cache was current: nothing re-renders visually
        } else {
          rawRef.current = raw;
          writeCache(raw);
          setState({ data, status: "ready", error: null, raw });
        }
      } catch (err) {
        if (cancelled) return;
        console.warn("Could not load the latest CV:", err);
        setState((s) => (s.data ? { ...s, status: "ready" } : { ...s, status: "error", error: describeError(err) }));
      } finally {
        clearTimeout(timer);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { data: state.data, status: state.status, error: state.error, retry };
}

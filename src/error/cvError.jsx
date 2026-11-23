// Visitor-friendly wording per error kind. Technical details are logged by useCvData.
const MESSAGES = {
  timeout: "The server took too long to respond. Please try again.",
  network: "Could not connect. Check your internet connection and try again.",
  http: "The service is temporarily unavailable. Please try again in a few minutes.",
  invalid: "The CV data could not be read. Please try again later.",
};

export function CvError({ dark, error, onRetry }) {
  return (
    <div id="top" className={`cv-root ${dark ? "theme-dark" : "theme-light"}`}>
      <div className="cv-shell" role="alert" aria-live="polite">
        <div className="cv-load-error">
          <p>{MESSAGES[error?.kind] ?? "The CV could not be loaded right now."}</p>
          <button type="button" onClick={onRetry}>Try again</button>
          {error?.code && <p className="cv-load-error-code">Error code: {error.code}</p>}
        </div>
      </div>
    </div>
  );
}

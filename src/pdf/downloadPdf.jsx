// "Download PDF" button. The PDF is generated in the browser, on click, from the CV data that is
// already on the page, so it always matches what the visitor sees. @react-pdf/renderer is loaded
// only when the visitor clicks the download button.
import { createElement, useCallback, useRef, useState } from "react";

// import() is cached by the module system, so calling this repeatedly is cheap.
const loadPdfModules = () => Promise.all([import("@react-pdf/renderer"), import("./cvPdf")]);

export function DownloadPdf({ data, className, icon = null, label = "Download as PDF" }) {
  const [status, setStatus] = useState("idle"); // "idle" | "generating" | "error"
  const busy = useRef(false);

  const handleClick = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setStatus("generating");
    try {
      const [{ pdf }, { CvPdf }] = await loadPdfModules();
      const blob = await pdf(createElement(CvPdf, { data })).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CV_Peter_GYORGY.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setStatus("idle");
    } catch (err) {
      console.error("PDF generation failed:", err);
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }, [data]);

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={status === "generating"}
      aria-busy={status === "generating"}
    >
      {icon}
      {status === "generating" ? "Generating…" : status === "error" ? "Failed – try again" : label}
    </button>
  );
}

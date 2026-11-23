# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-11-23

### Added
- The PDF is now generated in the browser on click (react-pdf), always from the data currently shown on the page. The library is loaded lazily and prefetched on hover, focus or touch.
- Stale-while-revalidate cache: the last API response is stored in `localStorage`, shown instantly on repeat visits and refreshed in the background. The page only re-renders if the content actually changed.
- Loading skeleton (`CvSkeleton`), shown while the CV is loading and there is nothing to display yet.
- Error screen (`CvError`) with a visitor-friendly message per failure type (timeout, network, service unavailable, invalid data), a retry button and a short error code for troubleshooting.
- `uiConfig.js` for UI defaults (navigation, labels) that are not CV content.

### Changed
- The CV is rendered exclusively from the API response; the page no longer starts from bundled data.
- The PDF has a new layout, designed for the in-browser generator.
- The data hook (`useCvData`) now reports the kind of failure, so the error screen can show a matching message.
- The loading and error screens are separate components, each with a single responsibility, and use proper accessibility roles (`status` / `alert`).

### Removed
- The bundled `cvData.js` fallback and the seed script. Azure Cosmos DB is now the single source of truth.
- The pre-built static PDF and the Puppeteer build step. Direct links to the old static PDF file no longer work.

## [2.0.0] - 2026-11-20

### Added
- Azure Cosmos DB (NoSQL, serverless) as the storage for the CV content.
- Read-only REST API (`/api/cv`) on Azure Functions, with CORS support so that the GitHub Pages deployment can use it.
- AI-assisted content pipeline: the CV is maintained in Google Docs, and an Apps Script (Gemini API) converts it to a schema-conforming JSON and writes it to Cosmos DB.

### Changed
- The CV content is fetched from the API at runtime instead of being compiled into the app. The bundled data remained only as a fallback.

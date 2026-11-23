# Péter GYÖRGY — Online CV

A responsive, single-page CV built with React and Vite. It presents professional experience, skills, education, certifications, training, and contact details.

## Features

- Responsive layout with light and dark themes; the selected theme is saved in browser storage, with the system theme used on first visit.
- Expandable experience entries.
- Sections for profile, skills, AI, current learning, languages, education, and certifications and training.
- CV data loaded from the `/api/cv` endpoint (Azure Functions + Cosmos DB), with the last successful response cached in browser storage.
- Contact links and an on-demand PDF generated in the browser from the CV data currently displayed.
- Static production output served by Nginx, with optional Docker deployment.

## Tech stack

- React 19
- Vite 8
- JavaScript and CSS
- Azure Functions v4 (Node.js) and Azure Cosmos DB
- Nginx and Docker (optional)

## Run locally

Requirements: Node.js 20.19+ or 22.12+, and npm.

```bash
git clone https://github.com/gyorgyp/cv.git
cd cv
npm ci
npm run dev
```

Open the local URL printed by Vite (by default, <http://localhost:5173>). The frontend requests `/api/cv`; during development, Vite proxies this to the local Functions host at `http://localhost:7071`.

The API is needed to load CV data on a first visit. If the API is unavailable, a previously cached response remains visible; without cached data, the page shows an error with a retry option.

### Run the API locally (optional)

To load live data from Cosmos DB, run the Azure Functions app in `api/`.

Requirements: [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local) and Node.js 20 or 22.

1. Create `api/local.settings.json` (it is git-ignored, never commit it):

   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "AzureWebJobsStorage": "",
       "COSMOS_ENDPOINT": "https://<account>.documents.azure.com:443/",
       "COSMOS_KEY": "<cosmos-key>",
       "COSMOS_DB_ID": "cv",
       "COSMOS_CONTAINER_ID": "cvContainer"
     }
   }
   ```

2. Install dependencies and start the Functions host:

   ```bash
   cd api
   npm install
   func start
   ```

   The endpoint is available at <http://localhost:7071/api/cv>.

3. In another terminal, run `npm run dev` from the repository root. The Vite dev server proxies `/api` to `http://localhost:7071` (see `vite.config.js`).

### API URL

The frontend calls the URL in `VITE_CV_API_URL`, or `/api/cv` when it is not set. This value is embedded at build time.

- The GitHub Pages workflow points `VITE_CV_API_URL` to the Azure Static Web App API. The API must allow the GitHub Pages origin through CORS.
- The Azure Static Web Apps workflow deploys the API from `api/`; configure its `COSMOS_*` application settings.
- The Docker image serves only the static frontend. Configure a reachable API URL at build time, or route `/api` to an API separately.

If the API is unavailable, the app uses the last successful response cached in that browser, if one exists. There is no bundled CV-data fallback.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create the production site in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

The build does not generate or include a static PDF. When a visitor clicks the download button, the browser loads the PDF renderer and generates a PDF from the CV data currently displayed on the page.

## Deploy

### GitHub Pages

The GitHub Actions workflow in `.github/workflows/github.yml` builds and deploys the site to GitHub Pages when changes are pushed to `main`; it also supports scheduled and manual runs. Vite uses `/cv/` as the base path in that workflow.

### Azure Static Web Apps

`.github/workflows/azure-static-web-apps-zealous-bay-03ae5da0f.yml` deploys the frontend and the API in `api/` to Azure Static Web Apps on pushes and pull requests to `main`. Configure the `COSMOS_*` application settings on the Static Web App for the API to read CV data.

### Docker

Build and run the production site with Docker Compose:

```bash
docker compose up --build -d
```

Open <http://localhost:8080>. Stop the container with:

```bash
docker compose down
```

To run it without Compose:

```bash
docker build -t cv .
docker run --rm -p 8080:80 cv
```

The Docker image serves only the static site; it does not include the API.

## Customize the CV

- The CV content is maintained in Google Docs and synchronized to Cosmos DB; the Google Apps Script pipeline is not in this repository.
- Update the page markup and interactions in `src/cv.jsx`.
- Change the PDF layout in `src/pdf/cvPdf.jsx`.
- Update default UI labels and navigation in `src/config/uiConfig.js`.
- Change styles and responsive behavior in `src/cv.css`; loading and error state styles are in their respective folders.
- Update the page title or favicon in `index.html`; static icons are in `public/`.

## Project structure

```text
.
├── .github/workflows/   # GitHub Pages and Azure Static Web Apps workflows
├── api/                 # Azure Functions app (GET /api/cv from Cosmos DB)
│   ├── src/functions/
│   │   └── getCv.js      # HTTP trigger for the CV endpoint
│   ├── host.json
│   └── package.json
├── public/              # Static icons
├── src/
│   ├── assets/           # Images and static assets
│   ├── config/
│   │   └── uiConfig.js   # Default UI labels and navigation
│   ├── error/            # CV loading error component and styles
│   ├── hooks/
│   │   └── useCvData.js  # API loading, validation, and browser cache
│   ├── pdf/              # On-demand PDF download and document layout
│   ├── skeleton/         # Loading skeleton component and styles
│   ├── cv.css            # Layout, themes, and responsive styles
│   ├── cv.jsx            # CV page and interactions
│   └── main.jsx          # React entry point
├── Dockerfile            # Multi-stage build and Nginx runtime
├── compose.yaml          # Local Docker Compose configuration
├── nginx.conf            # Static hosting and SPA fallback
├── index.html
├── package.json
└── vite.config.js
```

## Architecture

The CV content is maintained in Google Docs and flows to the site through an AI processing pipeline. The Google Apps Script code and its JSON schema (`cv.schema.json`) are not part of this repository.

1. **Content management (Google Docs, Apps Script, Gemini API)**
   - A custom 🚀 CV Sync menu in the Google Docs document starts the synchronization.
   - The script sends the document text to the Gemini REST API with an `application/json` response format and `temperature: 0`, so the output is predictable.
   - The response is validated against a Draft 2020-12 JSON schema (`cv.schema.json`), converted to a Gemini-compatible format; post-processing restores the bullets array so the result matches the schema exactly.
   - If a model is overloaded (503) or rate-limited (429), the script falls back to the next model (`gemini-3.5-flash-lite`,`gemini-3-flash-preview`, `gemini-2.5-flash`, `gemini-2.5-flash-lite`).
   - Based on my experience so far, currently only `gemini-3.5-flash-lite` is being used.

   - API keys are stored in Apps Script Script Properties, not in the code.

2. **Storage (Azure Cosmos DB)**
   - The validated CV is stored as JSON under the `data` property of the document with id `cv` and partition key `cv`.
   - Apps Script upserts the document directly through the Cosmos DB REST API with HMAC-SHA256 authentication, without a separate server.

3. **API (Azure Functions v4)**
   - `api/src/functions/getCv.js` exposes an anonymous `GET /api/cv` HTTP trigger (Node.js, CommonJS).
   - The `CosmosClient` is created outside the handler so connections are reused.
   - The endpoint returns the `data` property; for older documents without it, it returns the document without Cosmos DB system fields (`_rid`, `_self`, `_etag`, `_attachments`, `_ts`).
   - Cosmos DB keys stay on the server (`local.settings.json` locally, application settings in Azure).
   - Responses are currently sent with `Cache-Control: no-cache`; a 5-minute `max-age` is prepared in the code for production.

4. **Frontend (React, Vite)**
   - `src/hooks/useCvData.js` fetches `/api/cv`, validates and normalizes the response, and caches the raw response in `localStorage`.
   - On repeat visits, cached CV data is displayed immediately while the API is checked again. With no cached data, the app shows a skeleton while loading and an error with a retry option if loading fails.
   - The API uses `Cache-Control: no-cache`; browser storage provides the immediate repeat-visit cache.
   - During development, Vite proxies `/api` to the local Functions host at `localhost:7071`.
   - The PDF is generated in the browser from the displayed CV data only after the download button is clicked; the PDF renderer is dynamically loaded at that point.
   
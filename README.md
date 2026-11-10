# Péter GYÖRGY — Online CV

A responsive, single-page CV built with React and Vite. It presents professional experience, skills, education, certifications, training, and contact details.

## Features

- Responsive layout with light and dark themes; the selected theme is saved in browser storage, with the system theme used on first visit.
- Expandable experience entries.
- Sections for profile, skills, AI, current learning, languages, education, and certifications and training.
- Contact links and a downloadable PDF on the deployed site.
- Static production output served by Nginx, with optional Docker deployment.

## Tech stack

- React 19
- Vite 8
- JavaScript and CSS
- Nginx and Docker (optional)

## Run locally

Requirements: Node.js 20.19+ or 22.12+, and npm.

```bash
git clone https://github.com/gyorgyp/cv.git
cd cv
npm ci
npm run dev
```

Open the local URL printed by Vite (by default, <http://localhost:5173>).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create the production site in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

The regular Vite build does not generate the PDF. The GitHub Pages workflow generates `CV_Peter_GYORGY.pdf` and includes it in the deployed site.

## Deploy

The GitHub Actions workflow in `.github/workflows/github.yml` builds and deploys the site to GitHub Pages when changes are pushed to `main`; it also supports scheduled and manual runs. Vite uses `/cv/` as the base path in that workflow.

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

## Customize the CV

- Edit the CV content in `src/assets/cvData.js`.
- Update markup and interactions in `src/cv.jsx`.
- Change styles and responsive behavior in `src/cv.css`.
- Update the page title or favicon in `index.html`; static icons are in `public/`.

## Project structure

```text
.
├── .github/workflows/   # GitHub Pages and Azure Static Web Apps workflows
├── public/              # Static icons
├── src/
│   ├── assets/           # CV data and images
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

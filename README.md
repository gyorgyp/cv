# György P. | CV 📄

A modern, responsive online curriculum vitae built as a static web application with React and Vite. This project presents professional experience, skills, education, and contact information in a clean, accessible, and print-friendly format.

## Overview

This portfolio-style CV is designed to be:

- Professional and easy to read
- Fully responsive across devices
- Fast to load and simple to maintain
- Suitable for static hosting and easy deployment
- Print-friendly for PDF export

## Technology Stack

- React
- Vite
- JavaScript
- CSS
- HTML

## Features

- Responsive single-page layout
- Clean, modern visual design
- Structured sections for experience, education, and skills
- Mobile-friendly interface
- Optimized for fast static hosting
- Easy customization for personal branding

## Project Structure

```bash
cv/
├── public/
│   └── ...
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   └── styles/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
└── ...
```

## Prerequisites

Before running the project, make sure you have installed:

- Node.js 18+
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/gyorgyp/cv.git
cd cv
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the application in your browser:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

- `npm run dev` — starts the Vite development server
- `npm run build` — creates a production build
- `npm run preview` — previews the production build locally
- `npm run lint` — checks the code with ESLint

## Deployment

This project is a static web app and can be deployed to any static hosting platform, including:

- GitHub Pages
- Netlify
- Vercel
- Azure Static Web Apps
- AWS S3 + CloudFront

To build for production:

```bash
npm run build
```

The generated files will be available in the `dist/` folder.

## Customization

To adapt the CV for your own profile:

1. Update the personal information in the main component
2. Edit experience, education, and skills sections
3. Adjust color palette, typography, and layout styles
4. Replace placeholder text and links with your own details

## Browser Support

The project is compatible with modern browsers, including:

- Chrome
- Firefox
- Edge
- Safari

## Author

György P.

- GitHub: https://github.com/gyorgyp

## License

This project is open source and available under the MIT License.

---

Built with React + Vite for a fast, modern, and professional online CV experience.

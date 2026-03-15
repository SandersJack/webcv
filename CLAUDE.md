# WebCV — Personal Portfolio

Personal portfolio website for Jack Sanders (PhD Researcher, CERN NA62 Experiment).

## Stack

- **Frontend:** Vanilla HTML/CSS/JS — no frameworks
- **Backend:** Node.js + Express (contact form only)
- **Serving:** Nginx (Alpine)
- **Infrastructure:** Docker + Docker Compose, GitHub Actions

## Project Structure

```
templates/          # HTML pages (index, projects, contact)
static/
  css/              # Per-page stylesheets
  js/               # projects.js (modals + data), index.js (read-more toggle)
  imgs/             # Project images and logos
  icons/            # SVG icons
contact-form/       # Express server for contact form emails (port 3333)
nginx.conf          # Routes /static/ and serves HTML with .html extension fallback
```

## Running Locally

```bash
docker-compose up -d --build
# Site: http://localhost:8080
# Contact API: http://localhost:3333
```

The contact form requires `contact-form/config.js` (gitignored) with Gmail SMTP credentials:
```js
module.exports = { user: '...', pass: '...' }
```

## Key Details

- **Contact form:** POST `/send_email` — rate-limited to 5 req/15 min, CORS restricted to `portfolio.jack-sanders.uk` and `portfolio.local.jack-sanders.uk`
- **Releases:** Manual GitHub Actions workflow with patch/minor/major versioning
- **CI:** Builds Docker Compose stack and asserts HTTP 200 on `localhost:8080`
- **No README** — this file is the primary dev reference

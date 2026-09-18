# Migration plan: vanilla WebCV to react-web

**Status:** Proposed. Implements the deployment decision in plan §0 and action 1 in plan §16 of `docs/PRODUCTION_IMPLEMENTATION_PLAN.md`.
**Audience:** Jack Sanders and implementation contributors.
**Scope:** Replacing the vanilla site at `portfolio.jack-sanders.uk` with the React build from `react-web/`, reusing the existing contact service unchanged.

## 1. Current state

The production site is the vanilla HTML/CSS/JS app at the repository root.

- `docker-compose.yml` runs two services. `web` builds from `dockerfile` (`nginx:alpine`), mounts `templates/`, `static/`, and `nginx.conf` into the container, and publishes host port 8080. `contact` builds from `dockerfile_node` (`node:20-slim`) and publishes port 3333.
- `nginx.conf` serves from `/usr/share/nginx/html` with extensionless URLs: `try_files $uri $uri/ @htmlext` rewrites to `$uri.html`. `/static/` is aliased with `autoindex on`.
- `contact-form/server.js` is an Express app on port 3333. It accepts `POST /send_email`, applies `express-rate-limit` (5 requests per 15 minutes), sets `trust proxy` to 1, and allows CORS from `https://portfolio.jack-sanders.uk` and `https://portfolio.local.jack-sanders.uk` only. Mail is sent through Gmail SMTP with the password from the gitignored `contact-form/config.js`.
- The live contact page (`templates/contact.html`) posts cross-origin from the browser to `https://contact.jack-sanders.uk/send_email`.
- CI (`.github/workflows/test_build.yml`) builds `docker-compose-CI.yml` (web service only, via `dockerfile-CI`), waits 10 seconds, and asserts HTTP 200 on `http://localhost:8080`.
- Releases are manual tags via `.github/workflows/create_workflow.yml` (patch/minor/major).

The host reverse proxy that terminates TLS for `portfolio.jack-sanders.uk` and `contact.jack-sanders.uk` is not defined in this repository. Its setup is unknown and must be confirmed with Jack before cutover.

The React app (`react-web/`) currently has no Dockerfile and no nginx.conf. Its dev server already proxies `/send_email` to `http://localhost:3333` (`react-web/vite.config.ts`), and the production client (`src/lib/contactApi.ts`) posts to the same-origin path `/send_email`, so the production nginx must route that path to the contact service.

## 2. Target state

A new multi-stage Dockerfile in `react-web/` builds the app and serves the static output with nginx. A new `react-web/nginx.conf` replaces the vanilla config.

### New `react-web/dockerfile`

```dockerfile
# Build stage
FROM node:20-slim AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
```

Notes:

- `node:20-slim` matches the base image already used for the contact service (`dockerfile_node`) and ships yarn classic, so no extra install step is needed.
- `dist/` is generated output and must not be treated as source (plan §2). Only the build stage produces it; the serve stage copies it fresh.

### New `react-web/nginx.conf`

```nginx
events {}
http {
    include mime.types;

    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;

        # Contact API: same-origin proxy to the Express service.
        # `contact` is the compose service name; the browser never leaves the origin.
        location /send_email {
            proxy_pass http://contact:3333;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Vite emits content-hashed filenames under /assets/; safe to cache long.
        location /assets/ {
            try_files $uri =404;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # SPA fallback: client-side routes (plan §3) resolve to index.html.
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Never cache the entry document.
        location = /index.html {
            add_header Cache-Control "no-cache";
        }
    }
}
```

Why each block exists:

- SPA fallback (`try_files $uri $uri/ /index.html`) is required because the app uses client-side routes (`react-router-dom` is in `react-web/package.json`; plan §2 makes the fallback conditional on this, and the condition is met). The vanilla extensionless rewrite (`@htmlext`) is dropped; it has no meaning for the React app.
- `/assets/` gets a long cache because Vite hashes filenames, so a new deploy never collides with a cached file. `index.html` gets `no-cache` so deploys take effect immediately.
- `/send_email` is proxied same-origin so the browser posts to its own origin. `X-Forwarded-For` must be set because the Express app trusts one proxy hop (`app.set('trust proxy', 1)`) and keys its rate limit on the client IP; without the header every visitor would share the nginx container's address and the 5-per-15-minute limit would be global.
- nginx resolves the upstream name `contact` at startup. The compose file must order startup with `depends_on` (below) or nginx will fail to start when the contact container is absent.

## 3. Contact service

The Express service (`contact-form/server.js`) is reused unchanged, per plan §0 and §12:

- Validation, the 5-requests-per-15-minutes rate limit, and the Gmail SMTP transport stay as they are.
- The CORS allowlist (`https://portfolio.jack-sanders.uk`, `https://portfolio.local.jack-sanders.uk`) does not need to change for the React app. Same-origin proxying means the browser never makes a cross-origin request, so CORS is not involved. The production domain is already on the list, which also satisfies plan §12.
- The legacy cross-origin endpoint `https://contact.jack-sanders.uk/send_email`, used by the vanilla `templates/contact.html`, must stay live until the vanilla site is retired. Do not repoint that DNS name during cutover.

## 4. Compose and CI updates

### `docker-compose.yml`

Build the React image instead of mounting vanilla files into a stock nginx container. The contact service definition is unchanged.

```yaml
version: '3'

services:
  web:
    build:
      context: ./react-web
      dockerfile: dockerfile
    depends_on:
      - contact
    ports:
      - "8080:80"

  contact:
    build:
      context: .
      dockerfile: dockerfile_node
    ports:
      - "3333:3333"
```

### CI (`.github/workflows/test_build.yml`)

Keep the existing shape (build the compose stack, wait, assert, tear down) and extend the assertions:

1. Assert HTTP 200 on `/` (as today).
2. Assert HTTP 200 on a client route, for example `/physics`. This proves the SPA fallback works through nginx, not only through the Vite dev server (plan §13 end-to-end tests and plan §15 require the production build to be tested through the real nginx path).
3. Keep a contact service liveness check. Any HTTP response from the service proves it is listening; a GET on the POST-only `/send_email` route returns 404, which is still a pass for liveness.

```yaml
- name: Test React site
  run: |
    for path in / /physics; do
      status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080$path")
      echo "$path -> $status_code"
      if [ "$status_code" -ne 200 ]; then
        echo "Route $path failed."
        exit 1
      fi
    done

- name: Test contact service
  run: |
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3333/send_email")
    echo "/send_email -> $status_code"
    if [ "$status_code" -eq 000 ]; then
      echo "Contact service is not responding."
      exit 1
    fi
```

The CI compose file (`docker-compose-CI.yml`) needs the same web build change as `docker-compose.yml`, plus the contact service if the liveness check runs in CI.

## 5. Cutover and rollback

Prerequisite: confirm how the host reverse proxy routes `portfolio.jack-sanders.uk`. That configuration lives outside this repository and is currently unknown.

1. **Run alongside.** Build and start the new web container next to the vanilla one on a different host port (for example 8081), sharing the existing contact service. The vanilla site keeps serving production traffic.
2. **Verify.** On the new container: every route in plan §3 returns 200 and renders the correct heading; the contact form submits end-to-end through `/send_email` (confirm delivery, the rate-limit response, and that the client IP is rate-limited rather than the nginx container); hashed assets arrive with long-cache headers and `index.html` with `no-cache`; TLS works through the existing reverse proxy, on a staging hostname if one is available.
3. **Switch.** Point the host reverse proxy for `portfolio.jack-sanders.uk` at the new container.
4. **Rollback.** Point the reverse proxy back at the still-running vanilla container. Until the new site is verified in production, do not stop the vanilla container and do not delete `templates/`, `static/`, or the root `nginx.conf`.
5. **Retire.** Only after production verification (plan §0): remove the vanilla web service from compose, delete `templates/` and `static/`, and retire the legacy `contact.jack-sanders.uk` endpoint once nothing references it.

## 6. Decisions recorded

- **Package manager is yarn.** `react-web/yarn.lock` is a v1 lockfile and is the committed lockfile policy (plan §2). Docker and CI install with `yarn install --frozen-lockfile`.
- **`npm run …` in the plan means yarn.** Plan §15 lists `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`. Those are the `react-web/package.json` scripts; run them as `yarn lint`, `yarn typecheck`, `yarn test`, `yarn build`.
- **No CORS change for the React app.** Same-origin proxying of `/send_email` keeps the browser on one origin. The existing allowlist already covers the production domain for any remaining cross-origin callers.
- **The legacy contact endpoint stays until the vanilla site retires.** `templates/contact.html` fetches `https://contact.jack-sanders.uk/send_email` directly; that URL must keep working while the old site is live.
- **SPA fallback is required, not optional.** Plan §2 conditions the fallback on client-side routing; `react-router-dom` is installed, so the condition is met.

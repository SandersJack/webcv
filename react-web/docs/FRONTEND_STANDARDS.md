# Frontend Standards

These are the engineering standards for the Harbourne home landing page and
future React frontends. They are intentionally small enough to use during code
review and strict enough to prevent avoidable regressions.

## Default Stack

- Use React with TypeScript and Vite for a client-side static application.
- Use the latest stable versions that the project supports, but commit the lockfile.
- Build a production bundle with `vite build` and serve the generated static files
  from NGINX. Do not run the Vite development server in production.
- Use semantic HTML and CSS first. Add a dependency only when it removes real
  complexity or supplies a tested capability we should not maintain ourselves.
- Keep configuration and secrets out of the client bundle. Anything prefixed for
  exposure to a Vite client is public.

Vite describes its production build as an optimized static asset build and
requires modern Node.js versions. Check the current compatibility requirements
before upgrading: <https://vite.dev/guide/>.

## React Design

- Start from the visual hierarchy and data model. Break the page into components
  that each have one clear responsibility.
- Build a static version before adding interactivity.
- Keep data flow one-way: parents own shared state and pass data and event
  handlers down through props.
- Store the minimal state that cannot be derived. Do not store filtered lists,
  counts, or other values that can be calculated from props and state.
- Keep components and Hooks pure during render. Side effects belong in event
  handlers or Effects with explicit dependencies.
- Call Hooks only at the top level of components or custom Hooks.
- Use stable data keys, never array indexes when items can be inserted, removed,
  or reordered.
- Prefer native browser behavior and links over client-side JavaScript when a
  normal link solves the problem.
- Do not add `useMemo` or `useCallback` by reflex. Measure first and follow the
  React Compiler guidance when the project enables it.
- Use `startTransition` for non-urgent updates and `useDeferredValue` for
  expensive derived views that should not block typing. Do not use either to
  hide slow code that should be simplified.
- Use `useEffectEvent` where an Effect needs the latest non-reactive callback
  logic without making that logic an Effect dependency, when supported by the
  project React version.

Primary references:

- React Quick Start: <https://react.dev/learn>
- Thinking in React: <https://react.dev/learn/thinking-in-react>
- React reference and Rules of React: <https://react.dev/reference/react>

## Component Boundaries

- Keep route/page composition separate from reusable UI components.
- Keep API, formatting, and domain logic out of presentational components.
- Pass explicit props with small, readable types. Avoid untyped object bags.
- Use a custom Hook for reusable stateful behavior, not as a dumping ground for
  unrelated utilities.
- Keep the component tree shallow enough to understand. Split a component when
  it has multiple independent states, responsibilities, or visual sections.
- Prefer composition (`children` and slots) over boolean-prop combinations that
  create many hidden component modes.

Suggested structure:

```text
src/
  app/             application shell and routes
  components/      reusable visual components
  features/        feature-specific UI and state
  lib/             browser-safe utilities and API clients
  styles/          tokens, reset, and global styles
  test/            test setup and shared fixtures
```

## Accessibility

Target WCAG 2.2 AA for every user-facing page.

- Use one meaningful `h1`, then a logical heading hierarchy.
- Use landmarks such as `header`, `nav`, `main`, and `footer`.
- Use real buttons for actions and real anchors for navigation.
- Give every form control a visible, programmatic label.
- Provide useful alternative text for meaningful images. Use empty alt text for
  decorative images.
- Ensure all functionality works with keyboard only and has a visible focus state.
- Do not communicate state with color alone. Include text, icons with labels, or
  other non-color cues.
- Respect `prefers-reduced-motion` and avoid animation that is required to
  understand or operate the page.
- Keep contrast, focus, target size, errors, and re-authentication behavior in
  the WCAG 2.2 AA review checklist.
- Test with a keyboard, browser zoom, a screen reader, and a narrow viewport.

Use the W3C standard and its testable quick reference rather than relying only
on an automated accessibility score:
<https://www.w3.org/WAI/standards-guidelines/wcag/>.

## Visual System

- Establish design tokens for color, typography, spacing, radii, shadows, and
  motion before building individual components.
- Choose a clear visual direction for each product. Avoid default dashboard
  layouts, generic gradients, and interchangeable card grids.
- Use a small type scale and deliberate line lengths. Display type may be
  expressive; body text must remain highly legible.
- Design mobile and desktop compositions intentionally instead of merely
  shrinking the desktop layout.
- Define loading, empty, error, disabled, hover, focus, and reduced-motion
  states before calling a component complete.
- Keep decoration subordinate to information. Every animation should communicate
  state, hierarchy, or feedback.

## Performance

Use the 75th percentile of real users as the quality bar:

- LCP: 2.5 seconds or less
- INP: 200 milliseconds or less
- CLS: 0.1 or less

Implementation rules:

- Keep the initial JavaScript and CSS small. Lazy-load features that are not
  needed for the first view.
- Use responsive images with explicit dimensions to prevent layout shifts.
- Prefer modern image formats where they are supported and provide dimensions
  for every image.
- Avoid render-blocking third-party scripts and unbounded client polling.
- Virtualize genuinely large lists rather than optimizing small lists early.
- Measure with Lighthouse and browser DevTools, then verify with field data when
  the application has real traffic.

Reference: <https://web.dev/articles/vitals>.

## Data and Security

- Treat all API responses and URL parameters as untrusted input.
- Render user-controlled text as text. Do not use `dangerouslySetInnerHTML`
  without a reviewed sanitization boundary.
- Validate data at the API boundary and use typed domain objects internally.
- Do not put API keys, credentials, private hostnames, or operational secrets in
  source code, client environment variables, HTML, or logs.
- Use HTTPS for authenticated or sensitive traffic and configure a restrictive
  Content Security Policy when the deployment is ready for one.
- Use same-origin requests where practical and configure CORS deliberately;
  never use a wildcard origin for credentialed requests.
- Handle authorization on the server. Hiding a link or route in React is not
  access control.
- Keep dependencies current, review lockfile changes, and remove unused
  packages.

Use OWASP Top 10:2025 as the minimum application-security awareness checklist:
<https://owasp.org/www-project-top-ten/>.

## Testing

Use a layered test strategy:

- Unit test pure formatting, parsing, validation, and state-transition logic.
- Component test user-visible behavior with React Testing Library.
- Add a small number of end-to-end tests for critical navigation and deployment
  paths when the application gains meaningful interaction.
- Test loading, success, empty, error, keyboard, and narrow-screen states.
- Query elements the way a user does: role, label, text, and accessible name.
  Use `data-testid` only as an escape hatch.
- Do not assert component internals, private state, implementation-specific class
  names, or exact DOM nesting unless that structure is a requirement.

React Testing Library's guiding principle is that tests should resemble how the
software is used: <https://testing-library.com/docs/react-testing-library/intro/>.

## Review Gate

Before merging a frontend change:

- `npm run lint` passes with the React Hooks rules enabled.
- `npm run typecheck` passes with TypeScript strictness enabled.
- `npm run test` passes.
- `npm run build` succeeds from a clean install.
- Keyboard and mobile checks are complete.
- No secrets or private infrastructure details entered the client bundle.
- Lighthouse has no new high-severity accessibility, performance, or security
  regressions.
- The production serving path has been tested through NGINX, not only through
  the development server.

## Source Review Date

This document was assembled from the primary sources above on 2026-09-11. Check
the linked documentation when upgrading React, Vite, WCAG, or the testing stack;
the principles are durable, but APIs and recommended versions change.

# Frontend Design Skills

This guide defines the design skills for clear, responsive, and interactive
frontends. "Responsive" means the layout adapts to the available space and
input method. "Reactive" means changes in data or user input produce clear,
predictable feedback without making the interface feel busy or fragile.

## 1. Start With the User's Job

- Write the primary user task in one sentence before designing the page.
- Put the most important action and information in the first visual scan.
- Group content by user intent, not by database model or internal service names.
- Use language users understand. Keep technical detail available as supporting
  information, not as the main interface.
- Remove content that does not help the current task.
- Decide what success, loading, empty, error, offline, and permission-denied
  states mean before drawing the happy path.

Use Nielsen's heuristics as a quick critique: system status, real-world language,
user control, consistency, error prevention, recognition, flexibility,
minimalism, recovery, and contextual help:
<https://www.nngroup.com/articles/ten-usability-heuristics/>.

## 2. Establish Hierarchy Before Decoration

- Create one clear page title and a small number of meaningful sections.
- Use size, weight, contrast, spacing, and position in that order to establish
  hierarchy. Do not use color as the only signal.
- Keep paragraphs and dense controls within readable line lengths.
- Align related content to a shared grid or edge. Break alignment only when the
  visual break communicates hierarchy or movement.
- Use whitespace to separate ideas; do not fill every empty area with cards,
  gradients, borders, or badges.
- Make the primary action visually distinct from secondary and destructive
  actions.
- Give every interactive element a clear affordance: it should look clickable,
  focusable, draggable, or expandable before it is used.

## 3. Build a Visual Language

- Define tokens for color, type scale, spacing, radius, elevation, border, and
  motion before implementing repeated components.
- Choose one deliberate visual direction and apply it consistently.
- Use no more than a few functional colors: background, text, muted text,
  primary action, success, warning, and error.
- Pair a distinctive display face with a highly legible reading face when the
  product tone benefits from it. Always provide a robust fallback stack.
- Use optical judgment rather than making every value mathematically identical.
  Visual balance matters more than rigid symmetry.
- Design dark mode as a real theme with tested contrast, not as inverted colors.
- Keep icons simple, consistent in stroke or fill, and accompanied by labels
  when their meaning is not universally understood.

## 4. Design Responsive Layouts

- Start with the narrowest useful layout, then expand when the content needs
  more room.
- Use fluid CSS Grid, Flexbox, `minmax()`, `clamp()`, relative units, and
  intrinsic sizing before adding breakpoints.
- Choose breakpoints when the content becomes uncomfortable, not for named
  devices or specific phone models.
- Use media queries for page-level changes and container queries for reusable
  components that must adapt to their parent.
- Prevent horizontal scrolling unless it is an intentional interaction such as
  a data table or carousel with an accessible alternative.
- Keep touch targets comfortable and leave enough spacing for imprecise input.
- Test portrait, landscape, keyboard navigation, zoom, reduced motion, and
  coarse pointer input.
- Use `@media (hover: hover)` before making hover the only way to discover or
  operate a feature.
- Use logical properties such as `margin-inline` and `padding-block` when the
  layout may need to support different writing directions.
- Include `<meta name="viewport" content="width=device-width, initial-scale=1">`.

References:

- Responsive fundamentals: <https://web.dev/articles/responsive-web-design-basics>
- MDN responsive design: <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design>
- CSS container queries: <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries>
- Responsive design course: <https://web.dev/learn/design/>

## 5. Make Interaction Feel Reactive

- Acknowledge user input immediately when work takes time.
- Show progress for operations longer than a brief interaction threshold.
- Preserve the user's input while loading or recovering from an error.
- Disable only the action that cannot safely be repeated; do not freeze the
  whole page without a strong reason.
- Use optimistic updates only when failure can be reversed and the UI clearly
  communicates the pending state.
- Make async errors specific and actionable: explain what happened and what the
  user can do next.
- Provide undo or cancel for actions with meaningful consequences.
- Use transitions to preserve spatial context, not to make every element move.
- Respect `prefers-reduced-motion` and provide an equivalent non-animated state.
- Keep focus in a sensible location after dialogs, route changes, validation,
  and dynamic content updates.
- Prefer progressive enhancement: the primary navigation and core content should
  remain understandable if JavaScript is slow, unavailable, or interrupted.

## 6. Design Components as Systems

- Define the component's purpose, anatomy, states, variants, and responsive
  behavior before writing it.
- Prefer a small set of composable primitives over a large collection of
  one-off components.
- Use content-driven examples when designing components; placeholder text hides
  wrapping and overflow problems.
- Specify minimum and maximum content lengths for labels, headings, and errors.
- Test components in narrow and wide parent containers, not only at page width.
- Keep variants explicit. Avoid boolean props that create combinations no one
  has designed or tested.
- Document when a component should not be used.
- Reuse interaction patterns consistently across the application.

The GOV.UK Design System is a useful example of documenting components with
guidance, coded examples, and accessibility behavior:
<https://design-system.service.gov.uk/components/>.

## 7. Handle Content and Errors Well

- Write headings that describe the content or task, not the implementation.
- Use concise action labels such as "Save changes" instead of vague labels such
  as "Submit" or "Continue" when the outcome is known.
- Put instructions before the control that needs them.
- Validate as close to the user action as possible, without interrupting typing.
- Put errors beside the relevant control and summarize multiple errors when a
  form is long.
- Do not erase valid user input after a failed request.
- Distinguish no data, no matching results, unavailable data, and failed loading.
- Use plain language in errors. Technical identifiers belong in diagnostic logs
  or an expandable detail area.

## 8. Accessibility Is a Design Constraint

- Use semantic HTML before ARIA.
- Make the full interface operable with a keyboard.
- Give focus indicators enough contrast and visibility.
- Ensure text and controls remain usable at 200% zoom.
- Do not rely on color, position, animation, or sound alone to communicate state.
- Provide names and roles for custom controls, but prefer native controls.
- Ensure live updates are announced appropriately without stealing focus.
- Check contrast for text, icons, borders, disabled states, and focus states.
- Test with a keyboard and at least one screen reader in addition to automated
  tooling.
- Target WCAG 2.2 AA; use the W3C criteria as the conformance source:
  <https://www.w3.org/WAI/standards-guidelines/wcag/>.

## 9. Validate the Design

- Review a real content state, an empty state, a slow state, and an error state.
- Test at minimum narrow phone, large phone, tablet, laptop, and wide desktop
  widths, but do not hard-code a device-specific design.
- Use browser DevTools responsive mode and inspect for overflow at arbitrary
  widths between the chosen breakpoints.
- Navigate the page using only Tab, Shift+Tab, Enter, Space, Escape, and arrow
  keys where appropriate.
- Test at 200% zoom and with reduced motion enabled.
- Check the page with Lighthouse, then confirm important performance behavior in
  real browsers and real network conditions.
- Run a five-minute heuristic review: status, language, control, consistency,
  prevention, recognition, efficiency, minimalism, recovery, and help.
- Ask another person to complete the primary task without explaining the design.
  Watch where they hesitate instead of defending the intended layout.

## 10. Definition of Done

A design is ready to implement when:

- The primary task and audience are explicit.
- The content hierarchy is understandable without color or animation.
- Desktop, mobile, keyboard, touch, zoom, and reduced-motion behavior is defined.
- Loading, empty, error, offline, and permission states have designs.
- All interactive elements have names, focus behavior, and clear outcomes.
- Components have documented states and content limits.
- The page has been checked against WCAG 2.2 AA requirements.
- The design has a measured performance budget and no unnecessary third-party
  assets.

## Sources

- web.dev responsive design basics: <https://web.dev/articles/responsive-web-design-basics>
- MDN responsive design: <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design>
- MDN container queries: <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries>
- web.dev Learn Responsive Design: <https://web.dev/learn/design/>
- Nielsen Norman Group usability heuristics: <https://www.nngroup.com/articles/ten-usability-heuristics/>
- GOV.UK Design System components: <https://design-system.service.gov.uk/components/>

Source review date: 2026-09-11.

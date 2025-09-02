# CitiDemo

This project was generated using Angular CLI version 20.2.0.

---

## Development server
Run the application in development mode with your preferred package script runner. After starting the dev server, open a browser and navigate to the local address shown in the terminal (typically localhost on port 4200). The server supports live reload, so changes in source files automatically trigger a rebuild and refresh the page.

---

## What this project demonstrates
- Angular 20 with standalone APIs and zoneless change detection
- Feature routing with lazy-loaded components for list and detail pages
- HTTP data flow against the public DummyJSON API for list, search, detail, and create scenarios
- Typed reactive forms with validation and user-friendly error messaging
- NgRx state management using actions, effects, entity adapter, selectors, and a thin facade layer
- Performance practices: OnPush change detection, trackBy in lists, cancellation of stale requests, and micro-debouncing user input
- Accessibility basics aligned to WCAG: labeled inputs, error regions via aria-describedby, and focus management on navigation

---

## Feature overview
- List view with debounced search, paginated table, and a small create form that validates input
- Detail view that fetches a single item and moves keyboard focus to the page heading on navigation to aid screen-reader users

---

## Architecture at a glance
- Standalone components: no NgModules; each component declares its own imports
- Zoneless change detection: UI updates are driven by explicit triggers such as user events, Observables with the async pipe, or Signals
- NgRx store pattern:
  - Intent captured via actions such as entering the list, changing the search term, or changing the page
  - Side effects and HTTP handled in effects and mapped to success and failure actions
  - Reducers are pure and write normalized data with the entity adapter
  - Selectors provide a stable, memoized read model
  - A facade exposes a single, component-friendly view model and simple methods to dispatch intent
- Accessibility: labels, described-by error text, polite live regions, and managed focus for better keyboard and screen-reader support

---

## Project structure (high level)
- Application configuration and routing at the root level
- A products feature that contains:
  - A list component with template, styles, and logic
  - A detail component for displaying a single item
  - A small API service used by effects for network requests
  - NgRx state files: actions, reducer, effects, and facade

This organization keeps components presentation-focused while centralizing data orchestration and state transitions.

---

## Routing
- Redirect from the root path to the list
- Lazy loading of the list and detail components via loadComponent
- Route parameters used for the detail page

---

## Data source
- The app reads from the DummyJSON products endpoints
- Typical operations include paged listing, free-text search, item detail, and a simple create flow
- Requests are made without credentials; responses populate the normalized store

---

## State and reactive patterns
- Global store backed by the NgRx entity adapter for efficient lookups and stable identities
- Effects debounce noisy inputs and use a latest-wins strategy to prevent race conditions
- View models are assembled in the facade so components bind to a single stream for rendering

---

## Performance considerations
- OnPush change detection is used throughout
- TrackBy functions are used in repeated lists to avoid unnecessary DOM work
- Micro-debounced input processing reduces redundant requests
- Stale HTTP requests are cancelled so the UI always reflects the most recent user intent

---

## Accessibility checklist
- Inputs have visible labels associated by the for and id attributes
- Error messages are referenced via aria-describedby
- A polite live region announces form status without disrupting focus
- Focus moves to the primary heading on page navigation
- Keyboard access is verified for pagination controls and form submission

---

## Quality and testing (recommended)
- Unit tests for pure logic such as reducers, selectors, and utilities
- Component tests using Angular component harnesses for stable DOM interaction
- Effect tests with marble patterns for deterministic asynchronous behavior
- Optional accessibility checks in continuous integration
- Linting and type-checking as pre-merge quality gates

---

## Module Federation notes (optional)
- Remotes can be hosted on a trusted content delivery network and referenced from the shell application
- Share only what needs to be shared:
  - Critical session and authorization data should come from a Backend-for-Frontend with HttpOnly cookies
  - UI state can be shared via dependency injection tokens, a shared NgRx store configured as singletons, or URL parameters
- Security guidance:
  - Maintain an allow-list for remote URLs and use a versioned manifest
  - Enforce a strict Content Security Policy with a runtime nonce
  - Provide fallbacks and a kill switch for remote load failures
  - Use immutable, versioned remote paths to enable fast rollback

---

## Troubleshooting
- If data appears in the network panel but not in the UI, verify that the success action updates state in the reducer and that the selectors used by the facade match the feature key
- If templates render but do not refresh, confirm zoneless-friendly patterns are used, such as the async pipe or Signals, rather than mutating plain fields
- Verify routes and component class names match the lazy import paths

---

## Roadmap ideas
- Add automated accessibility checks and visual regression tests to the pipeline
- Add contract tests driven by an OpenAPI schema
- Provide a sample Module Federation remote with a small cross-application context via dependency injection
- Introduce feature flags and a rollback recipe for safe releases

---

## License
Use MIT or your organization’s standard license text.
"""
with open('/mnt/data/README.md', 'w', encoding='utf-8') as f:
    f.write(content)
print("README.md created at /mnt/data/README.md")

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

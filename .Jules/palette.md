## 2024-12-23 - Interactive Cards Accessibility
**Learning:** `div`s with `onClick` are invisible to screen readers and keyboard users unless they have `role="button"`, `tabIndex="0"`, and `onKeyDown` handlers.
**Action:** When making cards clickable, always ensure they are semantically buttons or have the appropriate ARIA roles and keyboard event handlers. Using `button` element wraps the content is often simpler if layout permits, otherwise add full ARIA support.

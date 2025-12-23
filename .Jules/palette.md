## 2024-12-23 - Interactive Cards Accessibility
**Learning:** `div`s with `onClick` are invisible to screen readers and keyboard users unless they have `role="button"`, `tabIndex="0"`, and `onKeyDown` handlers.
**Action:** When making cards clickable, always ensure they are semantically buttons or have the appropriate ARIA roles and keyboard event handlers. Using `button` element wraps the content is often simpler if layout permits, otherwise add full ARIA support.

## 2024-12-23 - Theming with CSS Variables
**Learning:** Using semantic CSS variables (e.g., `--primary`, `--background`) mapped to Tailwind config allows for cleaner, maintainable themes compared to hardcoded utility classes.
**Action:** Define a core color palette in `:root` and `.dark` classes, then map Tailwind colors to these variables (`colors: { primary: 'var(--primary)' }`) to enable easy theme switching and consistent design updates.

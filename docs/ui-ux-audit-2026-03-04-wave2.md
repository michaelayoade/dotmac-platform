# UI/UX Audit — 2026-03-04 (Wave 2)

**Scope:** Templates, components, platform_base layout, accessibility, UX flow, empty/loading/error states, consistency.

---

## P0 — Critical (Accessibility Blockers)

### 1. Confirm Dialog Missing Focus Trap
- **File:** `templates/platform_base.html` L455–475
- **Issue:** Global confirm dialog lacks `x-trap` focus management. When dialog opens, focus stays on the trigger button. Keyboard users cannot interact with the dialog without tabbing through the entire page.
- **WCAG:** 2.4.3 Focus Order, 2.1.1 Keyboard
- **Fix:** Add `x-trap.noscroll` to dialog container panel.
- **Status:** FIXED in this wave

### 2. Error Messages Missing `role="alert"`
- **Files:** `templates/instances/form.html` L12–16, `templates/servers/form.html` L12–16, `templates/git_repos/edit.html` L10–13
- **Issue:** Form error containers use visual styling only — no ARIA live region. Screen readers do not announce errors when they appear after form submission.
- **WCAG:** 4.1.3 Status Messages
- **Fix:** Add `role="alert"` to error `<div>` containers.
- **Status:** FIXED in this wave

### 3. Icon Buttons Missing `aria-label`
- **Files:** `templates/platform_base.html` L388 (dark mode toggle), L394 (sign-out button)
- **Issue:** Dark mode toggle uses `title=` but no `aria-label`. Sign-out button uses `title=` but no `aria-label`. Screen readers announce "button" with no context.
- **WCAG:** 1.1.1 Non-text Content, 4.1.2 Name, Role, Value
- **Fix:** Add `aria-label` attributes to both buttons.
- **Status:** FIXED in this wave

---

## P1 — High (Usability / UX)

### 4. Pagination Touch Targets Below WCAG Minimum
- **File:** `templates/components/pagination.html` L23, L44, L47, L54
- **Issue:** Page number links use `px-2.5 py-1.5` giving ~28x24px touch targets. WCAG 2.5.8 (Target Size) recommends minimum 44x44 CSS pixels. Mobile users struggle to tap correct page.
- **Fix:** Increase to `px-3 py-2` with `min-w-[36px] min-h-[36px]` ensuring larger targets.
- **Status:** FIXED in this wave

### 5. Required Field Indicators Missing
- **File:** `templates/components/forms.html` L30–45
- **Issue:** `text_input` and `select_input` macros add HTML `required` attribute but provide no visual indicator (asterisk). Users cannot determine which fields are mandatory before submission.
- **Fix:** Add red asterisk `*` to labels and `aria-required="true"` to inputs when `required=true`.
- **Status:** FIXED in this wave

### 6. Inconsistent Empty States
- **Issue:** Some pages use `empty_state()` macro (instances/list), others use inline `<tr><td colspan>No data</td></tr>` (organizations/list, people/list).
- **Fix:** Future wave — migrate all empty states to use the macro.
- **Status:** DEFERRED

### 7. Inconsistent Form Input Styling
- **Issue:** Some templates use `text_input()` macro (consistent styling with `bg-surface-50 px-4 py-2.5`), while others use inline input classes with different backgrounds (`bg-white`), different padding (`px-3 py-2`).
- **Fix:** Future wave — audit all inline form inputs and migrate to macro.
- **Status:** DEFERRED

---

## P2 — Medium (Polish / Enhancement)

### 8. Sort Column Indicators Barely Visible
- **File:** `templates/instances/list.html` L128
- **Issue:** Sort arrow uses `opacity-0 group-hover:opacity-40` — nearly invisible even on hover. Poor affordance for sortable columns.
- **Fix:** Increase to `opacity-60` on hover.
- **Status:** DEFERRED

### 9. Toast Duration Not Customizable Per-Type
- **File:** `templates/platform_base.html` L530
- **Issue:** `addToast()` defaults to 4000ms. Error toasts should persist longer (e.g., 8s) so users can read the message. Already supports `detail.duration` parameter but callers don't use it.
- **Fix:** Document and promote `duration` parameter usage.
- **Status:** DEFERRED

### 10. No Disabled State Styling for Form Fields
- **Issue:** `<input disabled>` has no distinct visual treatment in the form macros. Users cannot distinguish disabled fields from active ones.
- **Fix:** Add `disabled:opacity-50 disabled:cursor-not-allowed` to input classes.
- **Status:** DEFERRED

### 11. Sidebar Navigation Not Searchable
- **Issue:** 40+ menu items with no quick search/filter. Deep navigation feels slow.
- **Fix:** Future wave — add command palette or search filter.
- **Status:** DEFERRED

---

## Summary of Changes in This Wave

| # | Finding | Priority | Status |
|---|---------|----------|--------|
| 1 | Confirm dialog focus trap | P0 | FIXED |
| 2 | Error messages `role="alert"` | P0 | FIXED |
| 3 | Icon buttons aria-labels | P0 | FIXED |
| 4 | Pagination touch targets | P1 | FIXED |
| 5 | Required field indicators | P1 | FIXED |
| 6 | Inconsistent empty states | P1 | DEFERRED |
| 7 | Inconsistent form inputs | P1 | DEFERRED |
| 8 | Sort indicator visibility | P2 | DEFERRED |
| 9 | Toast duration per-type | P2 | DEFERRED |
| 10 | Disabled field styling | P2 | DEFERRED |
| 11 | Sidebar search | P2 | DEFERRED |

**Files modified:**
- `templates/platform_base.html` — Confirm dialog focus trap + icon button aria-labels
- `templates/components/pagination.html` — Enlarged touch targets
- `templates/components/forms.html` — Required field asterisks + aria-required
- `templates/instances/form.html` — Error `role="alert"`
- `templates/servers/form.html` — Error `role="alert"`
- `templates/git_repos/edit.html` — Error `role="alert"`

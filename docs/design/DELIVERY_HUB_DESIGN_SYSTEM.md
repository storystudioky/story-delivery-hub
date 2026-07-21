# Delivery Hub Design System

## Purpose

Delivery Hub is a standalone sister product to SPARK. It inherits selected SPARK visual foundations while remaining independently buildable, deployable, and free of SPARK business logic.

This document records what Delivery Hub owns after Step 9 adaptation from the immutable SPARK snapshot at `src/design-system-source/spark-679fe119/` (commit `679fe11962ef23e6cb09c85eda431c5b52451861`).

## Source baseline

See `docs/design/SPARK_DESIGN_SOURCE.md` and `docs/design/SPARK_COMPONENT_EXTRACTION_MANIFEST.md`.

Runtime code must never import from:

- `src/design-system-source/**`
- the local `SPARK-SaaS/story-dev` repository

## Inherited rules

- Inter typography
- Primary indigo (`hsl(231 65% 57%)` light / `hsl(235 70% 60%)` dark)
- Lime and purple brand accents
- Flat-and-frosted surface treatments
- Rainbow gradient panel border for page-header summaries
- Shared Radix/shadcn accessible primitives
- Success and completion states use primary indigo (not generic green)
- Attention uses indigo, amber, and destructive red with visible text labels

## Delivery Hub-owned files

| Area | Path |
|------|------|
| Tokens | `src/styles/delivery-hub-tokens.css`, `src/index.css` |
| Tailwind | `tailwind.config.ts` |
| UI primitives | `src/components/ui/*` |
| Status vocabulary | `src/lib/status-variants.ts`, `src/components/ui/status-badge.tsx` |
| Hub patterns | `src/components/hub/*` |
| Layout re-exports | `src/components/layout/index.ts` |
| Design-system page | `src/pages/DesignSystem.tsx` |
| App shell / routes | `src/App.tsx`, `src/main.tsx` |

## Central variants (authoritative PRD vocabulary)

Page-local badge colours are prohibited. Use:

### Task status

- `not_started` — Not started
- `in_progress` — In progress
- `waiting` — Waiting
- `complete` — Complete
- `on_hold` — On hold

A task is visually resolved only when status is `complete`. Waiting and on hold are not completed states.

### Attention

- `on_track` — On track (primary indigo)
- `needs_attention` — Needs attention (amber) — requires attention note
- `late_off_track` — Late/off track (destructive red) — requires attention note

Do not introduce separate risk or issue status vocabularies.

### Contract status

- `draft`, `active`, `expiring`, `extended`, `completed`, `terminated`, `archived`

### Roles

- `platform_owner` — Platform owner
- `tenant_admin` — Tenant administrator
- `manager_editor` — Manager/editor
- `contributor` — Contributor
- `viewer` — Viewer

Wrappers: `TaskStatusBadge`, `AttentionBadge`, `ContractStatusBadge`, `RoleStatusBadge`.

## Hub patterns

- `HubAppShell` — desktop left nav + mobile sheet nav; slots for tenant switcher, account controls, theme toggle
- `HubHeader` / `HubSidebar` / `HubPageHeader`
- `TenantSwitcher` / `AccountControls`
- `KpiCard`, `CommercialSummaryCard`, `FilterToolbar`, `ResponsiveDataTable`
- `WorkstreamCard`, `EntityCard`
- `TaskRow`, `TaskQuickEditDrawer` (status, attention, owner, due date, latest update, View source; conditional attention note / waiting fields)
- `ReportSection`, `LockedReportBanner` (immutable snapshot framing)
- `EmptyState`, `LoadingState`, `ErrorState`, `AccessDeniedState`

## Authoritative product navigation

Overview · Internal · Vendors · Contracts · Workstreams · Reports · Tools · Settings

Tasks and Projects are not top-level navigation destinations. The design-system route may appear under a separated Development section in development only.

## Terminology

Prefer tenant language (`tenant`, `tenant administrator`) over SPARK workspace wording. Prefer `contract` / `contract view` over “contract board”.

Commercial mock examples should use KYD or CI$ rather than generic USD dollars.

## Intentional divergences from SPARK

1. Product naming is **Delivery Hub**; SPARK logos, Sparktoria naming, workspace switchers, billing, and service catalogue chrome were not adapted.
2. Brand colour aliases `--hub-*` / `hub-*` Tailwind colours were added alongside retained `--spark-*` token names for sister-product continuity.
3. SPARK-only badge variants `pro` and `manualGraphic` were removed.
4. TipTap editor styles and Market Survey orb/chat surfaces were excluded from Hub tokens.
5. Presentation patterns were rewritten as prop-driven Hub components with mock-friendly APIs (no campaign hooks, Supabase, or SPARK query keys).
6. `/design-system` is development-only (`import.meta.env.DEV`) and is not part of production navigation.
7. Domain vocabulary follows the Delivery Hub PRD, not SPARK campaign/task enums.

## Verification

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

In development: open `/design-system` to review tokens, primitives, hub patterns, light/dark mode, and responsive navigation.

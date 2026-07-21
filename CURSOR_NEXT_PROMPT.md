# Cursor task — adapt the recorded SPARK design snapshot

Repository: `story-delivery-hub`

Before taking action:

1. Fetch and verify current `origin/main`.
2. Read the authoritative Delivery Hub PRD.
3. Read:
   - `docs/design/SPARK_DESIGN_SOURCE.md`
   - `docs/design/SPARK_STYLE_GUIDE_SOURCE.md`
   - `docs/design/SPARK_COMPONENT_EXTRACTION_MANIFEST.md`
4. Inspect the immutable source snapshot under `src/design-system-source/spark-679fe119/`.
5. Do not modify or import runtime code directly from the immutable snapshot.

Objective:

Adapt the approved SPARK visual foundation into Delivery Hub-owned design tokens, shared UI primitives, Hub components, and a development-only `/design-system` route. Delivery Hub must feel like a SPARK sister product while remaining independently buildable and free of SPARK business logic.

Required work:

1. Establish Delivery Hub-owned tokens in `src/index.css` and Tailwind configuration, preserving the SPARK token intent for colour, typography, spacing, radius, shadows, and flat-and-frosted surfaces.
2. Recreate or adapt the approved shared primitives under `src/components/ui`.
3. Add central Delivery Hub variants for task status, attention, contract status, and role badges. Do not create page-local badge styling.
4. Create Delivery Hub-owned patterns under `src/components/hub`, including:
   - `HubAppShell`
   - `HubHeader`
   - `HubSidebar`
   - `HubPageHeader`
   - `KpiCard`
   - `CommercialSummaryCard`
   - `FilterToolbar`
   - `ResponsiveDataTable`
   - `TaskRow`
   - `TaskQuickEditDrawer`
   - `EmptyState`
   - `LoadingState`
   - `AccessDeniedState`
   - `ReportSection`
   - `LockedReportBanner`
5. Create `docs/design/DELIVERY_HUB_DESIGN_SYSTEM.md`, documenting inherited rules, Delivery Hub adaptations, and intentional divergences.
6. Create a development-only `/design-system` route demonstrating:
   - tokens and typography;
   - buttons and form controls;
   - badges and semantic states;
   - cards, KPI summaries, filters, and tables;
   - task rows and task drawer;
   - report sections;
   - desktop and mobile navigation;
   - loading, empty, error, and access-denied states;
   - light and dark modes where enabled.
7. Add tests for central variants and basic design-system route rendering.

Non-negotiable boundaries:

- Do not copy SPARK database types, migrations, workspace contexts, service guards, billing, Stripe, token systems, query keys, routes, logos, or feature workflows.
- Do not depend on `SPARK-SaaS/story-dev` at runtime or build time.
- Do not implement Delivery Hub business CRUD in this task.
- Do not add subtasks, Gantt, chat, time tracking, or other project-management scope.
- Preserve accessible Radix behaviour, keyboard interaction, focus states, and responsive touch targets.
- Positive and complete states use primary indigo. Attention uses indigo, amber, and destructive red with visible text labels.

Verification:

- Run install only if dependency reconciliation requires it.
- Run typecheck, lint, tests, and production build.
- Confirm `/design-system` is not exposed in production navigation.
- Confirm no runtime imports reference `src/design-system-source` or the SPARK repository.
- Report changed files, dependency changes, tests, build result, and any deliberate divergence from the SPARK source.

Commit the completed work on a dedicated branch and prepare it for review. Do not merge without owner approval.

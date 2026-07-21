# SPARK Design Extraction Manifest for Delivery Hub

## Extraction strategy

Do not paste SPARK files directly over Delivery Hub application files. First create an immutable source snapshot under:

```text
src/design-system-source/spark-679fe119/
```

Cursor should then adapt approved assets from that snapshot into Delivery Hub-owned files such as `src/index.css`, `tailwind.config.ts`, `src/components/ui`, and `src/components/hub`.

This preserves provenance and prevents accidental import of SPARK business logic.

## Tier 1 — canonical tokens and design documentation

These files are required:

```text
SPARK_STYLE_GUIDE.md
src/index.css
tailwind.config.ts
src/pages/DesignSystem.tsx
src/lib/utils.ts
package.json
```

Use them to establish:

- CSS custom properties.
- Light and dark semantic palettes.
- SPARK indigo, lime, purple, and neutral accents.
- Inter typography.
- Spacing and radius scales.
- Shadows, blur, and flat-and-frosted container patterns.
- Tailwind token mappings.
- Required Radix, shadcn-style, Lucide, and utility dependencies.

## Tier 2 — shared UI primitives

Copy as source references, then adapt only where Delivery Hub needs a documented change:

```text
src/components/ui/alert-dialog.tsx
src/components/ui/avatar.tsx
src/components/ui/badge.tsx
src/components/ui/breadcrumb.tsx
src/components/ui/button.tsx
src/components/ui/calendar.tsx
src/components/ui/card.tsx
src/components/ui/checkbox.tsx
src/components/ui/dialog.tsx
src/components/ui/drawer.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/ui/popover.tsx
src/components/ui/progress.tsx
src/components/ui/select.tsx
src/components/ui/sheet.tsx
src/components/ui/skeleton.tsx
src/components/ui/switch.tsx
src/components/ui/table.tsx
src/components/ui/tabs.tsx
src/components/ui/textarea.tsx
src/components/ui/toast.tsx
src/components/ui/toaster.tsx
src/components/ui/sonner.tsx
src/components/ui/tooltip.tsx
src/hooks/use-toast.ts
```

### Delivery Hub adaptation rules

- Preserve accessible Radix behaviour and keyboard interactions.
- Preserve shared variants instead of creating page-local button or badge classes.
- Positive and complete states use primary indigo, not generic green.
- Add Delivery Hub status and attention variants centrally.
- Do not retain SPARK-specific labels such as `pro`, campaign states, or service states unless the Hub genuinely needs them.
- Reconcile component dimensions against the Delivery Hub design document before feature pages are built.

## Tier 3 — reusable SPARK presentation patterns

These are reference patterns, not drop-in business components:

```text
src/components/spark/PageHeader.tsx
src/components/spark/MainLayout.tsx
src/components/spark/SparkHeader.tsx
src/components/campaigns/MetricsFilterBar.tsx
src/components/campaigns/MetricsSummaryCards.tsx
src/components/campaigns/MetricsTable.tsx
src/components/campaigns/TaskRow.tsx
src/components/campaigns/BudgetOverviewCard.tsx
src/components/campaigns/BudgetTracker.tsx
```

Adapt them into Delivery Hub-owned components, for example:

```text
src/components/hub/HubAppShell.tsx
src/components/hub/HubHeader.tsx
src/components/hub/HubSidebar.tsx
src/components/hub/HubPageHeader.tsx
src/components/hub/KpiCard.tsx
src/components/hub/CommercialSummaryCard.tsx
src/components/hub/FilterToolbar.tsx
src/components/hub/ResponsiveDataTable.tsx
src/components/hub/TaskRow.tsx
src/components/hub/TaskQuickEditDrawer.tsx
```

Strip all SPARK-specific dependencies, including:

- Workspace contexts.
- Service access guards.
- Billing and subscription conditions.
- SPARK routes and navigation labels.
- Campaign-specific status types.
- SPARK logos and product naming.
- SPARK database types and query keys.

## Required output after adaptation

Delivery Hub should contain:

```text
docs/design/SPARK_DESIGN_SOURCE.md
docs/design/SPARK_STYLE_GUIDE_SOURCE.md
docs/design/SPARK_COMPONENT_EXTRACTION_MANIFEST.md
docs/design/DELIVERY_HUB_DESIGN_SYSTEM.md
src/design-system-source/spark-679fe119/...
src/components/ui/...
src/components/hub/...
src/pages/DesignSystem.tsx
```

## Design-system acceptance checks

Before business screens begin:

- The application builds without access to the SPARK repository.
- `/design-system` renders in development.
- Light and dark token sets render correctly where dark mode is enabled.
- Buttons, badges, inputs, selects, cards, tables, tabs, dialogs, sheets, and drawers are demonstrated.
- Status and attention treatments are centrally defined and labelled.
- KPI cards, filter toolbar, task row, task drawer, and report section patterns are demonstrated.
- No SPARK logo, workspace, billing, subscription, or service logic remains.
- No source file is imported at runtime from `SPARK-SaaS/story-dev`.

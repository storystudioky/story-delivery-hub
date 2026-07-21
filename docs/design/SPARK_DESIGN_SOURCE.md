# SPARK Design-System Source Record

## Purpose

Delivery Hub is a standalone sister product to SPARK.

It adopts selected SPARK design tokens, shared UI primitives, visual conventions, and reusable presentation patterns while maintaining its own repository, Supabase project, business logic, tenancy model, routes, and runtime.

This document records the immutable SPARK source baseline used for the initial Delivery Hub design-system extraction.

## Recorded source

- Source repository: `SPARK-SaaS/story-dev`
- Source branch at time of recording: `main`
- Source commit: `679fe11962ef23e6cb09c85eda431c5b52451861`
- Commit subject: `Merge pull request #25 from SPARK-SaaS/market-research-v2-1-roadmap-reconciliation`
- Recorded for Delivery Hub: 21 July 2026
- Delivery Hub repository: `storystudioky/story-delivery-hub`

## Canonical design references

The initial extraction may use the following SPARK files from the recorded commit:

- `SPARK_STYLE_GUIDE.md`
- `src/index.css`
- `tailwind.config.ts`
- `src/pages/DesignSystem.tsx`
- `src/lib/utils.ts`
- `src/components/ui/*`
- `src/components/spark/PageHeader.tsx`
- `src/components/spark/MainLayout.tsx`
- `src/components/spark/SparkHeader.tsx`
- Selected campaign presentation components for KPI cards, filters, tables, task rows, and budget summaries

## Permitted inheritance

Delivery Hub may inherit or adapt:

- CSS custom-property design tokens
- Tailwind theme configuration
- Inter typography
- Colour, spacing, radius, border, and shadow conventions
- Flat-and-frosted surface treatments
- Shared accessible UI primitives
- Button, badge, card, form, table, drawer, dialog, tooltip, and navigation patterns
- Page-header and summary-card presentation patterns
- Responsive and interaction conventions
- Lucide icon usage

## Prohibited inheritance

Delivery Hub must not copy or depend on:

- SPARK database schemas or migrations
- SPARK workspace or membership business logic
- SPARK service catalogue or service-access guards
- Stripe, subscription, token, or usage logic
- Market Survey, Campaign Manager, Content Calendar, or other feature workflows
- SPARK-specific routes
- SPARK Supabase types
- SPARK authentication assumptions without independent review
- SPARK logos or the Sparktoria product name

## Runtime independence

Delivery Hub must remain independently buildable and deployable.

The Delivery Hub application must not import files from the local SPARK repository at runtime. Approved design files will be copied or adapted into Delivery Hub-owned source files.

## Upgrade policy

This commit is a fixed baseline.

Later changes to SPARK are not inherited automatically. Any future SPARK design-system update must be deliberately reviewed, documented, and adopted through a Delivery Hub commit or pull request.

## Verification

From the local SPARK repository, this source commit can be verified with:

```powershell
git fetch origin
git show --no-patch --format="%H%n%s" 679fe11962ef23e6cb09c85eda431c5b52451861
```

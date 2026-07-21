# SPARK SaaS — Definitive UI Style Guide

> **Canonical Reference** — All services and pages across the SPARK platform **must** adhere to the design patterns documented here. This guide was derived from the fully-standardized **Campaign Manager** service and its sub-pages (Tasks, Assets, Metrics, Budget, KPIs, Report).

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Tokens (CSS Custom Properties)](#2-design-tokens)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Border Radii](#6-border-radii)
7. [Glassmorphism ("Flat & Frosted")](#7-glassmorphism)
8. [Shadows](#8-shadows)
9. [Button Hierarchy](#9-button-hierarchy)
10. [Badge System](#10-badge-system)
11. [Cards & Containers](#11-cards--containers)
12. [Tables & Data Grids](#12-tables--data-grids)
13. [Filters & Toolbars](#13-filters--toolbars)
14. [Tab Navigation](#14-tab-navigation)
15. [Form Controls & Inputs](#15-form-controls--inputs)
16. [Icons](#16-icons)
17. [Empty States](#17-empty-states)
18. [Status Indicators & Progress](#18-status-indicators--progress)
19. [Hover & Interaction States](#19-hover--interaction-states)
20. [Page Headers](#20-page-headers)
21. [Rainbow Border (Brand Accent)](#21-rainbow-border)
22. [Inline Editing Patterns](#22-inline-editing-patterns)
23. [Component Quick-Reference Table](#23-component-quick-reference-table)
24. [Enforcement Rules & QA Checklist](#24-enforcement-rules--qa-checklist)

---

## Visual Reference

````carousel
![Campaign List — Rainbow-bordered cards with status badges and progress bars](C:\Users\lisse\.gemini\antigravity\brain\e26ea774-2767-44f9-8088-df7845980672\campaign_list_page_1775671739318.png)
<!-- slide -->
![Campaign Detail — Overview stats panel with pill-shaped tab navigation](C:\Users\lisse\.gemini\antigravity\brain\e26ea774-2767-44f9-8088-df7845980672\campaign_detail_page_top_1775671759732.png)
<!-- slide -->
![Metrics Tab — Glassmorphic KPI summary cards grid](C:\Users\lisse\.gemini\antigravity\brain\e26ea774-2767-44f9-8088-df7845980672\campaign_metrics_tab_1775671781969.png)
<!-- slide -->
![Budget Tab — Progress bar, financial KPI cards with success/warning colors](C:\Users\lisse\.gemini\antigravity\brain\e26ea774-2767-44f9-8088-df7845980672\campaign_budget_tab_1775671791912.png)
````

---

## 1. Design Philosophy

The SPARK platform follows a **"Flat & Frosted"** glassmorphism aesthetic with these core principles:

| Principle | Description |
|-----------|-------------|
| **Elevated simplicity** | Clean layouts with generous whitespace; no visual clutter |
| **Frosted glass depth** | Subtle `backdrop-blur-xl` layers create depth without heavy shadows |
| **Premium thinness** | Controls are compact (`h-8`, `h-9`) — never bulky or oversized |
| **Micro-interaction polish** | Hover scales, opacity transitions, and color shifts feel alive |
| **Consistent restraint** | A limited palette of brand colors; no ad-hoc or arbitrary colors |

---

## 2. Design Tokens

All values are defined as CSS custom properties in `src/index.css` under `:root` and `.dark`:

### Core Palette Variables (HSL format)

```css
/* Primary brand */
--primary: 231 65% 57%;            /* SPARK Indigo */
--primary-foreground: 0 0% 100%;

/* Surfaces */
--background: 0 0% 100%;           /* light: white */
--card: 0 0% 100%;
--muted: 210 11% 96%;
--accent: 215 25% 95%;

/* Semantic colors */
--destructive: 0 72% 51%;          /* Red — errors, delete */
--success: 231 65% 57%;            /* Alias of primary (no green status in SPARK) */
--warning: 38 92% 50%;             /* Amber — warnings, caution */
--info: 217 91% 60%;               /* Blue — informational */

/* Text hierarchy */
--foreground: 0 0% 9%;
--muted-foreground: 215 14% 44%;

/* SPARK Brand Colors */
--spark-indigo: 231 65% 57%;
--spark-lime: 65 95% 58%;
--spark-purple: 285 100% 67%;
--spark-gray: 0 0% 40%;

/* Borders */
--border: 215 16% 92%;

/* Radius scale */
--radius: 0.75rem;                  /* 12px — default */
--radius-sm: 0.5rem;                /* 8px */
--radius-input: 0.75rem;            /* 12px */
--radius-full: 9999px;              /* pill shape */
```

### Dark Mode Overrides

```css
.dark {
  --background: 0 0% 9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 11%;
  --primary: 235 70% 60%;
  --muted: 215 14% 16%;
  --border: 215 14% 20%;
}
```

---

## 3. Color System

### Semantic Color Usage

| Token | Light Value | Usage |
|-------|-------------|-------|
| `primary` | `hsl(231, 65%, 57%)` | Primary buttons, active tabs, links, brand accents |
| `destructive` | `hsl(0, 72%, 51%)` | Delete buttons, error states, over-budget alerts |
| `success` | `hsl(231, 65%, 57%)` | Alias of `primary` for positive states; no standalone green success UI |
| `warning` | `hsl(38, 92%, 50%)` | Warning thresholds, caution alerts |
| `info` | `hsl(217, 91%, 60%)` | Informational badges, tool tips |
| `muted-foreground` | `hsl(215, 14%, 44%)` | Secondary text, labels, descriptions |

### Alpha / Opacity Patterns

These are used extensively for glassmorphic layering:

| Pattern | Class | Usage |
|---------|-------|-------|
| **Container fill** | `bg-background/40` | Glassmorphic card backgrounds |
| **Container fill (hover)** | `bg-background/60` | Hovered glassmorphic cards |
| **Subtle border** | `border-white/5` | Default frosted borders |
| **Border hover** | `border-white/10` | Hovered frosted borders |
| **Primary tint** | `bg-primary/5` | Selected/editing row background |
| **Primary border (editing)** | `border-primary/20` | Active inline-edit rows |
| **Selection ring** | `ring-primary/30` | Selected checkbox highlight |
| **Destructive tint** | `bg-destructive/5` | Over-budget alert background |

---

## 4. Typography

### Custom Utility Classes (defined in `index.css`)

| Class | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `.text-display-lg` | 2.25rem (36px) | 2.5rem | 700 | Hero titles (rare) |
| `.text-display-md` | 1.875rem (30px) | 2.25rem | 700 | Section display text |
| `.text-display-sm` | 1.5rem (24px) | 2rem | 700 | Page titles, big numbers |
| `.text-heading-lg` | 1.5rem (24px) | 2rem | 600 | Major section headers |
| `.text-heading-md` | 1.25rem (20px) | 1.75rem | 600 | Sub-section headers |
| `.text-heading-sm` | 1.125rem (18px) | 1.75rem | 600 | Card headers, sub-titles |
| `.text-body-lg` | 1.125rem (18px) | 1.75rem | 400 | Large body text |
| `.text-body-md` | 1rem (16px) | 1.5rem | 400 | Default body text |
| `.text-body-sm` | 0.875rem (14px) | 1.25rem | 400 | Compact body text |

### In-Component Typography Patterns

| Context | Classes | Example |
|---------|---------|---------|
| **Page title (H1)** | `text-2xl font-semibold leading-8 text-foreground/90` | "My Campaigns" |
| **Campaign name** | `text-lg font-semibold tracking-tight text-primary truncate min-w-0` | "Tourism Matters Campaign" |
| **Section heading** | `text-heading-sm` | "Budget Overview", "Tasks" |
| **Stat labels** | `text-[10px] uppercase tracking-wider text-muted-foreground` | "Tasks Progress", "Total Budget" |
| **Stat values** | `text-2xl font-semibold text-foreground` | "13/30", "$13.1K" |
| **KPI card label** | `text-xs text-muted-foreground` | "Impressions", "Clicks" |
| **KPI card value** | `text-lg font-semibold` | "273,366" |
| **Table cell text** | `text-sm` | Row data values |
| **Hint/helper text** | `text-xs text-muted-foreground` | Descriptions, date labels |
| **Micro text** | `text-[10px] text-muted-foreground` | Offset indicators, tiny helpers |
| **Monetary values** | `font-mono text-sm` + optional `font-semibold` | "$13,049.67" |

### Semantic Text Colors

```
.text-strong   → hsl(var(--text-strong) / 0.90)  — darkest emphasis
.text-weak     → hsl(var(--text-weak) / 0.65)    — descriptions, labels
.text-brand    → hsl(var(--text-brand))           — primary-colored text
```

---

## 5. Spacing & Layout

### Spacing Scale (CSS Custom Properties)

```css
--spacing-xs:  0.5rem;   /* 8px */
--spacing-sm:  0.75rem;  /* 12px */
--spacing-md:  1rem;     /* 16px */
--spacing-lg:  1.5rem;   /* 24px */
--spacing-xl:  2rem;     /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

### Page Layout Pattern

```
Page Container
├── PageHeader (mb-8)
│   ├── Back button + H1 (flex, gap-3, mb-2)
│   ├── Description (text-base, ml-11, mb-6)
│   └── Stats Card (rounded-[24px], px-8 py-10, mb-6)
└── Content Area
    ├── Section headings (text-heading-sm)
    ├── Filter bar (flex, gap-2 to gap-4)
    └── Data region (space-y-4 or space-y-2)
```

### Common Gap Values

| Context | Gap | Usage |
|---------|-----|-------|
| **Header row actions** | `gap-2` to `gap-3` | Button groups in toolbars |
| **Card grid** | `gap-3` to `gap-6` | Campaign cards, metric cards |
| **Filter bar items** | `gap-2` | Between filter dropdowns/buttons |
| **Table rows** | `space-y-2` | Vertical gaps between data rows |
| **Section spacing** | `space-y-4` | Between major content blocks |
| **Stat label → value** | `gap-3` | Inside overview stat columns |

---

## 6. Border Radii

| Token/Value | Pixels | Usage |
|-------------|--------|-------|
| `rounded-[12px]` | 12px | Data rows (budget line items, inline-edit rows) |
| `rounded-[16px]` | 16px | **Standard** glassmorphic containers, task rows, metric cards |
| `rounded-[17px]` | 17px | Inner card of rainbow-bordered cards (active/completed campaigns) |
| `rounded-[20px]` | 20px | **Large** containers, overview panels, empty states, draft campaign cards. Also used for the rainbow-border outer wrapper |
| `rounded-[24px]` | 24px | Page header stat containers |
| `rounded-full` | pill | Buttons, badges, tabs, checkboxes, avatar rings |
| `rounded-md` | ~6px | Inline button elements (ghost triggers) |
| `rounded-lg` | ~8px | Alert banners, warning cards |
| `rounded-xl` | ~12px | Budget breakdown items |

> [!IMPORTANT]
> **NEVER** use `rounded-sm` or `rounded` (4px/6px) for containers or cards. The minimum for any container is `rounded-[12px]`.

---

## 7. Glassmorphism ("Flat & Frosted")

This is the signature aesthetic. Every card, row, and container should feel like it's floating on frosted glass.

### Standard Glassmorphic Card

```jsx
className="rounded-[16px] border border-white/5 bg-background/40 backdrop-blur-xl
  shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)]
  transition-all duration-300
  hover:bg-background/60 hover:scale-[1.02] hover:border-white/10"
```

### Glassmorphic Row (for task rows, budget items)

```jsx
className="rounded-[16px] border border-white/5 bg-background/40 backdrop-blur-xl
  shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)]
  transition-all duration-300
  hover:bg-background/60 hover:scale-[1.01] hover:border-white/10
  px-4 py-3 cursor-pointer"
```

### Glassmorphic Empty State

```jsx
className="rounded-[20px] border border-white/5 bg-background/40 backdrop-blur-xl
  shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]
  p-12 text-center"
```

### Key Rules

1. **Always use `backdrop-blur-xl`** — never `backdrop-blur-sm` or `backdrop-blur-md`
2. **Background opacity: `bg-background/40`** as default, `bg-background/60` on hover
3. **Border: `border-white/5`** default, `border-white/10` on hover
4. **Inset shadow** is mandatory: `shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)]`
5. **Transitions: `transition-all duration-300`** on all glassmorphic elements

---

## 8. Shadows

| Shadow | Class / Value | Usage |
|--------|---------------|-------|
| **Glassmorphic inset** | `shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)]` | Standard glass cards |
| **Button shadow** | `shadow-sm` | All outline/default buttons |
| **Tab panel shadow** | `shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.04),0px_2px_4px_-2px_rgba(0,0,0,0.08)]` | Floating tab container |
| **Page header container** | `shadow-sm` (default) + `hover:shadow-md` | Stats panel |
| **No shadow** | `!shadow-none` | Ghost buttons, inline triggers |
| **Rainbow border hover** | `box-shadow: 0 8px 24px rgba(0,0,0,0.10)` | Campaign card hover |

> [!CAUTION]
> **Never** use `shadow-lg` or `shadow-xl` in the main UI. These are too heavy for the frosted aesthetic.

---

## 9. Button Hierarchy

All action buttons use a **three-tier height system** that creates visual hierarchy between placement contexts.

### Two-Tier Placement Model

There are two distinct button placement contexts in page layouts:

1. **Header-level buttons** — Buttons placed **inside the rainbow-bordered stats panel** (the tab navigation row). These are taller and more prominent.
2. **Sub-buttons** — Buttons placed **below the header**, in section toolbars (e.g., "Expense Tracker", "Tasks" headings). These are smaller and more compact.

| Tier | Height | Classes | Placement | Examples |
|------|--------|---------|-----------|----------|
| **Header Tabs** | `h-9` (36px) | `h-9 px-4 text-sm font-semibold rounded-[12px]` | Inside rainbow-bordered stat panel | Tasks, Assets, Metrics, Budget, KPIs, Report |
| **Sub-buttons** | `h-8` (32px) | `h-8 shadow-sm` + `size="sm"` | Section toolbars below the header | Edit Budget, Smart Import, Add Item, Export CSV, Sync |
| **Inline editing** | `h-7` (28px) | `h-7 w-7 p-0` | Inside table rows | Check/X confirm/cancel icons |

> [!IMPORTANT]
> Header tabs (`h-9`) must **always** be visually taller than sub-buttons (`h-8`). This 4px difference creates the correct hierarchy where the navigation feels "heavier" than the section-level actions below it.

### Button Variants

| Variant | Classes | Usage |
|---------|---------|-------|
| **Primary CTA** | `variant="default"` + `bg-primary text-primary-foreground h-8 shadow-sm` | "Add Task", "Add Item", "Add Asset" — the most prominent action in a toolbar |
| **Secondary Action** | `variant="outline"` + `size="sm"` + `h-8 shadow-sm` | "Export CSV", "Edit Budget", "Smart Import", "Sync", "Settings" |
| **Header Tab (Active)** | `bg-primary text-primary-foreground h-9 px-4 rounded-[12px] font-semibold border-transparent shadow-sm` | Active tab in the rainbow-bordered panel |
| **Header Tab (Inactive)** | `bg-white/50 backdrop-blur-sm shadow-sm h-9 px-4 rounded-[12px] font-semibold border-transparent` | Inactive tab in the rainbow-bordered panel |
| **Ghost** | `variant="ghost"` + `h-8 !shadow-none` | Inline actions, icon-only buttons, row actions |
| **Ghost (destructive)** | `variant="ghost" size="icon"` + `h-8 w-8 text-destructive opacity-0 group-hover:opacity-100` | Delete buttons (appear on hover) |
| **Link** | `variant="link" size="sm"` | "Add your first item" — in empty states |
| **Inline Save/Cancel** | `variant="ghost" size="sm"` + `h-7 w-7 p-0` | Inline editing confirm/cancel |

> [!WARNING]
> **NEVER** use `h-10`, `h-11`, or `h-12` for action buttons. The `h-8`/`h-9` scale is the legal maximum. Every `<Button>` in a toolbar or section header **must** have an explicit `h-8` or `h-9` class — do not rely on Shadcn defaults.

### Sub-button Pattern (h-8)

```jsx
{/* Outline sub-button — secondary action */}
<Button variant="outline" size="sm" className="h-8 shadow-sm">
  <Settings2 className="h-4 w-4 mr-1" /> Edit Budget
</Button>

{/* Primary sub-button — most prominent action in the toolbar */}
<Button size="sm" className="bg-primary text-primary-foreground h-8 shadow-sm">
  <Plus className="h-4 w-4 mr-1" /> Add Item
</Button>
```

### Header Tab Pattern (h-9)

```jsx
<button
  className={cn(
    'inline-flex items-center gap-1.5 rounded-[12px] h-9 px-4 text-sm font-semibold transition-colors border-transparent shadow-sm',
    'shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.04),0px_2px_4px_-2px_rgba(0,0,0,0.08)]',
    isActive
      ? 'bg-primary text-primary-foreground shadow-md'
      : 'bg-white/50 backdrop-blur-sm hover:bg-white/80'
  )}
>
  <tab.icon className="h-5 w-5" />
  <span className="px-1">{tab.label}</span>
</button>
```

### Icon-Only Button Pattern

```jsx
<Button variant="ghost" size="icon" className="h-8 w-8">
  <ArrowLeft className="h-5 w-5" />
</Button>
```

---

## 10. Badge System

### Badge Sizing Standard

All badges: **`h-6`** (24px), **`px-2.5`**, **`text-xs`**, `rounded-full`, `font-medium`.

If a badge contains an icon, enforce:
- `gap-1.5` between icon and text
- no ad-hoc icon margin classes (base badge already normalizes icon spacing)

### Badge Variants

| Type | Canonical variant / classes | Example |
|------|------------------------------|---------|
| **Status (Active)** | `Badge variant="default"` (`bg-primary text-primary-foreground`) | "Active" |
| **Status (Draft)** | `Badge variant="secondary"` (`bg-muted text-muted-foreground`) | "Draft" |
| **Status (Completed)** | `Badge variant="default"` (`bg-primary text-primary-foreground`) | "Completed" |
| **Status (Paused)** | `Badge variant="secondary" className="bg-warning text-warning-foreground border-transparent"` | "Paused" |
| **Status (Canceled)** | `Badge variant="destructive"` | "Canceled" |
| **Deliverable type** | `Badge variant="default"` (no tinted blue pills) | "Video", "Email" |
| **Asset count** | `Badge variant="secondary" text-xs` | "3 assets" |
| **Estimate/Actual** | `Badge variant="secondary"` / `variant="default"` + `text-xs` | "Estimate" / "Actual" |
| **Source tag** | `Badge variant="outline" text-xs` | "Manual" |
| **Feature badge (Pro)** | `Badge variant="pro"` (`bg-primary text-primary-foreground`) | "Pro" |
| **Notification count** | Red circle, white text, absolute positioned | "32" |

> [!IMPORTANT]
> **Disallowed badge styles:** `bg-success` green badges, `bg-primary/10 text-primary`, `bg-primary/15 text-primary`, or any light-blue fill + blue text badge treatment.

### Campaign Status Badge Color Map (from `CampaignStatusBadge.tsx`)

```typescript
const statusConfig = {
  draft:     { variant: 'secondary', colorClass: '' },
  planning:  { variant: 'secondary', colorClass: 'bg-info text-info-foreground' },
  active:    { variant: 'default',   colorClass: 'bg-primary text-primary-foreground' },
  paused:    { variant: 'secondary', colorClass: 'bg-warning text-warning-foreground' },
  completed: { variant: 'default',   colorClass: 'bg-primary text-primary-foreground' },
  canceled:  { variant: 'destructive', colorClass: '' },
};
```

---

## 11. Cards & Containers

### Campaign List Card (Active/Completed)

Uses the **rainbow border** wrapper:

```jsx
<div className="rainbow-border rounded-[20px] p-[3px]">
  <div className="flex-1 bg-card rounded-[17px] p-6 space-y-4">
    {/* Card content */}
  </div>
</div>
```

### Campaign List Card (Draft)

No rainbow border:

```jsx
<div className="rounded-[20px] bg-muted p-6 space-y-4 border border-border/50">
  {/* Card content */}
</div>
```

### Unified `PageHeader` Component (Single Source of Truth)

> [!IMPORTANT]
> **All** service header panels **must** use the `PageHeader` component from `src/components/spark/PageHeader.tsx`. Do **not** build custom rainbow-bordered stats panels inline.

The `PageHeader` component renders the following structure:

```
[← Back] Service Title
          Description
          {children}  ← slot between title & panel (e.g., campaign name row)
┌─────────────── rainbow-border rounded-[20px] ───────────────┐
│  Stats row (simple stats[] OR customStats ReactNode)    │
│  Action buttons (glassmorphic pills)                    │
│  Quick links                                            │
│  ─────────────── divider (auto) ───────────────────  │
│  Tab navigation (if tabs[] provided)                    │
└─────────────────────────────────────────────────────┘
```

#### Rainbow Panel Dimensions

```jsx
<div className="rainbow-border rounded-[20px] p-[3px] mb-6">
  <div className="w-full bg-card rounded-[17px] transition-all duration-300">
    {/* Stats + actions in px-8 py-10 */}
    {/* Divider + tabs below */}
  </div>
</div>
```

> [!WARNING]
> The inner card **must** include `w-full` because `.rainbow-border` uses `display: flex`. Without it, the gradient bleeds disproportionately on the right side.

#### Simple Stats (Brand Strategy pattern)

Use the `stats` prop for label/value pairs:

```tsx
<PageHeader
  title="Brand Strategy"
  description="Develop comprehensive brand guidelines..."
  backPath="/dashboard"
  stats={[
    { label: 'Progress', value: '1/7' },
    { label: 'Estimated Time', value: '2-3 hours' },
    { label: 'Category', value: 'Strategy' },
    { label: 'Last Updated', value: 'about 22 hours ago' },
  ]}
  progressValue={1}
  progressMax={7}
  showActions
  onDownload={...}
  onEdit={...}
/>
```

Stat label: `text-[10px] uppercase tracking-wider font-medium text-foreground/50`
Stat value: `text-2xl font-semibold tracking-tight text-foreground/90`

> [!TIP]
> **Responsive Stats Layout:** To prevent layout breakage when rendering 4-5 stats, the stats container uses `flex flex-wrap items-center justify-between gap-y-6 md:gap-x-8 lg:gap-x-12 min-w-0`. Avoid hard-coded high gaps (e.g. `gap-16`) that cause wrapping on mid-size screens.

#### Custom Stats + Tabs (Campaign Manager pattern)

Use `customStats` for complex stat layouts and `tabs` for tab navigation:

```tsx
<PageHeader
  title="Campaign Manager"
  description="Manage your campaign tasks and timeline"
  backPath="/campaign-manager"
  customStats={<CampaignOverview campaign={campaign} />}
  tabs={[
    { value: 'tasks', label: 'Tasks', icon: ListTodo },
    { value: 'assets', label: 'Assets', icon: Images },
    { value: 'metrics', label: 'Metrics', icon: Target },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
>
  {/* children: campaign name row between title and rainbow panel */}
  <div className="flex items-center justify-between mb-6">
    <h2>Campaign Name</h2>
  </div>
</PageHeader>
```

#### Tab Button Styling

```
rounded-[12px] h-9 px-4 text-sm font-semibold border-transparent shadow-sm
Active:   bg-primary text-primary-foreground shadow-md
Inactive: bg-white/50 backdrop-blur-sm hover:bg-white/80
Shadow:   shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.04),0px_2px_4px_-2px_rgba(0,0,0,0.08)]
```

#### Action Buttons (Glassmorphic Pills)

```
rounded-[12px] bg-white/50 backdrop-blur-sm shadow-sm
hover:bg-white/80 hover:shadow-md transition-all duration-200
```

### Content Section Card

```jsx
<div className="rounded-[20px] bg-muted/50 border border-border/50 p-6">
  {/* Campaign brief, section content */}
</div>
```

---

## 12. Tables & Data Grids

### Grid Layout Pattern (Budget Tracker)

```jsx
// Column header row
<div className="grid grid-cols-[minmax(120px,1.5fr)_minmax(100px,1fr)_90px_minmax(120px,1.5fr)_minmax(160px,2fr)_minmax(110px,1fr)_minmax(80px,1fr)_60px]
  items-center gap-4 px-4 py-3 mb-2 border-b border-border/50
  text-xs font-medium text-muted-foreground">
```

### Data Row (read mode)

```jsx
className="grid grid-cols-[...] items-center gap-4 px-4 py-3
  rounded-[12px] border border-white/5 bg-background/50
  hover:bg-background/80 transition-colors shadow-sm
  cursor-pointer group"
```

### Data Row (editing mode)

```jsx
className="grid grid-cols-[...] items-center gap-4 px-4 py-2
  rounded-[12px] border border-primary/20 bg-primary/5 shadow-sm"
```

### Row Hover Delete Button

```jsx
<Button variant="ghost" size="sm"
  className="h-7 w-7 p-0 text-destructive opacity-0
    group-hover:opacity-100 transition-opacity"
>
  <Trash2 className="h-3.5 w-3.5" />
</Button>
```

### Table Header Text

```
text-xs font-medium text-muted-foreground
```

---

## 13. Filters & Toolbars

### Anatomy

Every filter bar follows this exact structure, reading left-to-right:

```
┌──────────────────────────────────────────────────────────────┐
│  🔍 Filter icon │ Active pill (white) │ Pill 2 │ Pill 3 …   │
│  (muted)        │ (bg-background)     │ (grey) │ (grey)     │
└──────────────────────────────────────────────────────────────┘
```

### Gold Standard (Budget Tab)

This is the **canonical reference** — all filter bars must match this pattern:

```jsx
<div className="flex items-center gap-2">
  <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
  <Tabs value={filter} onValueChange={setFilter}>
    <TabsList className="text-xs">
      <TabsTrigger value="all" className="text-xs">All (13)</TabsTrigger>
      <TabsTrigger value="estimates" className="text-xs">Estimates (7)</TabsTrigger>
      <TabsTrigger value="actuals" className="text-xs">Actuals (6)</TabsTrigger>
    </TabsList>
  </Tabs>
</div>
```

### Rules (Mandatory)

| # | Rule | Detail |
|---|------|--------|
| 1 | **Filter icon** | `<Filter className="h-4 w-4 text-muted-foreground shrink-0" />` always at the far left |
| 2 | **First pill = white** | The active/selected pill renders with `bg-background text-foreground shadow-sm` (white background). This happens automatically via Shadcn `TabsTrigger`'s `data-[state=active]` class |
| 3 | **Remaining pills = grey** | Inactive pills sit on the `bg-muted` container (the TabsList background), appearing grey |
| 4 | **Font size** | Both `<TabsList>` and every `<TabsTrigger>` must use `text-xs` (12px) |
| 5 | **Pill shape** | TabsTrigger uses `rounded-sm` (inherited from Shadcn defaults). Do NOT override to `rounded-full` |
| 6 | **Counts** | Show counts in parentheses: `All (13)`, `Estimates (7)` |
| 7 | **Container** | Outer wrapper: `<div className="flex items-center gap-2">` |
| 8 | **No extra borders** | Do not add `border`, `shadow`, or `divide` to the filter bar container |

> [!WARNING]
> **DO NOT** use `text-sm` (14px) on filter pills. All filter triggers must be `text-xs` (12px). Using `text-sm` creates a visual mismatch with the compact sub-button tier (`h-8`).

### TabsList-Based Pattern (Simple pill filters)

Used when filters are a fixed set of mutually exclusive options (no dropdown needed):

```jsx
<div className="flex items-center gap-2">
  <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
  <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
    <TabsList className="text-xs">
      {options.map((opt) => (
        <TabsTrigger key={opt.value} value={opt.value} className="text-xs">
          {opt.label} ({counts[opt.value] || 0})
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
</div>
```

**Used in:** `TaskList` (status filter), `BudgetTracker` (all/estimates/actuals), `CampaignAssetsPanel` (asset type filter)

### Select-Based Pattern (Dropdown pill filters with chevron)

Used when a filter has too many options for inline pills, or when selected value needs a dropdown menu. Each `<Select>` renders as a pill-shaped trigger that fits visually inside a `bg-muted` container matching the TabsList look:

```jsx
<div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
  <Filter className="h-4 w-4 text-muted-foreground shrink-0" />

  {/* Outer container mimics TabsList */}
  <div className="inline-flex h-10 items-center rounded-md bg-muted p-1
    text-muted-foreground gap-0.5 shrink-0">

    {/* First Select — always white pill */}
    <Select value={filters.dateRange} onValueChange={handleChange}>
      <SelectTrigger className={tabTriggerCls(true)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All time</SelectItem>
        <SelectItem value="7d">Last 7 days</SelectItem>
        ...
      </SelectContent>
    </Select>

    {/* Subsequent Selects — grey background when inactive */}
    <Select value={filters.metricType || '__all__'} onValueChange={handleChange}>
      <SelectTrigger className={tabTriggerCls(!!filters.metricType)}>
        <SelectValue placeholder="All types" />
      </SelectTrigger>
      <SelectContent>...</SelectContent>
    </Select>
  </div>
</div>
```

#### Dropdown arrow rule

When a filter pill is a `<Select>` (dropdown), Shadcn's `SelectTrigger` **automatically renders a down-arrow chevron** (`▾`). Do NOT manually add a `<ChevronDown>` icon — it's built into the component.

> [!IMPORTANT]
> For dropdown filter pills: **only use `<SelectTrigger>` / `<SelectValue>`**. The built-in chevron is the only allowed arrow indicator. Do not use custom icons or manual arrow glyphs.

#### tabTriggerCls helper function

This function styles a `SelectTrigger` to look identical to a `TabsTrigger`:

```typescript
const tabTriggerCls = (isActive: boolean) =>
  cn(
    // base — matches TabsTrigger defaults
    'inline-flex items-center justify-center whitespace-nowrap rounded-sm',
    'px-3 py-1.5 text-xs font-medium border-0 shadow-none h-8',
    'ring-offset-background transition-all',
    isActive
      ? 'bg-background text-foreground shadow-sm'   // active = white pill
      : 'bg-transparent text-muted-foreground',      // passive = transparent
  );
```

**Used in:** `MetricsFilterBar` (date range, metric type, metric name, channel, origin, per-page)

### Section Toolbar Layout

Section headings (e.g., "Expense Tracker", "Tasks") pair with action buttons on the right:

```jsx
<div className="flex items-center justify-between flex-wrap gap-2">
  <h4 className="text-heading-sm">Section Title</h4>
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm" className="h-8 shadow-sm">Secondary</Button>
    <Button size="sm" className="bg-primary text-primary-foreground h-8 shadow-sm">
      <Plus className="h-4 w-4 mr-1" /> Primary CTA
    </Button>
  </div>
</div>
```

### Implementation Map

| Tab | Component | Filter Type | Options |
|-----|-----------|-------------|---------|
| **Tasks** | `TaskList.tsx` | TabsList pills | All, Incomplete, To Do, In Progress, Done, Cancelled |
| **Assets** | `CampaignAssetsPanel.tsx` | TabsList pills | All, AI Suggested, Manual, Published, Linked, Scheduled, Unscheduled |
| **Budget** | `BudgetTracker.tsx` | TabsList pills | All, Estimates, Actuals |
| **Metrics** | `MetricsFilterBar.tsx` | Select dropdown pills | Date Range, Metric Type, Metric Name, Channel, Origin, Per Page |

---

## 14. Tab Navigation

### Pill-Shaped Segmented Control (Campaign Detail)

Used inside the rainbow-bordered overview panel for major section navigation:

Active tab:
```jsx
<button className="inline-flex items-center gap-1.5 rounded-lg h-9 px-4
  text-sm font-semibold transition-colors
  shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.04),0px_2px_4px_-2px_rgba(0,0,0,0.08)]
  bg-primary text-primary-foreground">
  <Icon className="h-5 w-5" />
  <span className="px-1">Label</span>
</button>
```

Inactive tab:
```jsx
<button className="inline-flex items-center gap-1.5 rounded-lg h-9 px-4
  text-sm font-semibold transition-colors
  shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.04),0px_2px_4px_-2px_rgba(0,0,0,0.08)]
  bg-transparent text-primary border border-primary/80">
  <Icon className="h-5 w-5" />
  <span className="px-1">Label</span>
</button>
```

### Tab Container (Rainbow-Bordered)

The overview stats + tab navigation is now wrapped in a rainbow border:

```jsx
<div className="rainbow-border rounded-[20px] p-[3px] mb-6">
  <div className="w-full bg-card rounded-[17px]">
    {/* Stats section (CampaignOverview) */}
    <div className="flex flex-wrap justify-between px-8 py-6 gap-y-6">...</div>
    {/* Divider */}
    <div className="mx-8"><div className="h-px w-full bg-border" /></div>
    {/* Tab triggers */}
    <div className="flex flex-wrap gap-4 px-8 py-5">
      {tabs.map(tab => <button ...>{tab.label}</button>)}
    </div>
  </div>
</div>
```

---

## 15. Form Controls & Inputs

### Standard Input

```jsx
<Input className="h-8 text-xs" placeholder="..." />
```

### Inline Edit Input (text, appearing on click)

```jsx
<input className="text-sm font-medium bg-transparent border-b border-primary/50
  outline-none text-foreground w-full max-w-md py-0.5" />
```

### Number Input (budget amounts)

```jsx
<Input type="number" min="0" step="0.01"
  className="h-8 text-xs w-full text-right font-mono" />
```

### Select Trigger (in-row)

```jsx
<SelectTrigger className="h-8 text-xs border-transparent bg-transparent
  hover:bg-accent transition-colors !shadow-none">
```

### Date Picker Trigger

```jsx
<Button variant="ghost"
  className="h-8 w-auto min-w-[110px] justify-start text-left font-normal text-xs px-2
    rounded-md hover:bg-accent hover:text-foreground transition-colors !shadow-none
    border border-transparent">
  <CalendarIcon className="h-3.5 w-3.5 mr-1 opacity-50 shrink-0" />
  <span className="truncate">{dateLabel}</span>
</Button>
```

### Checkbox (rounded)

```jsx
<Checkbox className="rounded-full h-5 w-5" />
```

### Switch (inline toggle)

```jsx
<Switch className="scale-75" />
<span className="text-xs text-muted-foreground">{label}</span>
```

---

## 16. Icons

### Icon Library

All icons use **Lucide React** (`lucide-react`).

### Standard Icon Sizes

| Context | Size | Example |
|---------|------|---------|
| **Inline with text** | `h-4 w-4` | Button icons, badge icons |
| **In small buttons** | `h-3.5 w-3.5` | Inline-edit confirm/cancel |
| **In date pickers** | `h-3 w-3` | Calendar icon (compact) |
| **Navigation back** | `h-5 w-5` | Arrow back button |
| **Tooltip info** | `h-3 w-3` | Info circle in metric labels |
| **Status circles** | `h-7 w-7` container, `h-4 w-4` icon | Task status indicators |

### Icon Spacing Rules

- Icon before text in buttons: `mr-1` (tight) or `mr-1.5` (normal)
- Icon in metric labels: `mr-1` with `shrink-0` to prevent wrapping

---

## 17. Empty States

### Standard Empty State

```jsx
<div className="rounded-[20px] border border-white/5 bg-background/40 backdrop-blur-xl
  shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-12 text-center">
  <p className="text-sm text-muted-foreground">No items tracked yet.</p>
  <Button variant="link" size="sm" className="mt-2">
    Add your first item
  </Button>
</div>
```

### Empty State Rules

1. Use `rounded-[20px]` — the larger radius
2. Center text with `text-center` and `p-12` padding
3. Include a CTA link button (`variant="link"`)
4. Apply standard glassmorphic background

---

## 18. Status Indicators & Progress

### Wizard Step Indicators
Used for multi-step workflows like Brand Strategy and Content Calendar. Steps are presented in a left-aligned (`justify-start`), horizontal linear path with flexible maximum gaps (`gap-2 sm:gap-3 md:gap-4 lg:gap-6`) between each step.

| State | Container Styling | Icon | Title ("Step X") | Description |
|-------|-------------------|------|------------------|-------------|
| **Completed** | `bg-primary/5 border-primary/10` | `<Check className="text-primary" />` | `text-foreground` | `text-muted-foreground` |
| **In Progress** | `bg-purple-500/5 border-purple-500/20` | `<InfinityIcon className="text-purple-500" />` | `text-foreground` | `text-primary font-medium` |
| **Current / Active** | `bg-primary/5 border-primary/10` | `<Circle className="text-primary" />` | `text-foreground` | `text-primary font-medium` |
| **Locked** | `bg-primary/5 border-primary/10` | `<Lock className="text-muted-foreground" />` | `text-muted-foreground` | `text-muted-foreground` |

**Typography constraints:** The "Step 1" title requires `whitespace-nowrap shrink-0` to ensure no truncation, while the descriptive label beneath requires `truncate` and `min-w-0` so the layout remains strictly single-line.

### Task Status Icon Config

```typescript
TASK_STATUS_ICON_CONFIG = {
  not_started: { color: 'text-muted-foreground', bgColor: 'bg-muted' },
  in_progress: { color: 'text-primary',          bgColor: 'bg-primary/10' },
  blocked:     { color: 'text-destructive',       bgColor: 'bg-destructive/15' },
  completed:   { color: 'text-primary',           bgColor: 'bg-primary/15' },
  canceled:    { color: 'text-muted-foreground',  bgColor: 'bg-muted' },
};
```

### Status Icon Circle Pattern

```jsx
<div className="flex h-7 w-7 items-center justify-center rounded-full {bgColor}">
  <Icon className="h-4 w-4 {color}" />
</div>
```

### Progress Bar

```jsx
<Progress value={percentage} className="h-2" />       // Thin (stats)
<Progress value={percentage} className="h-3" />       // Normal (budget)
```

### Progress Bar Colors (Budget)

```typescript
const barColor =
  utilization >= criticalThreshold ? 'bg-destructive' :
  utilization >= warningThreshold  ? 'bg-warning' :
                                     'bg-primary';
```

### Alert Banners

```jsx
// Destructive
<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
  <p className="text-sm text-destructive font-medium">⚠️ Over budget by $X</p>
</div>

// Warning
<div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
  <p className="text-sm text-warning font-medium">⚠️ Plan exceeds budget</p>
</div>
```

---

## 19. Hover & Interaction States

### Card/Row Hover

```css
hover:bg-background/60    /* Slightly more opaque */
hover:scale-[1.01]        /* Rows: subtle scale */
hover:scale-[1.02]        /* Cards: slightly more */
hover:border-white/10     /* Border becomes visible */
```

### Button Hover (Outline)

```css
hover:bg-white/80
hover:shadow-md
```

### Delete Button (reveal on hover)

```css
opacity-0 group-hover:opacity-100 transition-opacity
```

### Transition Standard

```css
transition-all duration-300     /* Cards, rows */
transition-colors               /* Buttons, inline triggers */
transition-opacity              /* Reveal-on-hover elements */
```

### Selected State

```css
ring-1 ring-primary/30 bg-primary/5
```

### Drag-Over State

```css
border-primary border-dashed bg-primary/5
```

---

## 20. Page Headers

### Standard Page Header

```jsx
<div className="mb-8">
  <div className="flex items-center gap-3 mb-2">
    {backPath && (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <ArrowLeft className="h-5 w-5" />
      </Button>
    )}
    <h1 className="text-2xl font-semibold leading-8 text-foreground/90">{title}</h1>
  </div>
  {description && (
    <p className="text-base leading-6 text-weak mb-6 ml-11">{description}</p>
  )}
</div>
```

### Header with Stats Panel (Rainbow-Bordered)

```jsx
<div className="rainbow-border rounded-[24px] p-[3px] mb-6">
  <div className="w-full bg-card rounded-[21px] px-8 py-10 transition-all duration-300">
    <div className="flex flex-wrap items-start gap-16 mb-10">
      {stats.map(stat => (
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest font-medium text-foreground/50">
            {stat.label}
          </span>
          <span className="text-3xl font-semibold tracking-tight text-foreground/90">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  </div>
</div>
```

---

## 21. Rainbow Border (Brand Accent)

Used for **campaign cards**, **page header stats panels**, and **campaign detail overview/tabs containers**:

```css
.rainbow-border {
  display: flex;
  background: linear-gradient(135deg,
    hsl(231, 65%, 57%) 0%,      /* SPARK Indigo */
    hsl(65, 95%, 58%) 25%,       /* SPARK Lime */
    hsl(285, 100%, 67%) 50%,     /* SPARK Purple */
    hsl(231, 65%, 57%) 75%,
    hsl(0, 0%, 40%) 100%);       /* SPARK Gray */
  background-size: 300% 300%;
  animation: rainbowShift 8s ease infinite;
  border-radius: 20px;
  padding: 3px;
}

.rainbow-border:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10);
}
```

### Rainbow Border Usage Map

| Context | Outer Radius | Inner Radius | Inner Background |
|---------|-------------|-------------|------------------|
| **Campaign cards** | `rounded-[20px]` | `rounded-[17px]` | `bg-card` |
| **PageHeader stats panel** | `rounded-[24px]` | `rounded-[21px]` | `bg-card` |
| **CampaignDetail overview/tabs** | `rounded-[20px]` | `rounded-[17px]` | `bg-card` |

> [!TIP]
> The inner radius is always **outer radius − 3px** to account for the `p-[3px]` padding of the rainbow wrapper.

### Rainbow Card Inner

```jsx
<div className="w-full bg-card rounded-[17px] p-6 space-y-4">
  {/* Content here — 17px inner to nest flush inside 20px outer with 3px padding */}
</div>
```

> [!CAUTION]
> **Always** include `w-full` (or `flex-1`) on the inner card. The `.rainbow-border` class uses `display: flex`, so without explicit width the inner content won't fill the container, causing the gradient border to appear unevenly thick on the right side.

---

## 22. Inline Editing Patterns

### Editable Title (click-to-edit)

**Display mode:**
```jsx
<span className="text-sm font-medium text-foreground truncate cursor-text
  hover:border-b hover:border-muted-foreground/30">
  {title}
</span>
```

**Edit mode:**
```jsx
<input className="text-sm font-medium bg-transparent border-b border-primary/50
  outline-none text-foreground w-full max-w-md py-0.5" />
```

### Editable Row (click-to-edit / double-click)

**Read mode row:** standard glassmorphic row with `cursor-pointer group`
**Edit mode row:** `border border-primary/20 bg-primary/5 shadow-sm` — all fields become inputs

### Inline Action Buttons (Save / Cancel)

```jsx
<div className="flex justify-end gap-1">
  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-primary">
    <Check className="h-3.5 w-3.5" />
  </Button>
  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
    <X className="h-3.5 w-3.5" />
  </Button>
</div>
```

---

## 23. Component Quick-Reference Table

| Component | Radius | Background | Border | Shadow | Height |
|-----------|--------|------------|--------|--------|--------|
| **Glass Card (metric/KPI)** | `16px` | `bg-background/40 backdrop-blur-xl` | `border-white/5` | Inset glass | — |
| **Glass Row (task/budget)** | `16px` | `bg-background/40 backdrop-blur-xl` | `border-white/5` | Inset glass | — |
| **Data Row (budget table)** | `12px` | `bg-background/50` | `border-white/5` | `shadow-sm` | — |
| **Edit Row** | `12px` | `bg-primary/5` | `border-primary/20` | `shadow-sm` | — |
| **Empty State** | `20px` | `bg-background/40 backdrop-blur-xl` | `border-white/5` | Inset only | — |
| **Campaign Card (active)** | `20px`/`17px` | Rainbow + `bg-card` | Rainbow gradient | Rainbow hover | — |
| **Campaign Card (draft)** | `20px` | `bg-muted` | `border-border/50` | None | — |
| **PageHeader Panel** | `20px`/`17px` | Rainbow + `bg-card` | Rainbow gradient | Rainbow hover | — |
| **Primary Button** | `full` | `bg-primary` | Auto | `shadow-sm` | `h-9` |
| **Outline Button** | `full` | Transparent | Border | `shadow-sm` | `h-8` |
| **Ghost Button** | Varies | Transparent | None | `!shadow-none` | `h-8` |
| **Inline Action Button** | — | Transparent | None | None | `h-7` |
| **Badge (status)** | `full` | Primary/muted/warning/destructive | None | None | `h-6` |
| **Badge (type tag)** | `full` | `bg-primary` (or `outline` for neutral source tags) | None | None | `h-6` |
| **Select Trigger (filter)** | `full` | Transparent | `border-white/10` | None | `h-8` |
| **Select Trigger (inline)** | Default | Transparent | Transparent | `!shadow-none` | `h-8` |
| **Input (form)** | Default | Default | Default | Default | `h-8` |
| **Checkbox** | `full` | — | — | — | `h-5 w-5` |

---

## 24. Enforcement Rules & QA Checklist

### Non-negotiables

1. **Use shared primitives only**: `Badge` from `src/components/ui/badge.tsx` is mandatory. Do not create custom badge `<span>` styles in feature files.
2. **No green success UI**: Positive and completed states use primary blue (`bg-primary text-primary-foreground`), not green.
3. **No tinted-blue badges**: Do not use `bg-primary/10 text-primary` or `bg-primary/15 text-primary` for badges.
4. **Role/admin/status consistency**: Reuse shared wrappers (`RoleBadge`, `CampaignStatusBadge`) where available.
5. **Size lock**: Badge height remains `h-6`; do not create alternate badge heights unless this guide is explicitly revised.

### Pull Request checklist (required)

- [ ] New badges use `Badge` variants; no inline custom badge classes.
- [ ] Badge icon spacing matches canonical style (`gap-1.5`; no icon margin hacks).
- [ ] Positive/completed states use primary blue, not green.
- [ ] "Pro" and feature badges are solid primary blue with white text.
- [ ] No `bg-primary/10 text-primary` or `bg-primary/15 text-primary` badge styling introduced.
- [ ] Changes validated visually in impacted pages before merge.

### Fast regression scan commands

Use ripgrep before merging style-related PRs:

```bash
rg "bg-green|text-green|border-green" src
rg "bg-primary/10 text-primary|bg-primary/15 text-primary" src
rg "<span[^>]*badge|className=.*rounded-full.*text-xs" src
```

---

## Appendix: File Reference

| File | Role |
|------|------|
| [index.css](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/index.css) | Design tokens, custom utilities, animations |
| [constants.ts](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/lib/constants.ts) | Status types, icon configs, color maps, badge maps |
| [PageHeader.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/spark/PageHeader.tsx) | Reusable page header with stats |
| [CampaignCard.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/campaigns/CampaignCard.tsx) | Campaign list card (rainbow + draft variants) |
| [CampaignStatusBadge.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/campaigns/CampaignStatusBadge.tsx) | Status badge color mapping |
| [CampaignOverview.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/campaigns/CampaignOverview.tsx) | Detail page overview stats panel |
| [MetricsFilterBar.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/campaigns/MetricsFilterBar.tsx) | Glassmorphic filter bar pattern |
| [MetricsSummaryCards.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/campaigns/MetricsSummaryCards.tsx) | KPI summary cards grid |
| [MetricsTable.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/campaigns/MetricsTable.tsx) | Complex data table with inline editing |
| [TaskList.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/campaigns/TaskList.tsx) | Task management with filters, drag-drop |
| [TaskRow.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/campaigns/TaskRow.tsx) | Individual task row pattern |
| [BudgetOverviewCard.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/campaigns/BudgetOverviewCard.tsx) | Budget KPI cards with tooltips |
| [BudgetTracker.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/components/campaigns/BudgetTracker.tsx) | Budget table with inline editing |
| [CampaignManager.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/pages/CampaignManager.tsx) | Campaign list page layout |
| [CampaignDetail.tsx](file:///c:/Users/lisse/SPARK-SAAS/story-dev/src/pages/CampaignDetail.tsx) | Campaign detail page with tab nav |

---

> **This document is the single source of truth.** When developing new features or refactoring existing services, always cross-reference this guide to ensure visual consistency across the entire SPARK platform.

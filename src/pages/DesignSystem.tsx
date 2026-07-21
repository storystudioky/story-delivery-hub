import { useMemo, useState, type ReactNode } from "react";
import {
  Briefcase,
  Building2,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Moon,
  Plus,
  Settings,
  Sun,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import { useTheme } from "next-themes";

import { AccessDeniedState } from "@/components/hub/AccessDeniedState";
import { CommercialSummaryCard } from "@/components/hub/CommercialSummaryCard";
import { EmptyState } from "@/components/hub/EmptyState";
import { EntityCard } from "@/components/hub/EntityCard";
import { ErrorState } from "@/components/hub/ErrorState";
import { FilterToolbar } from "@/components/hub/FilterToolbar";
import { HubAppShell } from "@/components/hub/HubAppShell";
import { HubPageHeader } from "@/components/hub/HubPageHeader";
import { KpiCard } from "@/components/hub/KpiCard";
import { LoadingState } from "@/components/hub/LoadingState";
import { LockedReportBanner } from "@/components/hub/LockedReportBanner";
import { ReportSection } from "@/components/hub/ReportSection";
import { ResponsiveDataTable } from "@/components/hub/ResponsiveDataTable";
import { AccountControls, TenantSwitcher } from "@/components/hub/ShellControls";
import { TaskQuickEditDrawer } from "@/components/hub/TaskQuickEditDrawer";
import { TaskRow } from "@/components/hub/TaskRow";
import { WorkstreamCard } from "@/components/hub/WorkstreamCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AttentionBadge,
  ContractStatusBadge,
  RoleStatusBadge,
  TaskStatusBadge,
} from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { HubNavItem } from "@/components/hub/HubSidebar";
import {
  ATTENTION_LEVEL_VALUES,
  CONTRACT_STATUS_VALUES,
  ROLE_BADGE_VALUES,
  TASK_STATUS_VALUES,
  type AttentionLevel,
  type TaskStatus,
} from "@/lib/status-variants";

interface DemoRow {
  id: string;
  deliverable: string;
  owner: string;
  status: string;
}

interface DemoTask {
  id: string;
  title: string;
  status: TaskStatus;
  attention: AttentionLevel;
  ownerId: string;
  ownerLabel: string;
  dueDate: string;
  dueDateIso: string;
  latestUpdate: string;
  attentionNote: string;
  waitingOn: string;
  waitingExplanation: string;
  primarySourceUrl?: string;
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card id={id} className="scroll-mt-24">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      rounded="full"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

const PRODUCT_NAV: HubNavItem[] = [
  { href: "#overview", label: "Overview", icon: LayoutDashboard },
  { href: "#internal", label: "Internal", icon: Building2 },
  { href: "#vendors", label: "Vendors", icon: Users },
  { href: "#contracts", label: "Contracts", icon: Briefcase },
  { href: "#workstreams", label: "Workstreams", icon: Target },
  { href: "#reports", label: "Reports", icon: FileText },
  { href: "#tools", label: "Tools", icon: Wrench },
  { href: "#settings", label: "Settings", icon: Settings },
];

const DEV_NAV: HubNavItem[] = [
  { href: "/design-system", label: "Design system", icon: FlaskConical },
];

const OWNER_OPTIONS = [
  { value: "alex", label: "Alex Rivera" },
  { value: "jordan", label: "Jordan Lee" },
  { value: "sam", label: "Sam Okonkwo" },
];

const DEMO_ROWS: DemoRow[] = [
  { id: "1", deliverable: "Kickoff brief", owner: "Alex Rivera", status: "Complete" },
  { id: "2", deliverable: "Creative concepts", owner: "Jordan Lee", status: "In progress" },
  { id: "3", deliverable: "Final package", owner: "Sam Okonkwo", status: "Waiting" },
];

const INITIAL_TASKS: DemoTask[] = [
  {
    id: "t1",
    title: "Confirm delivery milestones",
    status: "not_started",
    attention: "on_track",
    ownerId: "alex",
    ownerLabel: "Alex Rivera",
    dueDate: "Jul 24",
    dueDateIso: "2026-07-24",
    latestUpdate: "Awaiting kickoff confirmation.",
    attentionNote: "",
    waitingOn: "",
    waitingExplanation: "",
    primarySourceUrl: "https://example.com/source/milestones",
  },
  {
    id: "t2",
    title: "Review commercial summary",
    status: "in_progress",
    attention: "needs_attention",
    ownerId: "jordan",
    ownerLabel: "Jordan Lee",
    dueDate: "Jul 22",
    dueDateIso: "2026-07-22",
    latestUpdate: "CI$ variance needs manager review.",
    attentionNote: "Budget utilization crossed the attention threshold.",
    waitingOn: "",
    waitingExplanation: "",
    primarySourceUrl: "https://example.com/source/commercial",
  },
  {
    id: "t3",
    title: "Vendor asset handoff",
    status: "waiting",
    attention: "on_track",
    ownerId: "sam",
    ownerLabel: "Sam Okonkwo",
    dueDate: "Jul 28",
    dueDateIso: "2026-07-28",
    latestUpdate: "Waiting on final files from studio.",
    attentionNote: "",
    waitingOn: "Northwind Studio",
    waitingExplanation: "Final motion package expected by Friday.",
    primarySourceUrl: "https://example.com/source/vendor-handoff",
  },
  {
    id: "t4",
    title: "Pause seasonal campaign prep",
    status: "on_hold",
    attention: "late_off_track",
    ownerId: "alex",
    ownerLabel: "Alex Rivera",
    dueDate: "Jul 10",
    dueDateIso: "2026-07-10",
    latestUpdate: "Paused pending brand decision.",
    attentionNote: "Decision overdue by one week.",
    waitingOn: "",
    waitingExplanation: "",
  },
  {
    id: "t5",
    title: "Send weekly status note",
    status: "complete",
    attention: "on_track",
    ownerId: "jordan",
    ownerLabel: "Jordan Lee",
    dueDate: "Jul 18",
    dueDateIso: "2026-07-18",
    latestUpdate: "Sent to stakeholders.",
    attentionNote: "",
    waitingOn: "",
    waitingExplanation: "",
    primarySourceUrl: "https://example.com/source/status-note",
  },
];

/**
 * Development-only design-system reference page.
 * Demonstrates Delivery Hub tokens, primitives, and hub patterns with mock data only.
 */
export function DesignSystemPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>("t2");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mutableTasks, setMutableTasks] = useState(() => [...INITIAL_TASKS]);

  const selectedTask = useMemo(
    () => mutableTasks.find((task) => task.id === selectedTaskId) ?? mutableTasks[0],
    [mutableTasks, selectedTaskId],
  );

  const colorSwatches = [
    { name: "Primary", className: "bg-primary" },
    { name: "Secondary", className: "bg-secondary border" },
    { name: "Muted", className: "bg-muted border" },
    { name: "Destructive", className: "bg-destructive" },
    { name: "Warning", className: "bg-warning" },
    { name: "Hub indigo", className: "bg-hub-indigo" },
    { name: "Hub lime", className: "bg-hub-lime" },
    { name: "Hub purple", className: "bg-hub-purple" },
  ];

  return (
    <HubAppShell
      navItems={PRODUCT_NAV}
      developmentNavItems={DEV_NAV}
      currentPath="/design-system"
      brandLabel="Delivery Hub"
      tenantSwitcherSlot={<TenantSwitcher tenantName="Acme Media Tenant" />}
      accountControlsSlot={
        <AccountControls displayName="Alex Rivera" roleLabel="Tenant administrator" />
      }
      themeToggleSlot={<ThemeToggle />}
      onNavigate={(href) => {
        if (href.startsWith("#")) {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      <div className="mx-auto max-w-6xl space-y-8 pb-16">
        <HubPageHeader
          title="Design system"
          description="Delivery Hub visual foundation adapted from the recorded SPARK baseline. Development reference only — not part of production navigation."
          stats={[
            { label: "Primitives", value: "UI + Hub" },
            { label: "Modes", value: "Light / Dark" },
            { label: "Baseline", value: "679fe119" },
          ]}
          actions={
            <Button variant="cta" size="sm" onClick={() => setDrawerOpen(true)}>
              <Plus className="h-4 w-4" />
              Open task drawer
            </Button>
          }
        />

        <Tabs defaultValue="foundation" className="space-y-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="foundation">Foundation</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="patterns">Hub patterns</TabsTrigger>
            <TabsTrigger value="shell">Shell & states</TabsTrigger>
          </TabsList>

          <TabsContent value="foundation" className="space-y-6">
            <Section id="tokens" title="Tokens & typography" description="Inherited SPARK colour intent with Delivery Hub aliases.">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {colorSwatches.map((swatch) => (
                  <div key={swatch.name} className="space-y-2">
                    <div className={`h-14 rounded-lg ${swatch.className}`} />
                    <p className="text-xs text-muted-foreground">{swatch.name}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 rounded-lg border bg-card p-4">
                <p className="text-display-sm">Display sm</p>
                <p className="text-heading-md">Heading md</p>
                <p className="text-body-md text-body-strong">Body strong</p>
                <p className="text-body-sm text-body-weak">Body weak supporting copy</p>
              </div>
            </Section>

            <Section id="buttons" title="Buttons">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="cta">CTA</Button>
                <Button variant="link">Link</Button>
              </div>
            </Section>

            <Section id="badges" title="Badges & semantic states" description="Central PRD vocabulary with visible text labels.">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {TASK_STATUS_VALUES.map((status) => (
                    <TaskStatusBadge key={status} status={status} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {ATTENTION_LEVEL_VALUES.map((level) => (
                    <AttentionBadge key={level} level={level} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {CONTRACT_STATUS_VALUES.map((status) => (
                    <ContractStatusBadge key={status} status={status} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {ROLE_BADGE_VALUES.map((role) => (
                    <RoleStatusBadge key={role} role={role} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="locked">Locked</Badge>
                </div>
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="controls" className="space-y-6">
            <Section id="forms" title="Form controls">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="demo-input">Input</Label>
                  <Input id="demo-input" placeholder="Client name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demo-notes">Textarea</Label>
                  <Textarea id="demo-notes" placeholder="Notes" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="demo-check" />
                  <Label htmlFor="demo-check">Include archived</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="demo-switch" />
                  <Label htmlFor="demo-switch">Notify stakeholders</Label>
                </div>
                <RadioGroup defaultValue="a" className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="a" id="r-a" />
                    <Label htmlFor="r-a">Option A</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="b" id="r-b" />
                    <Label htmlFor="r-b">Option B</Label>
                  </div>
                </RadioGroup>
                <div className="space-y-2">
                  <Label>Progress</Label>
                  <Progress value={62} />
                </div>
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Section id="overview" title="KPI & commercial cards">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard label="Open tasks" value="12" icon={Target} hint="Across active contracts" />
                <KpiCard label="Needs attention" value="2" icon={FileText} hint="Requires note" />
                <KpiCard label="On track" value="8" />
                <KpiCard label="Complete" value="24" />
              </div>
              <CommercialSummaryCard
                title="Contract commercial summary"
                rows={[
                  { label: "Contract KYD", value: "KYD 48,000" },
                  { label: "Invoiced CI$", value: "CI$ 22,400" },
                  { label: "Remaining CI$", value: "CI$ 25,600" },
                ]}
                progressValue={47}
                progressLabel="Utilization"
              />
            </Section>

            <Section id="workstreams" title="Workstream & entity cards">
              <div className="grid gap-3 lg:grid-cols-2">
                <WorkstreamCard
                  title="Launch readiness"
                  summary="Creative, media, and measurement milestones."
                  owner="Jordan Lee"
                  status="in_progress"
                  attention="needs_attention"
                  progressLabel="62%"
                  icon={Target}
                />
                <EntityCard
                  title="Northwind Studio"
                  subtitle="Preferred motion vendor"
                  meta="Active retainer · 3 open deliverables"
                  badgeLabel="Vendor"
                  icon={Users}
                />
              </div>
            </Section>

            <Section id="filters-table" title="Filters & responsive table">
              <FilterToolbar
                filters={[
                  {
                    key: "status",
                    placeholder: "Status",
                    value: statusFilter,
                    onChange: setStatusFilter,
                    options: [
                      { value: "all", label: "All statuses" },
                      { value: "waiting", label: "Waiting" },
                      { value: "on_hold", label: "On hold" },
                      { value: "complete", label: "Complete" },
                    ],
                  },
                  {
                    key: "owner",
                    placeholder: "Owner",
                    value: ownerFilter,
                    onChange: setOwnerFilter,
                    options: [
                      { value: "all", label: "All owners" },
                      { value: "alex", label: "Alex Rivera" },
                      { value: "jordan", label: "Jordan Lee" },
                    ],
                  },
                ]}
              />
              <ResponsiveDataTable
                rows={DEMO_ROWS}
                getRowKey={(row) => row.id}
                columns={[
                  {
                    key: "deliverable",
                    header: "Deliverable",
                    isPrimary: true,
                    render: (row) => row.deliverable,
                  },
                  { key: "owner", header: "Owner", render: (row) => row.owner },
                  { key: "status", header: "Status", render: (row) => row.status },
                ]}
              />
            </Section>

            <Section id="tasks" title="Task rows & drawer">
              <div className="space-y-2">
                {mutableTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    title={task.title}
                    status={task.status}
                    attention={task.attention}
                    owner={task.ownerLabel}
                    dueDate={task.dueDate}
                    primarySourceUrl={task.primarySourceUrl}
                    selected={selectedTaskId === task.id}
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setDrawerOpen(true);
                    }}
                  />
                ))}
              </div>
            </Section>

            <Section id="reports" title="Report sections">
              <LockedReportBanner
                label="Immutable report snapshot"
                description="This weekly delivery snapshot is locked. Values reflect the sealed point-in-time export and cannot be edited."
              />
              <ReportSection title="Weekly delivery narrative">
                <p className="text-sm text-muted-foreground">
                  Mock report body demonstrating ReportSection composition. No live reporting logic is wired here.
                </p>
              </ReportSection>
            </Section>

            <Section id="contracts" title="Contracts & vendors (anchors)">
              <p className="text-sm text-muted-foreground">
                Navigation destinations for Contracts, Vendors, Internal, Tools, and Settings are demonstrated in the
                shell. Feature CRUD arrives in later steps.
              </p>
            </Section>
          </TabsContent>

          <TabsContent value="shell" className="space-y-6">
            <Section
              id="navigation"
              title="Desktop & mobile navigation"
              description="Authoritative product navigation is shown in the left sidebar. Design system sits in a separated Development section. On mobile, open the header menu to use the sheet navigation."
            >
              <p className="text-sm text-muted-foreground">
                Header demonstrates tenant switcher, account controls, and theme toggle. Resize below `md` to exercise
                the mobile sheet.
              </p>
            </Section>

            <Section id="internal" title="Loading, empty, error, and access-denied">
              <div className="grid gap-4 lg:grid-cols-2">
                <LoadingState />
                <EmptyState
                  title="No deliverables yet"
                  description="When work is assigned, it will appear here."
                  actionLabel="Create deliverable"
                  onAction={() => undefined}
                />
                <ErrorState
                  title="Unable to load contract view"
                  description="The request failed. Retry, or contact your tenant administrator."
                  actionLabel="Retry"
                  onAction={() => undefined}
                />
                <AccessDeniedState
                  title="Access denied"
                  description="You need contributor access or higher to view this contract."
                />
              </div>
            </Section>

            <Section id="tools" title="Tools">
              <p className="text-sm text-muted-foreground">Placeholder for Tools destination demonstration.</p>
            </Section>

            <Section id="settings" title="Settings">
              <p className="text-sm text-muted-foreground">Placeholder for Settings destination demonstration.</p>
            </Section>

            <Section id="vendors" title="Vendors">
              <EntityCard
                title="Northwind Studio"
                subtitle="Motion and finishing"
                badgeLabel="Preferred"
                icon={Users}
              />
            </Section>
          </TabsContent>
        </Tabs>
      </div>

      {selectedTask ? (
        <TaskQuickEditDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          taskTitle={selectedTask.title}
          ownerOptions={OWNER_OPTIONS}
          primarySourceUrl={selectedTask.primarySourceUrl}
          initialValues={{
            status: selectedTask.status,
            attention: selectedTask.attention,
            ownerId: selectedTask.ownerId,
            dueDate: selectedTask.dueDateIso,
            latestUpdate: selectedTask.latestUpdate,
            attentionNote: selectedTask.attentionNote,
            waitingOn: selectedTask.waitingOn,
            waitingExplanation: selectedTask.waitingExplanation,
          }}
          onSave={(values) => {
            const ownerLabel =
              OWNER_OPTIONS.find((option) => option.value === values.ownerId)?.label ?? selectedTask.ownerLabel;
            setMutableTasks((current) =>
              current.map((task) =>
                task.id === selectedTask.id
                  ? {
                      ...task,
                      status: values.status,
                      attention: values.attention,
                      ownerId: values.ownerId,
                      ownerLabel,
                      dueDateIso: values.dueDate,
                      dueDate: values.dueDate,
                      latestUpdate: values.latestUpdate,
                      attentionNote: values.attentionNote,
                      waitingOn: values.waitingOn,
                      waitingExplanation: values.waitingExplanation,
                    }
                  : task,
              ),
            );
          }}
        />
      ) : null}
    </HubAppShell>
  );
}

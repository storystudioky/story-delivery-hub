import { useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  FileText,
  FolderKanban,
  Home,
  Moon,
  Plus,
  Sun,
  Target,
} from "lucide-react";
import { useTheme } from "next-themes";

import { AccessDeniedState } from "@/components/hub/AccessDeniedState";
import { CommercialSummaryCard } from "@/components/hub/CommercialSummaryCard";
import { EmptyState } from "@/components/hub/EmptyState";
import { FilterToolbar } from "@/components/hub/FilterToolbar";
import { HubAppShell } from "@/components/hub/HubAppShell";
import { HubPageHeader } from "@/components/hub/HubPageHeader";
import { KpiCard } from "@/components/hub/KpiCard";
import { LoadingState } from "@/components/hub/LoadingState";
import { LockedReportBanner } from "@/components/hub/LockedReportBanner";
import { ReportSection } from "@/components/hub/ReportSection";
import { ResponsiveDataTable } from "@/components/hub/ResponsiveDataTable";
import { TaskQuickEditDrawer } from "@/components/hub/TaskQuickEditDrawer";
import { TaskRow } from "@/components/hub/TaskRow";
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
  type TaskStatus,
} from "@/lib/status-variants";

interface DemoRow {
  id: string;
  deliverable: string;
  owner: string;
  status: string;
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

const DEMO_NAV: HubNavItem[] = [
  { href: "/design-system", label: "Design system", icon: Home },
  { href: "#overview", label: "Overview", icon: BarChart3 },
  { href: "#tasks", label: "Tasks", icon: FolderKanban },
  { href: "#reports", label: "Reports", icon: FileText },
];

const DEMO_ROWS: DemoRow[] = [
  { id: "1", deliverable: "Kickoff brief", owner: "Alex", status: "Done" },
  { id: "2", deliverable: "Creative concepts", owner: "Jordan", status: "In progress" },
  { id: "3", deliverable: "Final package", owner: "Sam", status: "To do" },
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
  const [mutableTasks, setMutableTasks] = useState(() => [
    { id: "t1", title: "Confirm delivery milestones", status: "todo" as TaskStatus, dueDate: "Jul 24" },
    { id: "t2", title: "Review commercial summary", status: "in_progress" as TaskStatus, dueDate: "Jul 22" },
    { id: "t3", title: "Send weekly status note", status: "done" as TaskStatus, dueDate: "Jul 18" },
    { id: "t4", title: "Archive superseded draft", status: "cancelled" as TaskStatus, dueDate: "Jul 10" },
  ]);

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
      navItems={DEMO_NAV}
      currentPath="/design-system"
      brandLabel="Delivery Hub"
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
          description="Delivery Hub visual foundation adapted from the recorded SPARK baseline. Development reference only — not exposed in production navigation."
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

            <Section id="badges" title="Badges & semantic states" description="Central variants with visible text labels.">
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
                <KpiCard label="At risk" value="2" icon={FileText} hint="Needs attention" />
                <KpiCard label="On track" value="8" />
                <KpiCard label="Completed" value="24" />
              </div>
              <CommercialSummaryCard
                title="Contract commercial summary"
                rows={[
                  { label: "Contract value", value: "$48,000" },
                  { label: "Invoiced", value: "$22,400" },
                  { label: "Remaining", value: "$25,600" },
                ]}
                progressValue={47}
                progressLabel="Utilization"
              />
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
                      { value: "open", label: "Open" },
                      { value: "done", label: "Done" },
                    ],
                  },
                  {
                    key: "owner",
                    placeholder: "Owner",
                    value: ownerFilter,
                    onChange: setOwnerFilter,
                    options: [
                      { value: "all", label: "All owners" },
                      { value: "alex", label: "Alex" },
                      { value: "jordan", label: "Jordan" },
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
                    dueDate={task.dueDate}
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
                label="Report locked"
                description="Commercial detail is locked until the contract is activated."
              />
              <ReportSection title="Weekly delivery narrative">
                <p className="text-sm text-muted-foreground">
                  Mock report body demonstrating ReportSection composition. No live reporting logic is wired here.
                </p>
              </ReportSection>
            </Section>
          </TabsContent>

          <TabsContent value="shell" className="space-y-6">
            <Section
              id="navigation"
              title="Desktop & mobile navigation"
              description="This page is already wrapped in HubAppShell. On desktop, use the left sidebar. On mobile, open the header menu to use the sheet navigation."
            >
              <p className="text-sm text-muted-foreground">
                Resize the viewport below the `md` breakpoint to exercise the mobile sheet. Light and dark modes use the
                header toggle.
              </p>
            </Section>

            <Section id="states" title="Loading, empty, and access-denied">
              <div className="grid gap-4 lg:grid-cols-3">
                <LoadingState />
                <EmptyState
                  title="No deliverables yet"
                  description="When work is assigned, it will appear here."
                  actionLabel="Create deliverable"
                  onAction={() => undefined}
                />
                <AccessDeniedState
                  title="Access denied"
                  description="You need contributor access or higher to view this contract board."
                />
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </div>

      {selectedTask ? (
        <TaskQuickEditDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          initialValues={{
            title: selectedTask.title,
            status: selectedTask.status,
            notes: "",
          }}
          onSave={(values) => {
            setMutableTasks((current) =>
              current.map((task) =>
                task.id === selectedTask.id
                  ? { ...task, title: values.title, status: values.status }
                  : task,
              ),
            );
          }}
        />
      ) : null}
    </HubAppShell>
  );
}

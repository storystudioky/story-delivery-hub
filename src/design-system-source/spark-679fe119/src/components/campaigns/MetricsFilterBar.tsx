import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter } from 'lucide-react';
import { SUPPORTED_METRICS, METRIC_CATEGORIES } from '@/lib/metrics-constants';
import type { MetricRow } from '@/hooks/useMetrics';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

export interface MetricFilters {
  dateRange: 'all' | '7d' | '30d' | '90d' | 'custom';
  customStart?: Date;
  customEnd?: Date;
  metricName: string;
  channel: string;
  origin: string;
  metricType: '' | 'earned' | 'paid' | 'content';
  sortBy: string;
  sortDir: 'asc' | 'desc';
  perPage: number;
}

interface Props {
  filters: MetricFilters;
  onFiltersChange: (f: MetricFilters) => void;
  channels: string[];
  origins?: string[];
}

export const DEFAULT_FILTERS: MetricFilters = {
  dateRange: 'all',
  metricName: '',
  channel: '',
  origin: '',
  metricType: '',
  sortBy: 'created_at',
  sortDir: 'desc',
  perPage: 25,
};

export function applyDateFilter(metrics: MetricRow[], filters: MetricFilters): MetricRow[] {
  if (filters.dateRange === 'all') return metrics;
  const now = new Date();
  let start: Date;
  let end = now;

  if (filters.dateRange === 'custom') {
    start = filters.customStart || now;
    end = filters.customEnd || now;
  } else {
    const days = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90;
    start = subDays(now, days);
  }

  return metrics.filter(m => {
    const d = new Date(m.created_at);
    return d >= start && d <= end;
  });
}

/** Renders a SelectTrigger styled exactly like a TabsTrigger inside a TabsList */
const tabTriggerCls = (isActive: boolean) =>
  cn(
    // base — matches TabsTrigger defaults
    'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    // border/shadow overrides — none when passive
    'border-0 shadow-none h-8',
    isActive
      ? 'bg-background text-foreground shadow-sm'   // active = white pill
      : 'bg-transparent text-muted-foreground',     // passive = transparent
  );

export function MetricsFilterBar({ filters, onFiltersChange, channels, origins = [] }: Props) {
  const update = (partial: Partial<MetricFilters>) => onFiltersChange({ ...filters, ...partial });

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
      <Filter className="h-4 w-4 text-muted-foreground shrink-0" />

      {/* Outer container mimics TabsList */}
      <div className="inline-flex h-10 items-center rounded-md bg-muted p-1 text-muted-foreground gap-0.5 shrink-0">

        {/* Date range — first = "active" white pill when non-default */}
        <Select value={filters.dateRange} onValueChange={(v) => update({ dateRange: v as MetricFilters['dateRange'] })}>
          <SelectTrigger className={tabTriggerCls(true)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom…</SelectItem>
          </SelectContent>
        </Select>

        {filters.dateRange === 'custom' && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <button className={tabTriggerCls(!!filters.customStart)}>
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {filters.customStart ? format(filters.customStart, 'MMM d') : 'Start'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                <Calendar mode="single" selected={filters.customStart} onSelect={(d) => update({ customStart: d || undefined })} className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <span className="text-xs text-muted-foreground px-1">–</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className={tabTriggerCls(!!filters.customEnd)}>
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {filters.customEnd ? format(filters.customEnd, 'MMM d') : 'End'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                <Calendar mode="single" selected={filters.customEnd} onSelect={(d) => update({ customEnd: d || undefined })} className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </>
        )}

        {/* Metric type */}
        <Select value={filters.metricType || '__all__'} onValueChange={(v) => update({ metricType: (v === '__all__' ? '' : v) as MetricFilters['metricType'] })}>
          <SelectTrigger className={tabTriggerCls(!!filters.metricType)}>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All types</SelectItem>
            <SelectItem value="earned">Earned</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="content">Content</SelectItem>
          </SelectContent>
        </Select>

        {/* Metric name */}
        <Select value={filters.metricName || '__all__'} onValueChange={(v) => update({ metricName: v === '__all__' ? '' : v })}>
          <SelectTrigger className={tabTriggerCls(!!filters.metricName)}>
            <SelectValue placeholder="All metrics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All metrics</SelectItem>
            {METRIC_CATEGORIES.map(cat => {
              const metricsInCat = SUPPORTED_METRICS.filter(m => m.category === cat.value).sort((a, b) => a.label.localeCompare(b.label));
              return [
                <SelectItem key={`__cat_${cat.value}`} value={`__cat_${cat.value}`} disabled className="text-xs font-semibold text-muted-foreground">
                  ── {cat.label} ──
                </SelectItem>,
                ...metricsInCat.map(m => (
                  <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
                )),
              ];
            })}
          </SelectContent>
        </Select>

        {/* Channel */}
        {channels.length > 0 && (
          <Select value={filters.channel || '__all__'} onValueChange={(v) => update({ channel: v === '__all__' ? '' : v })}>
            <SelectTrigger className={tabTriggerCls(!!filters.channel)}>
              <SelectValue placeholder="All channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All channels</SelectItem>
              {channels.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Origin / Status */}
        {origins.length > 0 && (
          <Select value={filters.origin || '__all__'} onValueChange={(v) => update({ origin: v === '__all__' ? '' : v })}>
            <SelectTrigger className={tabTriggerCls(!!filters.origin)}>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All statuses</SelectItem>
              {origins.map(o => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Per page */}
        <Select value={String(filters.perPage)} onValueChange={(v) => update({ perPage: Number(v) })}>
          <SelectTrigger className={tabTriggerCls(filters.perPage !== DEFAULT_FILTERS.perPage)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

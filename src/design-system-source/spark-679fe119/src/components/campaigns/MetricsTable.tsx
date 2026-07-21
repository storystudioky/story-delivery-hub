import { useState, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, ChevronLeft, ChevronRight, Plus, Sparkles, Check, X, Link2, ChevronDown, MessageSquare, ExternalLink, Share2, CalendarIcon, ArrowUp, ArrowDown, ArrowUpDown, RefreshCw, Loader2, Download } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { sanitizeUrl } from '@/lib/sanitize';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useMetrics, type MetricRow } from '@/hooks/useMetrics';
import { useWorkspaceChannels } from '@/hooks/useWorkspaceChannels';
import { useWorkspaceMetrics } from '@/hooks/useWorkspaceMetrics';

import { useCampaignMetricSuggestions } from '@/hooks/useCampaignMetricSuggestions';
import { METRIC_BY_KEY, SUPPORTED_METRICS, SOURCE_LABELS, formatMetricValue, MEDIA_TYPE_OPTIONS, REACH_CONFIDENCE_LABELS, SENTIMENT_LABELS } from '@/lib/metrics-constants';
import { CAMPAIGN_METRIC_PLATFORM_LABEL, type CampaignMetricPlatform } from '@/lib/constants';
import { MetricEditDialog } from './MetricEditDialog';
import { MetricInlineAddRow } from './MetricInlineAddRow';
import { MetricsFilterBar, DEFAULT_FILTERS, applyDateFilter, type MetricFilters } from './MetricsFilterBar';
import { ChannelCombobox } from './ChannelCombobox';
import { MetricCombobox } from './MetricCombobox';
import { OriginCombobox } from './OriginCombobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format } from 'date-fns';

interface Props {
  campaignId: string;
  metrics: MetricRow[];
  onAddMetric?: () => void;
  onSmartImport?: () => void;
  onSyncIntegrations?: () => void;
  isSyncing?: boolean;
}

type CustomChannels = ReturnType<typeof useWorkspaceChannels>;
type CustomMetrics = ReturnType<typeof useWorkspaceMetrics>;

/* ── Accepted Suggestion Inline Row ── */
function AcceptedSuggestionRow({ suggestion, campaignId, onDismiss, channelsHook, metricsHook }: {
  suggestion: { id: string; platform: string; channel_label: string; kpis: string[]; rationale: string | null; linked_task?: { id: string; title: string } | null };
  campaignId: string;
  onDismiss: (id: string) => void;
  channelsHook: CustomChannels;
  metricsHook: CustomMetrics;
}) {
  const { addMetric } = useMetrics(campaignId);
  const { customChannels, addCustomChannel } = channelsHook;
  const { customMetrics, addCustomMetric } = metricsHook;
  const [metricName, setMetricName] = useState(suggestion.kpis[0] || '');
  const [value, setValue] = useState('');
  const [channel, setChannel] = useState('');

  const handleAdd = () => {
    const num = Number(value);
    if (!metricName || isNaN(num)) return;
    const def = METRIC_BY_KEY[metricName];
    addMetric.mutate({
      metric_name: metricName,
      metric_value: num,
      metric_category: def?.category,
      channel: channel || undefined,
      task_id: suggestion.linked_task?.id,
    }, {
      onSuccess: () => {
        setValue('');
        onDismiss(suggestion.id);
      },
    });
  };

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-xs">
          {CAMPAIGN_METRIC_PLATFORM_LABEL[suggestion.platform as CampaignMetricPlatform] || suggestion.platform}
        </Badge>
        <span className="text-sm font-medium">{suggestion.channel_label}</span>
        <Badge variant="default" className="text-xs">
          <Check className="h-3 w-3 mr-0.5" /> Accepted
        </Badge>
      </div>
      {suggestion.rationale && <p className="text-xs text-muted-foreground">{suggestion.rationale}</p>}
      {suggestion.linked_task && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link2 className="h-3 w-3" />
          <span>{suggestion.linked_task.title}</span>
        </div>
      )}
      <div className="flex items-center gap-2 pt-1">
        <MetricCombobox
            value={metricName}
            onValueChange={setMetricName}
            compact
            triggerClassName="w-[160px]"
            placeholder="KPI..."
            customMetrics={customMetrics}
            onCustomMetricAdd={(label) => addCustomMetric.mutate(label)}
          />
        <Input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-[100px] h-8 text-xs"
        />
        <ChannelCombobox
          value={channel}
          onValueChange={setChannel}
          compact
          triggerClassName="w-[120px]"
          placeholder="Channel..."
          customChannels={customChannels}
          onCustomChannelAdd={(n) => addCustomChannel.mutate(n)}
        />
        <Button variant="cta" size="icon" className="h-8 shadow-sm" onClick={handleAdd} disabled={!metricName || !value || addMetric.isPending}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto" onClick={() => onDismiss(suggestion.id)}>
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

/* ── AI Suggestions Section ── */
function SuggestionsSection({ campaignId, channelsHook, metricsHook }: { campaignId: string; channelsHook: CustomChannels; metricsHook: CustomMetrics }) {
  const { suggestions, isLoading, acceptSuggestion, dismissSuggestion } = useCampaignMetricSuggestions(campaignId);
  const [open, setOpen] = useState(false);
  const [dismissedAccepted, setDismissedAccepted] = useState<Set<string>>(new Set());

  const suggested = suggestions.filter((s) => s.status === 'suggested');
  const accepted = suggestions.filter((s) => s.status === 'accepted' && !dismissedAccepted.has(s.id));
  const totalVisible = suggested.length + accepted.length;

  if (isLoading || totalVisible === 0) return null;

  const handleDismissAccepted = (id: string) => {
    setDismissedAccepted(prev => new Set(prev).add(id));
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-[16px] border border-white/5 bg-background/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors rounded-lg">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-Suggested Metrics ({totalVisible})
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-3 space-y-2">
        {accepted.map((s) => (
          <AcceptedSuggestionRow
            key={s.id}
            suggestion={s}
            campaignId={campaignId}
            onDismiss={handleDismissAccepted}
            channelsHook={channelsHook}
            metricsHook={metricsHook}
          />
        ))}
        {suggested.map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-background/20 p-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {CAMPAIGN_METRIC_PLATFORM_LABEL[s.platform as CampaignMetricPlatform] || s.platform}
                  </Badge>
                  <span className="text-sm font-medium">{s.channel_label}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.kpis.map((kpi) => (
                    <Badge key={kpi} variant="secondary" className="text-xs">{kpi}</Badge>
                  ))}
                </div>
                {s.rationale && <p className="text-xs text-muted-foreground">{s.rationale}</p>}
                {s.linked_task && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Link2 className="h-3 w-3" />
                    <span>{s.linked_task.title}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => acceptSuggestion(s.id)}>
                  <Check className="h-3.5 w-3.5 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => dismissSuggestion(s.id)}>
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ── Expandable Earned Media Detail Row ── */
function EarnedMediaDetailRow({ metric: m, onUpdate, campaignId }: { metric: MetricRow; onUpdate: (updates: Partial<MetricRow>) => void; campaignId: string }) {
  const cellInputClass = "h-7 rounded-md border border-input bg-background px-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring";
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const { metrics: allMetrics, addMetric, updateMetric, deleteMetric } = useMetrics(campaignId);

  // Find the linked EMV row for this appearance (matched by outlet + source_url + date)
  const linkedValueRow = useMemo(() => {
    if (!allMetrics) return null;
    const day = m.created_at ? m.created_at.split('T')[0] : '';
    const url = (m.source_url || '').trim().toLowerCase();
    const outlet = (m.outlet_name || '').trim().toLowerCase();
    const headline = (m.headline || '').trim().toLowerCase();
    return allMetrics.find((r) =>
      r.metric_name === 'earned_media_value' &&
      r.id !== m.id &&
      (r.created_at ? r.created_at.split('T')[0] : '') === day &&
      ((r.source_url || '').trim().toLowerCase() === url) &&
      ((r.outlet_name || '').trim().toLowerCase() === outlet) &&
      ((r.headline || '').trim().toLowerCase() === headline)
    ) || null;
  }, [allMetrics, m]);

  const commitEmv = (raw: string) => {
    setEditingField(null);
    const trimmed = raw.trim();
    if (trimmed === '') {
      if (linkedValueRow) deleteMetric.mutate(linkedValueRow.id);
      return;
    }
    const num = Number(trimmed);
    if (isNaN(num) || num < 0) return;
    if (linkedValueRow) {
      if (num !== Number(linkedValueRow.metric_value)) {
        updateMetric.mutate({ id: linkedValueRow.id, metric_value: num });
      }
    } else if (num > 0) {
      addMetric.mutate({
        metric_name: 'earned_media_value',
        metric_value: num,
        metric_category: 'financial',
        channel: m.channel || undefined,
        origin: m.origin || m.outlet_name || undefined,
        outlet_name: m.outlet_name || undefined,
        headline: m.headline || undefined,
        source_url: m.source_url || undefined,
        media_type: m.media_type || undefined,
        reach_confidence: m.reach_confidence || undefined,
        created_at: m.created_at,
      });
    }
  };

  const startEdit = (field: string, val: string) => { setEditingField(field); setDraft(val); };
  const commitText = (field: string) => {
    setEditingField(null);
    const trimmed = draft.trim();
    const current = (m as any)[field] || '';
    if (trimmed !== current) onUpdate({ [field]: trimmed || null });
  };

  const confBadge = m.reach_confidence ? REACH_CONFIDENCE_LABELS[m.reach_confidence] : null;

  return (
    <div className="border-t border-white/5 px-4 py-4 bg-white/[0.02] rounded-b-[16px]">
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs pl-[56px]">
        {/* Headline */}
        <div className="space-y-0.5">
          <span className="text-muted-foreground font-medium">Headline</span>
          {editingField === 'headline' ? (
            <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
              onBlur={() => commitText('headline')}
              onKeyDown={(e) => { if (e.key === 'Enter') commitText('headline'); if (e.key === 'Escape') setEditingField(null); }}
              className={cn(cellInputClass, 'w-full')} title="Headline" placeholder="Enter headline..." />
          ) : (
            <p className="cursor-text hover:text-foreground text-foreground/80 truncate pr-2" onClick={() => startEdit('headline', m.headline || '')}>
              {m.headline || <span className="text-primary italic font-medium">Add headline...</span>}
            </p>
          )}
        </div>

        {/* URL */}
        <div className="space-y-0.5">
          <span className="text-muted-foreground font-medium">URL</span>
          {editingField === 'source_url' ? (
            <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
              onBlur={() => commitText('source_url')}
              onKeyDown={(e) => { if (e.key === 'Enter') commitText('source_url'); if (e.key === 'Escape') setEditingField(null); }}
              className={cn(cellInputClass, 'w-full')} placeholder="https://..." />
          ) : m.source_url ? (
            <a href={sanitizeUrl(m.source_url)} target="_blank" rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1 truncate pr-2">
              <ExternalLink className="h-3 w-3 shrink-0" />
              <span className="truncate">{(() => {
                try { return new URL(m.source_url).hostname; }
                catch { return m.source_url; }
              })()}</span>
            </a>
          ) : (
            <p className="cursor-text text-primary italic font-medium" onClick={() => startEdit('source_url', '')}>Add URL...</p>
          )}
        </div>

        {/* Media Type */}
        <div className="space-y-0.5">
          <span className="text-muted-foreground font-medium">Media Type</span>
          <Select value={m.media_type || '__none__'} onValueChange={(v) => onUpdate({ media_type: v === '__none__' ? null : v })}>
            <SelectTrigger className="h-7 text-xs border-transparent hover:border-input w-[110px] !shadow-none bg-background/50">
              <SelectValue>{MEDIA_TYPE_OPTIONS.find(o => o.value === m.media_type)?.label || '—'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="text-xs">— None —</SelectItem>
              {MEDIA_TYPE_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reach Confidence */}
        <div className="space-y-0.5">
          <span className="text-muted-foreground font-medium">Confidence</span>
          <Select value={m.reach_confidence || '__none__'} onValueChange={(v) => onUpdate({ reach_confidence: v === '__none__' ? null : v })}>
            <SelectTrigger className="h-7 text-xs border-transparent hover:border-input w-[110px] !shadow-none bg-background/50">
              <SelectValue>
                {REACH_CONFIDENCE_LABELS[m.reach_confidence]?.label || '—'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="text-xs">— None —</SelectItem>
              {Object.entries(REACH_CONFIDENCE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-xs">{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sentiment */}
        <div className="space-y-0.5">
          <span className="text-muted-foreground font-medium">Sentiment</span>
          <Select value={(m as any).sentiment || '__none__'} onValueChange={(v) => onUpdate({ sentiment: v === '__none__' ? null : v } as any)}>
            <SelectTrigger className="h-7 text-xs border-transparent hover:border-input w-[110px] !shadow-none bg-background/50">
              <SelectValue>
                {SENTIMENT_LABELS[(m as any).sentiment]?.label || '—'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" className="text-xs">— None —</SelectItem>
              {Object.entries(SENTIMENT_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-xs">{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Earned Media Value ($) — linked to this appearance */}
        <div className="space-y-0.5">
          <span className="text-muted-foreground font-medium" title="Estimated dollar value (EMV / PR equivalency) of this specific placement.">EMV ($)</span>
          {editingField === 'emv' ? (
            <input
              autoFocus
              type="number"
              min="0"
              step="0.01"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => commitEmv(draft)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEmv(draft); if (e.key === 'Escape') setEditingField(null); }}
              className={cn(cellInputClass, 'w-[110px]')}
              placeholder="0.00"
            />
          ) : (
            <p
              className="cursor-text hover:text-foreground text-foreground/80 truncate pr-2"
              onClick={() => { setEditingField('emv'); setDraft(linkedValueRow ? String(linkedValueRow.metric_value) : ''); }}
            >
              {linkedValueRow
                ? formatMetricValue(Number(linkedValueRow.metric_value), 'currency')
                : <span className="text-primary italic font-medium">Add $ value...</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Inline Editable Row ── */
function InlineMetricRow({
  metric: m,
  selected,
  onToggle,
  onUpdate,
  onDelete,
  channelsHook,
  metricsHook,
  campaignId,
}: {
  metric: MetricRow;
  selected: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<MetricRow>) => void;
  onDelete: () => void;
  channelsHook: CustomChannels;
  metricsHook: CustomMetrics;
  campaignId: string;
}) {
  const { customChannels, addCustomChannel } = channelsHook;
  const { customMetrics, addCustomMetric } = metricsHook;
  const def = METRIC_BY_KEY[m.metric_name];
  const hasDetail = !!(m.headline || m.source_url || m.outlet_name || m.media_type);
  const [expanded, setExpanded] = useState(false);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setDraft(currentValue);
  };

  const commitEdit = (field: string) => {
    setEditingField(null);
    const trimmed = draft.trim();
    if (field === 'metric_value') {
      const num = Number(trimmed);
      if (!isNaN(num) && num !== m.metric_value) onUpdate({ metric_value: num });
    } else if (field === 'metric_name') {
      if (trimmed && trimmed !== m.metric_name) {
        const newDef = METRIC_BY_KEY[trimmed];
        onUpdate({ metric_name: trimmed, metric_category: newDef?.category || m.metric_category });
      }
    } else if (field === 'origin') {
      if (trimmed !== (m.origin || '')) onUpdate({ origin: trimmed || null });
    }
  };

  const cellInputClass = "h-7 rounded-md border border-input bg-background px-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="group flex flex-col rounded-[16px] border border-white/5 bg-background/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-background/60 md:hover:scale-[1.01] hover:border-white/10 relative">
      {/* Mobile card layout */}
      <div className="md:hidden p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox checked={selected} onCheckedChange={onToggle} />
          <div className="flex-1 min-w-0 space-y-2">
            <MetricCombobox
              value={m.metric_name}
              onValueChange={(v) => {
                const newDef = METRIC_BY_KEY[v];
                onUpdate({ metric_name: v, metric_category: newDef?.category || m.metric_category });
              }}
              compact
              triggerClassName="w-full h-9 justify-start font-medium !bg-transparent border border-white/10 !shadow-none"
              placeholder={def?.label || m.metric_name}
              customMetrics={customMetrics}
              onCustomMetricAdd={(label) => addCustomMetric.mutate(label)}
            />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block mb-1">Value</span>
                {editingField === 'metric_value' ? (
                  <input
                    autoFocus
                    type="number"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => commitEdit('metric_value')}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitEdit('metric_value'); if (e.key === 'Escape') setEditingField(null); }}
                    className={cn(cellInputClass, 'w-full')}
                  />
                ) : (
                  <span className="font-mono cursor-text" onClick={() => startEdit('metric_value', String(m.metric_value))}>
                    {def ? formatMetricValue(Number(m.metric_value), def.format) : Number(m.metric_value).toLocaleString()}
                  </span>
                )}
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Date</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="h-8 w-full justify-start text-left font-normal text-xs px-2">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1 opacity-50 shrink-0" />
                      <span className="truncate">{m.created_at ? format(new Date(m.created_at), 'MMM d, yyyy') : 'Set date'}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                    <Calendar
                      mode="single"
                      selected={m.created_at ? new Date(m.created_at) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T12:00:00Z`;
                          onUpdate({ created_at: iso });
                        }
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <ChannelCombobox
                value={m.channel || ''}
                onValueChange={(v) => onUpdate({ channel: v || null })}
                compact
                triggerClassName="w-full h-9 text-xs border border-white/10 !bg-transparent"
                placeholder="Channel..."
                customChannels={customChannels}
                onCustomChannelAdd={(n) => addCustomChannel.mutate(n)}
              />
              <OriginCombobox
                value={m.origin || m.outlet_name || ''}
                onValueChange={(v) => onUpdate({ origin: v || null })}
                compact
                triggerClassName="w-full h-9 text-xs border border-white/10 !bg-transparent"
                placeholder="Status..."
              />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive shrink-0" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {hasDetail && (
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary flex items-center gap-1">
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
            {expanded ? 'Hide details' : 'Show details'}
          </button>
        )}
        {expanded && hasDetail && (
          <EarnedMediaDetailRow metric={m} onUpdate={onUpdate} campaignId={campaignId} />
        )}
      </div>

      {/* Desktop grid row */}
      <div className="hidden md:grid grid-cols-[40px_minmax(150px,2fr)_minmax(100px,1fr)_minmax(120px,1.5fr)_minmax(120px,1.5fr)_minmax(120px,1fr)_80px] items-center gap-4 px-4 py-2 relative z-10 min-h-[48px]">
        {/* Checkbox */}
        <div className="flex justify-start items-center">
          <Checkbox checked={selected} onCheckedChange={onToggle} />
        </div>

        {/* Metric Name - select dropdown */}
        <div className="flex items-center gap-1 min-w-0">
          <MetricCombobox
            value={m.metric_name}
            onValueChange={(v) => {
              const newDef = METRIC_BY_KEY[v];
              onUpdate({ metric_name: v, metric_category: newDef?.category || m.metric_category });
            }}
            compact
            triggerClassName={cn(
              "w-auto h-7 justify-start px-2 font-medium !bg-transparent border border-transparent !shadow-none hover:bg-white/5 hover:border-white/10 text-foreground transition-colors rounded-full truncate",
              hasDetail && "[&>svg:last-child]:hidden"
            )}
            placeholder={def?.label || m.metric_name}
            customMetrics={customMetrics}
            onCustomMetricAdd={(label) => addCustomMetric.mutate(label)}
          />
          {hasDetail && (
            <button onClick={() => setExpanded(!expanded)} className="shrink-0 p-0.5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-foreground" title={expanded ? 'Collapse details' : 'Expand details'} aria-label={expanded ? 'Collapse details' : 'Expand details'}>
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', expanded && 'rotate-180')} />
            </button>
          )}
        </div>

        {/* Value - click to edit */}
        <div className="font-mono text-sm truncate">
          {editingField === 'metric_value' ? (
            <input
              autoFocus
              type="number"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => commitEdit('metric_value')}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit('metric_value'); if (e.key === 'Escape') setEditingField(null); }}
              className={cn(cellInputClass, 'w-[90px]')}
              title="Metric Value"
              placeholder="Enter value"
            />
          ) : (
            <span
              className="cursor-text hover:border-b hover:border-muted-foreground/30 px-1 truncate"
              onClick={() => startEdit('metric_value', String(m.metric_value))}
            >
              {def ? formatMetricValue(Number(m.metric_value), def.format) : Number(m.metric_value).toLocaleString()}
            </span>
          )}
        </div>

        {/* Channel - combobox */}
        <div className="text-sm truncate">
          <ChannelCombobox
            value={m.channel || ''}
            onValueChange={(v) => onUpdate({ channel: v || null })}
            compact
            triggerClassName="min-w-[100px] w-auto h-7 text-xs border border-white/10 !bg-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-full transition-colors !shadow-none"
            placeholder="—"
            customChannels={customChannels}
            onCustomChannelAdd={(n) => addCustomChannel.mutate(n)}
          />
        </div>

        {/* Origin - combobox */}
        <div className="text-sm truncate">
          <OriginCombobox
            value={m.origin || m.outlet_name || ''}
            onValueChange={(v) => onUpdate({ origin: v || null })}
            compact
            triggerClassName="min-w-[130px] w-auto h-7 text-xs border border-transparent !bg-transparent text-muted-foreground hover:bg-white/5 hover:border-white/10 hover:text-foreground rounded-full transition-colors !shadow-none"
            placeholder="—"
          />
        </div>

        {/* Date */}
        <div className="text-sm text-muted-foreground truncate flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'h-7 w-auto min-w-[110px] justify-start text-left font-normal text-xs px-2 rounded-md hover:bg-white/5 hover:text-foreground transition-colors !shadow-none',
                  m.created_at ? 'text-muted-foreground' : 'text-muted-foreground/50'
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5 mr-1 opacity-50 shrink-0" />
                <span className="truncate">{m.created_at ? format(new Date(m.created_at), 'MMM d, yyyy') : 'Set date'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
              <Calendar
                mode="single"
                selected={m.created_at ? new Date(m.created_at) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T12:00:00Z`;
                    onUpdate({ created_at: iso });
                  }
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          {m.notes && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center shrink-0">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[240px]">
                  <p className="text-xs whitespace-pre-wrap">{m.notes}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      {expanded && hasDetail && (
        <div className="hidden md:block">
          <EarnedMediaDetailRow metric={m} onUpdate={onUpdate} campaignId={campaignId} />
        </div>
      )}
    </div>
  );
}

/* ── Share Metrics Button with Category Filter ── */
const SHARE_CATEGORIES = [
  { id: 'all', label: 'All Metrics', description: 'Share every metric in this campaign', keys: [] as string[] },
  { id: 'earned_media', label: 'Earned Media', description: 'Media appearances, outlets, sentiment', keys: ['earned_media_appearances', 'earned_media_reach'] },
  { id: 'performance', label: 'Performance', description: 'Impressions, Reach, Views...', keys: SUPPORTED_METRICS.filter(m => m.category === 'performance' && !m.key.startsWith('earned_media')).map(m => m.key) },
  { id: 'engagement', label: 'Engagement', description: 'Clicks, Reactions, Shares...', keys: SUPPORTED_METRICS.filter(m => m.category === 'engagement').map(m => m.key) },
  { id: 'financial', label: 'Financial', description: 'Spend, Revenue, ROAS...', keys: SUPPORTED_METRICS.filter(m => m.category === 'financial').map(m => m.key) },
  { id: 'conversion', label: 'Conversion', description: 'Conversions, Leads, Purchases...', keys: SUPPORTED_METRICS.filter(m => m.category === 'conversion').map(m => m.key) },
  { id: 'quality', label: 'Quality', description: 'CTR, Bounce Rate, Engagement Rate...', keys: SUPPORTED_METRICS.filter(m => m.category === 'quality').map(m => m.key) },
  { id: 'content', label: 'Content', description: 'Posts Published, Emails Sent...', keys: SUPPORTED_METRICS.filter(m => m.category === 'content').map(m => m.key) },
];

function ShareMediaButton({ campaignId }: { campaignId: string }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(['all']));
  const { metrics: allCampaignMetrics } = useMetrics(campaignId);
  const [summaryCardKeys, setSummaryCardKeys] = useState<Set<string>>(new Set(['__all']));

  // Compute which metric keys actually have data
  const availableSummaryKeys = useMemo(() => {
    const keys = new Set<string>();
    allCampaignMetrics.forEach(m => {
      if (Number(m.metric_value) !== 0) keys.add(m.metric_name);
    });
    return SUPPORTED_METRICS.filter(m => keys.has(m.key));
  }, [allCampaignMetrics]);

  const toggleCategory = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (id === 'all') {
        if (next.has('all')) { next.clear(); } else { next.clear(); next.add('all'); }
      } else {
        next.delete('all');
        if (next.has(id)) next.delete(id); else next.add(id);
      }
      return next;
    });
  };

  const toggleSummaryCard = (key: string) => {
    setSummaryCardKeys(prev => {
      const next = new Set(prev);
      if (key === '__all') {
        if (next.has('__all')) { next.clear(); } else { next.clear(); next.add('__all'); }
      } else {
        next.delete('__all');
        if (next.has(key)) next.delete(key); else next.add(key);
      }
      return next;
    });
  };

  const handleGenerate = async () => {
    if (selected.size === 0) { toast.error('Select at least one category'); return; }
    const isAll = selected.has('all');
    const metricKeys = isAll ? null : SHARE_CATEGORIES.filter(c => c.id !== 'all' && selected.has(c.id)).flatMap(c => c.keys);
    const summaryKeys = summaryCardKeys.has('__all') ? null : Array.from(summaryCardKeys);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('metrics-share-create', {
        body: { campaign_id: campaignId, metric_type: 'filtered', metric_keys: metricKeys, summary_card_keys: summaryKeys },
      });
      if (error || data?.error) throw new Error(data?.error || 'Failed to create share link');
      const url = `${window.location.origin}/media/${data.share_token}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard!');
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 shadow-sm rounded-full">
          <Share2 className="h-3.5 w-3.5 mr-1" />
          Share Metrics
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 max-h-[70vh] overflow-y-auto" align="end">
        <p className="text-sm font-medium mb-3">Select categories to share</p>
        <div className="space-y-2.5">
          {SHARE_CATEGORIES.map(cat => {
            const isAllSelected = selected.has('all');
            const disabled = cat.id !== 'all' && isAllSelected;
            return (
              <label key={cat.id} className={cn("flex items-start gap-2 cursor-pointer group", disabled && "opacity-50 cursor-not-allowed")}>
                <Checkbox
                  checked={cat.id === 'all' ? isAllSelected : (isAllSelected || selected.has(cat.id))}
                  onCheckedChange={() => toggleCategory(cat.id)}
                  disabled={disabled}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium leading-none">{cat.label}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Summary Cards Selection */}
        {availableSummaryKeys.length > 0 && (
          <>
            <div className="border-t border-border my-3" />
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1.5 text-sm font-medium w-full">
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform [[data-state=open]_&]:rotate-180" />
                Summary Cards
                <span className="text-xs text-muted-foreground ml-auto">
                  {summaryCardKeys.has('__all') ? 'All' : `${summaryCardKeys.size} selected`}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={summaryCardKeys.has('__all')}
                    onCheckedChange={() => toggleSummaryCard('__all')}
                    className="h-3.5 w-3.5"
                  />
                  <span className="text-xs font-medium">Show all</span>
                </label>
                {availableSummaryKeys.map(m => {
                  const isAllCards = summaryCardKeys.has('__all');
                  return (
                    <label key={m.key} className={cn("flex items-center gap-2 cursor-pointer", isAllCards && "opacity-50 cursor-not-allowed")}>
                      <Checkbox
                        checked={isAllCards || summaryCardKeys.has(m.key)}
                        onCheckedChange={() => toggleSummaryCard(m.key)}
                        disabled={isAllCards}
                        className="h-3.5 w-3.5"
                      />
                      <span className="text-xs">{m.label}</span>
                    </label>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </>
        )}

        <Button size="sm" className="w-full mt-4" onClick={handleGenerate} disabled={loading || selected.size === 0}>
          {loading ? 'Generating...' : 'Generate Share Link'}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function SortableColumn({ label, sortKey, currentSort, sortDir, onSort }: {
  label: string; sortKey: string; currentSort: string; sortDir: 'asc' | 'desc'; onSort: (key: string) => void;
}) {
  const active = currentSort === sortKey;
  return (
    <div className="cursor-pointer select-none font-medium hover:text-foreground transition-colors flex items-center gap-1" onClick={() => onSort(sortKey)}>
      <span className="truncate">{label}</span>
      {active ? (sortDir === 'asc' ? <ArrowUp className="h-3.5 w-3.5 shrink-0" /> : <ArrowDown className="h-3.5 w-3.5 shrink-0" />) : <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30" />}
    </div>
  );
}

export function MetricsTable({ campaignId, metrics: allMetrics, onAddMetric, onSmartImport, onSyncIntegrations, isSyncing }: Props) {
  const { deleteMetric, bulkDeleteMetrics, updateMetric } = useMetrics(campaignId);
  const channelsHook = useWorkspaceChannels();
  const metricsHook = useWorkspaceMetrics();
  const [filters, setFilters] = useState<MetricFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  const handleSort = useCallback((key: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: key,
      sortDir: prev.sortBy === key && prev.sortDir === 'asc' ? 'desc' : 'asc',
    }));
    setPage(0);
  }, []);

  const channels = useMemo(() => {
    const set = new Set<string>();
    allMetrics.forEach(m => { if (m.channel) set.add(m.channel); });
    return Array.from(set).sort();
  }, [allMetrics]);

  const origins = useMemo(() => {
    const set = new Set<string>();
    allMetrics.forEach(m => { if (m.origin) set.add(m.origin); else if (m.outlet_name) set.add(m.outlet_name); });
    return Array.from(set).sort();
  }, [allMetrics]);

  const filtered = useMemo(() => {
    let result = applyDateFilter(allMetrics, filters);
    // Hide earned_media_value rows from the table — they're shown inline as the
    // EMV ($) field on the matching earned_media_reach row.
    result = result.filter(m => m.metric_name !== 'earned_media_value');
    if (filters.metricName) result = result.filter(m => m.metric_name === filters.metricName);
    if (filters.channel) result = result.filter(m => m.channel === filters.channel);
    if (filters.origin) result = result.filter(m => (m.origin || m.outlet_name || '') === filters.origin);
    if (filters.metricType === 'earned') result = result.filter(m => m.metric_name.startsWith('earned_media') || !!m.outlet_name);
    else if (filters.metricType === 'paid') result = result.filter(m => ['spend', 'cpc', 'cpm', 'cpv', 'cpa', 'roas', 'cost_per_result'].includes(m.metric_name));
    else if (filters.metricType === 'content') result = result.filter(m => METRIC_BY_KEY[m.metric_name]?.category === 'content');
    result = [...result].sort((a, b) => {
      const key = filters.sortBy as keyof MetricRow;
      const aVal = a[key] ?? '';
      const bVal = b[key] ?? '';
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return filters.sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [allMetrics, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / filters.perPage));
  const pageRows = filtered.slice(page * filters.perPage, (page + 1) * filters.perPage);

  const toggleAll = () => {
    if (selected.size === pageRows.length) setSelected(new Set());
    else setSelected(new Set(pageRows.map(r => r.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleBulkDelete = () => {
    bulkDeleteMetrics.mutate(Array.from(selected), { onSuccess: () => setSelected(new Set()) });
  };

  const handleExport = useCallback(() => {
    const csv = [
      'Metric,Value,Channel,Status,Outlet,Headline,URL,Media Type,Confidence,Date,Notes',
      ...filtered.map(m =>
        `"${METRIC_BY_KEY[m.metric_name]?.label || m.metric_name}",${m.metric_value},"${m.channel || ''}","${m.origin || m.outlet_name || ''}","${m.outlet_name || ''}","${(m.headline || '').replace(/"/g, '""')}","${m.source_url || ''}","${m.media_type || ''}","${m.reach_confidence || ''}","${format(new Date(m.created_at), 'yyyy-MM-dd')}","${(m.notes || '').replace(/"/g, '""')}"`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metrics-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  if (allMetrics.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-end gap-2">
          {onSmartImport && (
           <Button variant="outline" size="sm" onClick={onSmartImport} className="h-8 shadow-sm">
              <Sparkles className="h-4 w-4 mr-1" /> Smart Import
            </Button>
          )}
          {onSyncIntegrations && (
            <Button variant="outline" size="sm" onClick={onSyncIntegrations} disabled={isSyncing} className="h-8 shadow-sm">
              {isSyncing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />} Sync Data
            </Button>
          )}
          {onAddMetric && (
            <Button variant="cta" size="sm" onClick={onAddMetric} className="h-8 shadow-sm">
              <Plus className="h-4 w-4 mr-1" /> Add Metric
            </Button>
          )}
        </div>
        <div className="rounded-[20px] border border-white/5 bg-background/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-12 text-center">
          <p className="text-sm text-muted-foreground">No metrics yet. Add manually or use Smart Import.</p>
        </div>
        <SuggestionsSection campaignId={campaignId} channelsHook={channelsHook} metricsHook={metricsHook} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {selected.size > 0 && (
            <Button variant="outline" size="sm" onClick={handleBulkDelete} disabled={bulkDeleteMetrics.isPending} className="text-destructive border-transparent hover:bg-destructive/10 hover:text-destructive transition-colors h-8 shadow-sm rounded-full">
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete {selected.size}
            </Button>
          )}
          {onSmartImport && (
            <Button variant="outline" size="sm" onClick={onSmartImport} className="h-8 shadow-sm rounded-full">
              <Sparkles className="h-4 w-4 mr-1" /> Smart Import
            </Button>
          )}
          {onSyncIntegrations && (
            <Button variant="outline" size="sm" onClick={onSyncIntegrations} disabled={isSyncing} className="h-8 shadow-sm rounded-full">
              {isSyncing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />} Sync Data
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExport} className="h-8 shadow-sm rounded-full">
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
          <ShareMediaButton campaignId={campaignId} />
          {onAddMetric && (
            <Button variant="cta" size="sm" onClick={onAddMetric} className="h-8 shadow-sm">
              <Plus className="h-4 w-4 mr-1" /> Add Metric
            </Button>
          )}
        </div>
        <div className="p-2 rounded-xl border border-white/10 bg-background/40 backdrop-blur-md">
          <MetricsFilterBar filters={filters} onFiltersChange={(f) => { setFilters(f); setPage(0); }} channels={channels} origins={origins} />
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {/* Table Header pseudo-row */}
        <div className="grid grid-cols-[40px_minmax(150px,2fr)_minmax(100px,1fr)_minmax(120px,1.5fr)_minmax(120px,1.5fr)_minmax(120px,1fr)_80px] items-center gap-4 px-4 py-3 mb-2 border-b border-border/50 text-xs font-medium text-muted-foreground hidden md:grid">
          <div className="flex justify-start items-center">
            <Checkbox checked={selected.size === pageRows.length && pageRows.length > 0} onCheckedChange={toggleAll} />
          </div>
          <SortableColumn label="Metric" sortKey="metric_name" currentSort={filters.sortBy} sortDir={filters.sortDir} onSort={handleSort} />
          <SortableColumn label="Value" sortKey="metric_value" currentSort={filters.sortBy} sortDir={filters.sortDir} onSort={handleSort} />
          <SortableColumn label="Channel" sortKey="channel" currentSort={filters.sortBy} sortDir={filters.sortDir} onSort={handleSort} />
          <SortableColumn label="Status" sortKey="origin" currentSort={filters.sortBy} sortDir={filters.sortDir} onSort={handleSort} />
          <SortableColumn label="Date" sortKey="created_at" currentSort={filters.sortBy} sortDir={filters.sortDir} onSort={handleSort} />
          <div></div>
        </div>

        {/* Row Cards */}
        <div className="space-y-2">
          {pageRows.map((m) => (
            <InlineMetricRow
              key={m.id}
              metric={m}
              selected={selected.has(m.id)}
              onToggle={() => toggleOne(m.id)}
              onUpdate={(updates) => updateMetric.mutate({ id: m.id, ...updates })}
              onDelete={() => deleteMetric.mutate(m.id)}
              channelsHook={channelsHook}
              metricsHook={metricsHook}
              campaignId={campaignId}
            />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filtered.length} results</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>{page + 1} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <SuggestionsSection campaignId={campaignId} channelsHook={channelsHook} metricsHook={metricsHook} />

    </div>
  );
}

import { useMemo } from 'react';
import {
  TrendingUp, MousePointerClick, DollarSign, Target, BarChart3,
  ArrowUpRight, Eye, Users, Globe, Heart, MessageCircle, Share2,
  Bookmark, ShoppingCart, UserPlus, Percent, Play, CheckCircle,
  Timer, Gauge, Radio, Newspaper, CornerUpLeft, Monitor,
  Activity, UserCheck, Megaphone, Hash, Mail, FileText,
  Film, Mic, CalendarDays,
} from 'lucide-react';
import type { MetricRow } from '@/hooks/useMetrics';
import { SUPPORTED_METRICS, METRIC_BY_KEY, formatMetricValue, SOURCE_LABELS, PROVIDER_LABELS } from '@/lib/metrics-constants';
import { METRIC_DESCRIPTIONS } from '@/lib/metric-descriptions';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface Props {
  metrics: MetricRow[];
  budgetCents?: number;
}

const RATE_METRICS = new Set([
  'ctr', 'cpc', 'cpm', 'cpv', 'cpa', 'cost_per_result',
  'roas', 'bounce_rate', 'engagement_rate', 'scroll_depth', 'time_on_page',
  'cvr', 'roi',
]);

const ICON_MAP: Record<string, React.ElementType> = {
  impressions: TrendingUp,
  reach: Users,
  page_views: Eye,
  video_views: Play,
  visits: Globe,
  clicks: MousePointerClick,
  link_clicks: MousePointerClick,
  spend: DollarSign,
  revenue: DollarSign,
  conversions: Target,
  leads: UserPlus,
  purchases: ShoppingCart,
  engagement: Heart,
  reactions: Heart,
  comments: MessageCircle,
  shares: Share2,
  saves: Bookmark,
  sign_ups: UserPlus,
  add_to_cart: ShoppingCart,
  checkouts: ShoppingCart,
  frequency: Radio,
  video_completions: CheckCircle,
  earned_media_appearances: Newspaper,
  earned_media_reach: Megaphone,
  ctr: Percent,
  cpc: DollarSign,
  cpm: DollarSign,
  cpv: DollarSign,
  cpa: DollarSign,
  cost_per_result: DollarSign,
  roas: ArrowUpRight,
  cvr: Percent,
  roi: ArrowUpRight,
  bounce_rate: CornerUpLeft,
  engagement_rate: Gauge,
  scroll_depth: Percent,
  time_on_page: Timer,
  sessions: Monitor,
  engaged_sessions: Activity,
  active_users: UserCheck,
  new_users: UserPlus,
  avg_session_duration: Timer,
  engagement_rate_web: Gauge,
  social_posts_published: Hash,
  emails_sent: Mail,
  blog_posts_published: FileText,
  newsletters_sent: Mail,
  stories_published: Film,
  reels_published: Film,
  press_releases: Mic,
  events_hosted: CalendarDays,
};

interface CardData {
  key: string;
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  description?: string;
  calcNote?: string;
  sources?: string[];
}

// Order for display — covers all SUPPORTED_METRICS keys
const DISPLAY_ORDER = SUPPORTED_METRICS.map(m => m.key);

export function MetricsSummaryCards({ metrics, budgetCents }: Props) {
  const cards = useMemo(() => {
    if (metrics.length === 0) return [];

    // Group values per metric_name and collect sources
    const grouped = new Map<string, number[]>();
    const sourcesByMetric = new Map<string, Set<string>>();
    metrics.forEach(m => {
      const arr = grouped.get(m.metric_name) || [];
      arr.push(Number(m.metric_value));
      grouped.set(m.metric_name, arr);

      const srcSet = sourcesByMetric.get(m.metric_name) || new Set();
      const providerLabel = m.provider ? PROVIDER_LABELS[m.provider] : null;
      const sourceLabel = m.source ? SOURCE_LABELS[m.source] : null;
      const label = providerLabel || sourceLabel;
      if (label) srcSet.add(label);
      sourcesByMetric.set(m.metric_name, srcSet);
    });

    const result: CardData[] = [];

    for (const key of DISPLAY_ORDER) {
      const values = grouped.get(key);
      if (!values || values.length === 0) continue;

      const aggregated = RATE_METRICS.has(key)
        ? values.reduce((a, b) => a + b, 0) / values.length
        : values.reduce((a, b) => a + b, 0);

      if (aggregated === 0) continue;

      const def = METRIC_BY_KEY[key];
      const desc = METRIC_DESCRIPTIONS[key];
      const srcSet = sourcesByMetric.get(key);
      const sources = srcSet ? Array.from(srcSet) : [];
      result.push({
        key,
        label: def?.label || key,
        value: def ? formatMetricValue(aggregated, def.format) : aggregated.toLocaleString(),
        icon: ICON_MAP[key] || BarChart3,
        color: 'text-primary',
        description: desc?.definition,
        calcNote: desc?.calcNote,
        sources,
      });
    }

    // ROI fallback — only if no stored ROI metric
    if (!grouped.has('roi')) {
      const spend = (grouped.get('spend') || []).reduce((a, b) => a + b, 0);
      const revenue = (grouped.get('revenue') || []).reduce((a, b) => a + b, 0);
      const totalSpend = spend > 0 ? spend : (budgetCents ? budgetCents / 100 : 0);
      if (revenue > 0 && totalSpend > 0) {
        const roi = ((revenue - totalSpend) / totalSpend) * 100;
        const roiDesc = METRIC_DESCRIPTIONS['roi'];
        result.push({
          key: 'roi',
          label: 'ROI',
          value: `${roi.toFixed(1)}%`,
          icon: ICON_MAP.roi,
          color: 'text-primary',
          description: roiDesc?.definition,
          calcNote: roiDesc?.calcNote,
        });
      }
    }

    return result;
  }, [metrics, budgetCents]);

  if (cards.length === 0) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.key} className="group rounded-[16px] border border-white/5 bg-background/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)] p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-background/60">
            <div className="flex items-center gap-2 mb-1">
              <c.icon className={`h-4 w-4 ${c.color}`} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground cursor-help border-b border-dashed border-muted-foreground/50">
                    {c.label}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[240px]">
                  {c.description && <p className="text-xs font-medium">{c.description}</p>}
                  {c.calcNote && <p className="text-xs text-muted-foreground mt-0.5">{c.calcNote}</p>}
                  {c.sources && c.sources.length > 0 && (
                    <p className={`text-xs text-muted-foreground ${c.description ? 'mt-1 pt-1 border-t border-border/50' : ''}`}>
                      Source: {c.sources.join(', ')}
                    </p>
                  )}
                  {!c.description && (!c.sources || c.sources.length === 0) && (
                    <p className="text-xs font-medium">{c.label}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{c.value}</p>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}

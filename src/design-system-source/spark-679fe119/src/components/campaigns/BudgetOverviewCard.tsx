import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Info, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCampaignBudget } from '@/hooks/useCampaignBudget';
import { useBudgetItems } from '@/hooks/useBudgetItems';
import { BUDGET_ITEM_TYPES } from '@/lib/metrics-constants';
import { cn } from '@/lib/utils';

interface Props {
  campaignId: string;
}

export function BudgetOverviewCard({ campaignId }: Props) {
  const { budget, isLoading, syncBudget } = useCampaignBudget(campaignId);
  const { items } = useBudgetItems(campaignId);

  const { totalEstimated, totalActual, breakdownByType } = useMemo(() => {
    const actuals = items.filter(i => !i.is_estimate);

    // Estimated total uses the locked-in original estimate when present,
    // so converting items to Actual or amending amounts never erases the plan.
    const estOf = (i: typeof items[number]) =>
      i.original_estimate_amount != null ? Number(i.original_estimate_amount) : Number(i.amount);

    const totalEst = items.reduce((sum, i) => sum + estOf(i), 0);
    const totalAct = actuals.reduce((sum, i) => sum + Number(i.amount), 0);

    const breakdown = BUDGET_ITEM_TYPES.map(t => ({
      label: t.label,
      estimated: items.filter(i => i.item_type === t.value).reduce((s, i) => s + estOf(i), 0),
      actual: actuals.filter(i => i.item_type === t.value).reduce((s, i) => s + Number(i.amount), 0),
    })).filter(b => b.estimated > 0 || b.actual > 0);

    return { totalEstimated: totalEst, totalActual: totalAct, breakdownByType: breakdown };
  }, [items]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading budget...</p>;
  if (!budget) return null;

  const totalBudget = budget.total_budget_cents / 100;
  const remaining = totalBudget - totalActual;
  const variance = totalBudget - totalEstimated; // positive = under budget, negative = over
  const utilization = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;

  const barColor =
    utilization >= budget.critical_threshold_pct
      ? 'bg-destructive'
      : utilization >= budget.warning_threshold_pct
        ? 'bg-warning'
        : 'bg-success';

  const fmtCurrency = (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-heading-sm">Budget Overview</h4>
        <Button variant="outline" size="sm" onClick={() => syncBudget.mutate()} disabled={syncBudget.isPending} className="h-8 shadow-sm">
          <RefreshCw className={cn("h-3.5 w-3.5 mr-1", syncBudget.isPending && "animate-spin")} />
          Sync
        </Button>
      </div>

      <div className="relative">
        <Progress 
          value={Math.min(utilization, 100)} 
          className="h-3"
          indicatorClassName={barColor}
        />
      </div>

      {totalActual > totalBudget && totalBudget > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <p className="text-sm text-destructive font-medium">⚠️ Over budget by {fmtCurrency(totalActual - totalBudget)}</p>
        </div>
      )}

      {totalEstimated > totalBudget && totalBudget > 0 && totalActual <= totalBudget && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
          <p className="text-sm text-warning font-medium">⚠️ Plan exceeds budget by {fmtCurrency(totalEstimated - totalBudget)} — estimated spend is over your total budget</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <SummaryCard label="Total Budget" value={fmtCurrency(totalBudget)} tooltip="The hard budget cap set for this campaign" />
        <SummaryCard label="Estimated" value={fmtCurrency(totalEstimated)} tooltip="Original planned spend — locked when an item is converted to Actual or amended." />
        <SummaryCard label="Spent" value={fmtCurrency(totalActual)} tooltip="Sum of confirmed actual spend items only" />
        <SummaryCard label="Remaining" value={fmtCurrency(remaining)} className={remaining >= 0 ? 'text-success' : 'text-destructive'} tooltip="Total Budget minus actual Spent" />
        <SummaryCard
          label="Variance"
          value={`${variance >= 0 ? '+' : ''}${fmtCurrency(variance)}`}
          className={variance >= 0 ? 'text-success' : 'text-destructive'}
          warning={variance < 0 ? 'Estimated spend exceeds total budget' : undefined}
          highlight={variance < 0}
          tooltip="Total Budget minus Estimated — positive means under budget"
        />
        <SummaryCard label="Utilization" value={`${utilization.toFixed(1)}%`} tooltip="Percentage of total budget actually spent so far" />
      </div>

      {breakdownByType.length > 0 && (
        <div className="space-y-2 mt-2">
          <p className="text-xs font-medium text-muted-foreground">Spend Breakdown (Estimated vs Actual)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {breakdownByType.map(b => (
              <div key={b.label} className="flex justify-between items-center text-sm px-4 py-2.5 rounded-xl border border-white/5 bg-background/40 backdrop-blur-md shadow-sm transition-colors hover:bg-background/60">
                <span className="font-medium">{b.label}</span>
                <div className="flex gap-4 text-xs">
                  <span className="text-muted-foreground">Est: <span className="font-mono">{fmtCurrency(b.estimated)}</span></span>
                  <span>Act: <span className="font-mono font-semibold text-foreground">{fmtCurrency(b.actual)}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, className, warning, highlight, tooltip }: { label: string; value: string; className?: string; warning?: string; highlight?: boolean; tooltip?: string }) {
  return (
    <div className={cn("group rounded-[16px] border border-white/5 bg-background/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)] p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-background/60", highlight && "border-destructive/30 bg-destructive/5 hover:bg-destructive/10")}>
      <div className="flex items-center gap-1.5 mb-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {tooltip && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px] text-xs">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p className={cn("text-lg font-semibold", className)}>{value}</p>
      {warning && (
        <p className="text-[10px] text-destructive mt-1">⚠️ {warning}</p>
      )}
    </div>
  );
}

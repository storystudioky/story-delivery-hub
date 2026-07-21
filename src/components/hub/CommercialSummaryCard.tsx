import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface CommercialSummaryRow {
  label: string;
  value: string;
  /** Renders the value in a muted/positive/negative tone. Defaults to "default". */
  tone?: "default" | "positive" | "negative";
}

export interface CommercialSummaryCardProps {
  title: string;
  rows: CommercialSummaryRow[];
  /** Optional 0-100 progress value rendered under the rows (e.g. budget utilization). */
  progressValue?: number;
  progressLabel?: string;
  className?: string;
}

const toneClassName: Record<NonNullable<CommercialSummaryRow["tone"]>, string> = {
  default: "text-foreground",
  positive: "text-primary",
  negative: "text-destructive",
};

/** Presentational commercial summary card — label/value rows with optional progress. */
export function CommercialSummaryCard({
  title,
  rows,
  progressValue,
  progressLabel,
  className,
}: CommercialSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-white/5 bg-background/40 p-4 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      <h4 className="mb-3 text-sm font-semibold text-foreground">{title}</h4>
      <dl className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className={cn("font-mono font-medium", toneClassName[row.tone ?? "default"])}>{row.value}</dd>
          </div>
        ))}
      </dl>
      {progressValue !== undefined && (
        <div className="mt-4 space-y-1.5">
          {progressLabel && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progressLabel}</span>
              <span>{Math.round(progressValue)}%</span>
            </div>
          )}
          <Progress value={progressValue} className="h-2" />
        </div>
      )}
    </div>
  );
}

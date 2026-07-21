#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 /path/to/story-dev /path/to/story-delivery-hub" >&2
  exit 1
fi

SPARK_REPO="$1"
HUB_REPO="$2"
BASELINE="679fe11962ef23e6cb09c85eda431c5b52451861"
SNAPSHOT_NAME="spark-679fe119"
SNAPSHOT_ROOT="$HUB_REPO/src/design-system-source/$SNAPSHOT_NAME"
DOCS_ROOT="$HUB_REPO/docs/design"
TMP_ZIP="$(mktemp -t delivery-hub-spark-design.XXXXXX.zip)"

for repo in "$SPARK_REPO" "$HUB_REPO"; do
  git -C "$repo" rev-parse --is-inside-work-tree >/dev/null
done

git -C "$SPARK_REPO" fetch origin main
CURRENT_MAIN="$(git -C "$SPARK_REPO" rev-parse origin/main)"
git -C "$SPARK_REPO" cat-file -e "${BASELINE}^{commit}"

echo "Current SPARK origin/main: $CURRENT_MAIN"
echo "Recorded design baseline: $BASELINE"

required_paths=(
  SPARK_STYLE_GUIDE.md
  src/index.css
  tailwind.config.ts
  src/pages/DesignSystem.tsx
  src/lib/utils.ts
  package.json
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
  src/components/ui/tooltip.tsx
  src/components/spark/PageHeader.tsx
  src/components/spark/MainLayout.tsx
  src/components/spark/SparkHeader.tsx
  src/components/campaigns/MetricsFilterBar.tsx
  src/components/campaigns/MetricsSummaryCards.tsx
  src/components/campaigns/MetricsTable.tsx
  src/components/campaigns/TaskRow.tsx
  src/components/campaigns/BudgetOverviewCard.tsx
  src/components/campaigns/BudgetTracker.tsx
)

optional_paths=(
  components.json
  src/components/ui/toast.tsx
  src/components/ui/toaster.tsx
  src/components/ui/sonner.tsx
  src/hooks/use-toast.ts
)

paths=("${required_paths[@]}")
for path in "${required_paths[@]}"; do
  git -C "$SPARK_REPO" cat-file -e "${BASELINE}:${path}" || {
    echo "Missing required baseline file: $path" >&2
    exit 1
  }
done

for path in "${optional_paths[@]}"; do
  if git -C "$SPARK_REPO" cat-file -e "${BASELINE}:${path}" 2>/dev/null; then
    paths+=("$path")
  else
    echo "Skipping optional file not present at baseline: $path" >&2
  fi
done

rm -rf "$SNAPSHOT_ROOT"
mkdir -p "$SNAPSHOT_ROOT" "$DOCS_ROOT"
git -C "$SPARK_REPO" archive --format=zip --output="$TMP_ZIP" "$BASELINE" "${paths[@]}"
unzip -q "$TMP_ZIP" -d "$SNAPSHOT_ROOT"
rm -f "$TMP_ZIP"
cp "$SNAPSHOT_ROOT/SPARK_STYLE_GUIDE.md" "$DOCS_ROOT/SPARK_STYLE_GUIDE_SOURCE.md"

(
  cd "$HUB_REPO"
  find "src/design-system-source/$SNAPSHOT_NAME" -type f -print0 | sort -z | xargs -0 sha256sum
) > "$DOCS_ROOT/SPARK_DESIGN_SNAPSHOT_SHA256.txt"

cat > "$DOCS_ROOT/SPARK_DESIGN_EXTRACTION_RESULT.md" <<RESULT
# SPARK Design Extraction Result

- Source repository: \`SPARK-SaaS/story-dev\`
- Recorded baseline: \`$BASELINE\`
- Current \`origin/main\` observed during extraction: \`$CURRENT_MAIN\`
- Snapshot directory: \`src/design-system-source/$SNAPSHOT_NAME\`
- Extracted files: ${#paths[@]}

The snapshot is a source reference only. Delivery Hub must adapt approved assets into Delivery Hub-owned components and must not import SPARK business logic or require the SPARK repository at runtime.
RESULT

echo "Extraction complete: $SNAPSHOT_ROOT"

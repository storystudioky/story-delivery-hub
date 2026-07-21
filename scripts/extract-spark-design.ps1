[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SparkRepoPath,

    [Parameter(Mandatory = $true)]
    [string]$DeliveryHubRepoPath,

    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Baseline = "679fe11962ef23e6cb09c85eda431c5b52451861"
$SnapshotName = "spark-679fe119"
$SnapshotRoot = Join-Path $DeliveryHubRepoPath "src/design-system-source/$SnapshotName"
$DocsRoot = Join-Path $DeliveryHubRepoPath "docs/design"
$TempZip = Join-Path ([System.IO.Path]::GetTempPath()) "delivery-hub-spark-design-$Baseline.zip"

function Assert-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found."
    }
}

function Assert-GitRepo([string]$Path, [string]$Label) {
    if (-not (Test-Path $Path)) {
        throw "$Label path does not exist: $Path"
    }
    & git -C $Path rev-parse --is-inside-work-tree *> $null
    if ($LASTEXITCODE -ne 0) {
        throw "$Label is not a Git working tree: $Path"
    }
}

Assert-Command "git"
Assert-GitRepo $SparkRepoPath "SPARK repository"
Assert-GitRepo $DeliveryHubRepoPath "Delivery Hub repository"

Write-Host "Fetching the current SPARK main branch..."
& git -C $SparkRepoPath fetch origin main
if ($LASTEXITCODE -ne 0) {
    throw "Unable to fetch SPARK origin/main."
}

$CurrentMain = (& git -C $SparkRepoPath rev-parse origin/main).Trim()
Write-Host "Current SPARK origin/main: $CurrentMain"
Write-Host "Recorded design baseline:   $Baseline"

& git -C $SparkRepoPath cat-file -e "${Baseline}^{commit}"
if ($LASTEXITCODE -ne 0) {
    throw "Recorded baseline commit is not available in the SPARK clone."
}

if ((Test-Path $SnapshotRoot) -and -not $Force) {
    throw "Snapshot already exists at $SnapshotRoot. Re-run with -Force only if you intentionally want to recreate the immutable snapshot."
}

$RequiredPaths = @(
    "SPARK_STYLE_GUIDE.md",
    "src/index.css",
    "tailwind.config.ts",
    "src/pages/DesignSystem.tsx",
    "src/lib/utils.ts",
    "package.json",
    "src/components/ui/alert-dialog.tsx",
    "src/components/ui/avatar.tsx",
    "src/components/ui/badge.tsx",
    "src/components/ui/breadcrumb.tsx",
    "src/components/ui/button.tsx",
    "src/components/ui/calendar.tsx",
    "src/components/ui/card.tsx",
    "src/components/ui/checkbox.tsx",
    "src/components/ui/dialog.tsx",
    "src/components/ui/drawer.tsx",
    "src/components/ui/dropdown-menu.tsx",
    "src/components/ui/input.tsx",
    "src/components/ui/label.tsx",
    "src/components/ui/popover.tsx",
    "src/components/ui/progress.tsx",
    "src/components/ui/select.tsx",
    "src/components/ui/sheet.tsx",
    "src/components/ui/skeleton.tsx",
    "src/components/ui/switch.tsx",
    "src/components/ui/table.tsx",
    "src/components/ui/tabs.tsx",
    "src/components/ui/textarea.tsx",
    "src/components/ui/tooltip.tsx",
    "src/components/spark/PageHeader.tsx",
    "src/components/spark/MainLayout.tsx",
    "src/components/spark/SparkHeader.tsx",
    "src/components/campaigns/MetricsFilterBar.tsx",
    "src/components/campaigns/MetricsSummaryCards.tsx",
    "src/components/campaigns/MetricsTable.tsx",
    "src/components/campaigns/TaskRow.tsx",
    "src/components/campaigns/BudgetOverviewCard.tsx",
    "src/components/campaigns/BudgetTracker.tsx"
)

$OptionalPaths = @(
    "components.json",
    "src/components/ui/toast.tsx",
    "src/components/ui/toaster.tsx",
    "src/components/ui/sonner.tsx",
    "src/hooks/use-toast.ts"
)

$PathsToArchive = New-Object System.Collections.Generic.List[string]

foreach ($Path in $RequiredPaths) {
    & git -C $SparkRepoPath cat-file -e "${Baseline}:$Path" 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Required design source file is missing at the recorded baseline: $Path"
    }
    $PathsToArchive.Add($Path)
}

foreach ($Path in $OptionalPaths) {
    & git -C $SparkRepoPath cat-file -e "${Baseline}:$Path" 2>$null
    if ($LASTEXITCODE -eq 0) {
        $PathsToArchive.Add($Path)
    } else {
        Write-Warning "Optional source file not present at baseline and will be skipped: $Path"
    }
}

if (Test-Path $TempZip) {
    Remove-Item $TempZip -Force
}
if (Test-Path $SnapshotRoot) {
    Remove-Item $SnapshotRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $SnapshotRoot -Force | Out-Null
New-Item -ItemType Directory -Path $DocsRoot -Force | Out-Null

Write-Host "Creating immutable archive from the recorded commit..."
$ArchiveArgs = @("-C", $SparkRepoPath, "archive", "--format=zip", "--output=$TempZip", $Baseline) + $PathsToArchive
& git @ArchiveArgs
if ($LASTEXITCODE -ne 0) {
    throw "git archive failed."
}

Expand-Archive -Path $TempZip -DestinationPath $SnapshotRoot -Force
Remove-Item $TempZip -Force

$StyleGuideSource = Join-Path $SnapshotRoot "SPARK_STYLE_GUIDE.md"
$StyleGuideDestination = Join-Path $DocsRoot "SPARK_STYLE_GUIDE_SOURCE.md"
Copy-Item $StyleGuideSource $StyleGuideDestination -Force

$ChecksumPath = Join-Path $DocsRoot "SPARK_DESIGN_SNAPSHOT_SHA256.txt"
$ChecksumLines = Get-ChildItem $SnapshotRoot -Recurse -File |
    Sort-Object FullName |
    ForEach-Object {
        $Hash = Get-FileHash $_.FullName -Algorithm SHA256
        $Relative = [System.IO.Path]::GetRelativePath($DeliveryHubRepoPath, $_.FullName).Replace("\", "/")
        "$($Hash.Hash.ToLowerInvariant())  $Relative"
    }
$ChecksumLines | Set-Content -Path $ChecksumPath -Encoding utf8

$MetadataPath = Join-Path $DocsRoot "SPARK_DESIGN_EXTRACTION_RESULT.md"
@"
# SPARK Design Extraction Result

- Source repository: `SPARK-SaaS/story-dev`
- Recorded baseline: `$Baseline`
- Current `origin/main` observed during extraction: `$CurrentMain`
- Snapshot directory: `src/design-system-source/$SnapshotName`
- Extracted files: $($PathsToArchive.Count)
- Generated: $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")

The snapshot is a source reference only. Delivery Hub must adapt approved assets into Delivery Hub-owned components and must not import SPARK business logic or require the SPARK repository at runtime.
"@ | Set-Content -Path $MetadataPath -Encoding utf8

Write-Host ""
Write-Host "Extraction complete."
Write-Host "Snapshot:  $SnapshotRoot"
Write-Host "Style guide: $StyleGuideDestination"
Write-Host "Checksums: $ChecksumPath"
Write-Host ""
Write-Host "Next: ask Cursor to adapt the snapshot into Delivery Hub-owned tokens and components."

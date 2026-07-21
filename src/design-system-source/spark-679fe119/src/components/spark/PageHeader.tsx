import { ArrowLeft, Clock, Download, Edit, History, FolderOpen, LucideIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: string;
}

interface TabItem {
  value: string;
  label: string;
  icon: LucideIcon;
  isLoading?: boolean;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  showProBadge?: boolean;
  stats?: StatItem[];
  customStats?: ReactNode;
  showActions?: boolean;
  backPath?: string;
  progressValue?: number;
  progressMax?: number;
  onDownload?: () => void;
  onEdit?: () => void;
  onViewHistory?: () => void;
  onViewFiles?: () => void;
  quickLinks?: ReactNode;
  /** Tab navigation inside rainbow panel */
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  /** Content rendered between title/description and rainbow panel */
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  showProBadge = false,
  stats,
  customStats,
  showActions = false,
  backPath,
  progressValue,
  progressMax = 7,
  onDownload,
  onEdit,
  onViewHistory,
  onViewFiles,
  quickLinks,
  tabs,
  activeTab,
  onTabChange,
  children,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const progressPercentage = progressValue !== undefined && progressMax > 0
    ? (progressValue / progressMax) * 100
    : 0;

  const hasStats = (stats && stats.length > 0) || !!customStats;
  const hasActions = showActions || !!quickLinks;
  const hasTabs = tabs && tabs.length > 0;
  const showPanel = hasStats || hasActions || hasTabs;

  return (
    <div className="mb-6 sm:mb-8">
      {/* Back Button + Title Row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
        {backPath && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => navigate(backPath)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl sm:text-2xl font-semibold leading-tight sm:leading-8 text-foreground/90 min-w-0">{title}</h1>
        {showProBadge && (
          <Badge variant="pro" className="shrink-0">Pro</Badge>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className={cn(
          'text-sm sm:text-base leading-6 text-weak mb-4 sm:mb-6',
          backPath ? 'pl-0 sm:pl-11' : ''
        )}>
          {description}
        </p>
      )}

      {/* Content between title and rainbow panel (e.g., campaign name row) */}
      {children}

      {/* Stats, Actions & Tabs — wrapped in rainbow border */}
      {showPanel ? (
        <div className="rainbow-border rounded-[20px] p-[3px] mb-4 sm:mb-6">
          <div className="w-full bg-card rounded-[17px] transition-all duration-300">

          {/* Padded Container for all panel contents */}
          <div className={cn(
            'px-4 sm:px-6 lg:px-8',
            hasStats || hasActions ? 'py-6 sm:py-10' : 'py-4 sm:py-6'
          )}>
            {/* Simple stats from stats[] prop */}
            {stats && stats.length > 0 && !customStats && (
              <div className={cn(
                'grid grid-cols-2 sm:flex sm:flex-wrap sm:items-start sm:justify-between w-full md:w-auto md:gap-x-12 lg:gap-x-16 gap-4 sm:gap-y-6',
                (hasActions || hasTabs) && 'mb-6 sm:mb-10'
              )}>
                {stats.map((stat, index) => (
                  <div key={index} className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider font-medium text-foreground/50">{stat.label}</span>
                    <span className="text-lg sm:text-2xl font-semibold tracking-tight text-foreground/90 truncate">{stat.value}</span>
                    {/* Progress bar under Progress stat */}
                    {stat.label === 'Progress' && progressValue !== undefined && (
                      <Progress value={progressPercentage} className="h-2 w-full max-w-[8rem] mt-2" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Custom stats layout (e.g., CampaignOverview with progress bars) */}
            {customStats}

            {/* Action Buttons (glassmorphic) */}
            {showActions && (
              <div className={cn('flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3', hasTabs && 'mb-6 sm:mb-10')}>
                {onDownload && (
                  <Button variant="outline" className="rounded-[12px] bg-white/50 backdrop-blur-sm border-transparent shadow-sm hover:border-transparent hover:bg-white/80 hover:shadow-md transition-all duration-200 w-full sm:w-auto" onClick={onDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Results
                  </Button>
                )}
                {onEdit && (
                  <Button variant="outline" className="rounded-[12px] bg-white/50 backdrop-blur-sm border-transparent shadow-sm hover:border-transparent hover:bg-white/80 hover:shadow-md transition-all duration-200 w-full sm:w-auto" onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit & Regenerate
                  </Button>
                )}
                {onViewHistory && (
                  <Button variant="outline" className="rounded-[12px] bg-white/50 backdrop-blur-sm border-transparent shadow-sm hover:border-transparent hover:bg-white/80 hover:shadow-md transition-all duration-200 w-full sm:w-auto" onClick={onViewHistory}>
                    <History className="mr-2 h-4 w-4" />
                    Version History
                  </Button>
                )}
                {onViewFiles && (
                  <Button variant="outline" className="rounded-[12px] bg-white/50 backdrop-blur-sm border-transparent shadow-sm hover:border-transparent hover:bg-white/80 hover:shadow-md transition-all duration-200 w-full sm:w-auto" onClick={onViewFiles}>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    View in Files
                  </Button>
                )}
              </div>
            )}

            {/* Quick Links */}
            {quickLinks && (
              <div className={cn('flex flex-wrap items-center gap-2 sm:gap-3', hasTabs && 'mb-6 sm:mb-10')}>
                {quickLinks}
              </div>
            )}

            {/* Tab Navigation — horizontal scroll on mobile */}
            {hasTabs && (
              <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory hide-scrollbar sm:flex-wrap sm:overflow-visible sm:pb-0">
                {tabs.map((tab) => (
                  <Button
                    key={tab.value}
                    variant="outline"
                    onClick={() => onTabChange?.(tab.value)}
                    className={cn(
                      'rounded-[12px] transition-all duration-200 border-transparent shadow-sm shrink-0 snap-start min-h-[44px]',
                      activeTab === tab.value
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-md'
                        : 'bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:shadow-md'
                    )}
                  >
                    {tab.isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <tab.icon className="mr-2 h-4 w-4" />
                    )}
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      ) : null}
    </div>
  );
}

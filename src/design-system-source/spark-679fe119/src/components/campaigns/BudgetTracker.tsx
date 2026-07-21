import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Trash2, CalendarIcon, Sparkles, Check, X, Settings2, Filter, Paperclip, StickyNote, Pencil } from 'lucide-react';
import { useBudgetItems, type BudgetItemRow } from '@/hooks/useBudgetItems';
import { BUDGET_ITEM_TYPES, SOURCE_LABELS } from '@/lib/metrics-constants';
import { ChannelCombobox } from './ChannelCombobox';
import { useWorkspaceChannels } from '@/hooks/useWorkspaceChannels';
import { SmartBudgetImport } from './SmartBudgetImport';
import { ShareBudgetButton } from './ShareBudgetButton';
import { BudgetSetupForm } from './BudgetSetupForm';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { format } from 'date-fns';
import type { CampaignBudget } from '@/hooks/useCampaignBudget';

interface Props {
  campaignId: string;
  budget?: CampaignBudget | null;
  budgetSettingsOpen?: boolean;
  onBudgetSettingsChange?: (open: boolean) => void;
}

const GRID_COLS = "grid-cols-[minmax(120px,1.5fr)_minmax(100px,1fr)_90px_minmax(120px,1.5fr)_minmax(160px,2fr)_minmax(110px,1fr)_minmax(80px,1fr)_36px_60px]";

type FilterTab = 'all' | 'estimates' | 'actuals';

/* ── Inline-editable row ───────────────────────────────────── */

interface EditableRowProps {
  item: BudgetItemRow;
  onSave: (id: string, updates: Partial<BudgetItemRow>) => void;
  onDelete: (id: string) => void;
  onUploadReceipt: (itemId: string, file: File) => void;
  onRemoveReceipt: (itemId: string, receiptPath: string) => void;
  getReceiptUrl: (path: string) => string | null;
  isSaving: boolean;
  channelsHook: ReturnType<typeof useWorkspaceChannels>;
}

function EditableRow({ item, onSave, onDelete, onUploadReceipt, onRemoveReceipt, getReceiptUrl, isSaving, channelsHook }: EditableRowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { customChannels, addCustomChannel } = channelsHook;
  const [editing, setEditing] = useState(false);
  const lastSavedRef = useRef<{ channel?: string | null } | null>(null);
  const [draft, setDraft] = useState({
    item_type: item.item_type,
    amount: String(item.amount),
    channel: item.channel || '',
    description: item.description || '',
    date: item.date ? new Date(item.date) : undefined as Date | undefined,
    is_estimate: item.is_estimate,
    notes: item.notes || '',
  });

  // Clear optimistic display once server data arrives with the saved value
  useEffect(() => {
    if (lastSavedRef.current && item.channel === lastSavedRef.current.channel) {
      lastSavedRef.current = null;
    }
  }, [item.channel]);

  const startEdit = () => {
    setDraft({
      item_type: item.item_type,
      amount: String(item.amount),
      channel: item.channel || '',
      description: item.description || '',
      date: item.date ? new Date(item.date) : undefined,
      is_estimate: item.is_estimate,
      notes: item.notes || '',
    });
    setEditing(true);
  };

  const cancel = () => setEditing(false);

  const save = () => {
    const amount = Number(draft.amount);
    if (isNaN(amount) || amount < 0) return;
    const channelValue = draft.channel || null;
    lastSavedRef.current = { channel: channelValue };
    // Capture the original estimate the first time this row becomes an Actual
    // (or is amended after already being an Actual) so the user can see the
    // difference between planned and final spend.
    const becameActual = item.is_estimate && !draft.is_estimate;
    const amendedActual = !item.is_estimate && !draft.is_estimate && amount !== Number(item.amount);
    const shouldCaptureOriginal =
      item.original_estimate_amount == null && (becameActual || amendedActual);
    onSave(item.id, {
      item_type: draft.item_type,
      amount,
      channel: channelValue,
      description: draft.description || null,
      date: draft.date ? format(draft.date, 'yyyy-MM-dd') : null,
      is_estimate: draft.is_estimate,
      notes: draft.notes.trim() ? draft.notes.trim() : null,
      ...(shouldCaptureOriginal ? { original_estimate_amount: Number(item.amount) } : {}),
    });
    setEditing(false);
  };

  const typeLabel = (type: string) => BUDGET_ITEM_TYPES.find(t => t.value === type)?.label || type;
  const sourceLabel = (source: string) => SOURCE_LABELS[source] || source;
  if (!editing) {
    const orig = item.original_estimate_amount != null ? Number(item.original_estimate_amount) : null;
    const variance = orig != null ? Number(item.amount) - orig : null;
    return (
      <div
        className={`grid ${GRID_COLS} items-center gap-4 px-4 py-3 rounded-[12px] border border-white/5 bg-background/50 hover:bg-background/80 transition-colors shadow-sm cursor-pointer group`}
        onDoubleClick={startEdit}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') startEdit(); }}
      >
        <div className="font-medium text-sm truncate">{typeLabel(item.item_type)}</div>
        <div className="text-right font-mono text-sm truncate leading-tight">
          <div>${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          {orig != null && variance !== 0 && (
            <div className={`text-[10px] font-normal ${variance! > 0 ? 'text-destructive' : 'text-success'}`}>
              Est ${orig.toLocaleString(undefined, { minimumFractionDigits: 2 })} · {variance! > 0 ? '+' : ''}${variance!.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          )}
        </div>
        <div>
          <Badge variant={item.is_estimate ? 'secondary' : 'default'} className="text-xs">
            {item.is_estimate ? 'Estimate' : 'Actual'}
          </Badge>
        </div>
        <div className="text-sm truncate">{(lastSavedRef.current?.channel ?? item.channel) || '—'}</div>
        <div className="text-sm truncate flex items-center gap-1.5 min-w-0">
          <span className="truncate">{item.description || '—'}</span>
          {item.notes && (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <StickyNote className="h-3.5 w-3.5 text-primary shrink-0" onClick={(e) => e.stopPropagation()} />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-xs whitespace-pre-wrap">
                  {item.notes}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="text-sm text-muted-foreground truncate">{item.date ? format(new Date(item.date), 'MMM d') : '—'}</div>
        <div>
          <Badge variant="outline" className="text-xs truncate">{sourceLabel(item.source)}</Badge>
        </div>
        <div className="flex justify-center">
          <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadReceipt(item.id, f); e.target.value = ''; }} />
          <button
            type="button"
            className={`h-7 w-7 flex items-center justify-center rounded-md transition-colors ${item.receipt_path ? 'text-primary hover:bg-primary/10' : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/50'}`}
            title={item.receipt_path ? 'View receipt' : 'Upload receipt'}
            onClick={(e) => {
              e.stopPropagation();
              if (item.receipt_path) {
                const url = getReceiptUrl(item.receipt_path);
                if (url) window.open(url, '_blank');
              } else {
                fileInputRef.current?.click();
              }
            }}
          >
            <Paperclip className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex justify-end items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Edit item"
            onClick={(e) => { e.stopPropagation(); startEdit(); }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid ${GRID_COLS} items-start gap-4 px-4 py-2 rounded-[12px] border border-primary/20 bg-primary/5 shadow-sm`}>
      <div>
        <Select value={draft.item_type} onValueChange={(v) => setDraft(d => ({ ...d, item_type: v }))}>
          <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {BUDGET_ITEM_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={draft.amount}
          onChange={(e) => setDraft(d => ({ ...d, amount: e.target.value }))}
          className="h-8 text-xs w-full text-right font-mono"
          autoFocus
        />
      </div>
      <div className="flex h-8">
        <button
          type="button"
          onClick={() => setDraft(d => ({ ...d, is_estimate: true }))}
          className={`flex-1 text-[10px] font-medium rounded-l-md border border-r-0 transition-colors ${draft.is_estimate ? 'bg-secondary text-secondary-foreground border-secondary' : 'bg-background text-muted-foreground border-input hover:bg-muted'}`}
        >Est</button>
        <button
          type="button"
          onClick={() => setDraft(d => ({ ...d, is_estimate: false }))}
          className={`flex-1 text-[10px] font-medium rounded-r-md border transition-colors ${!draft.is_estimate ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-input hover:bg-muted'}`}
        >Act</button>
      </div>
      <div>
        <ChannelCombobox
          value={draft.channel}
          onValueChange={(v) => setDraft(d => ({ ...d, channel: v }))}
          compact
          triggerClassName="w-full"
          customChannels={customChannels}
          onCustomChannelAdd={(n) => addCustomChannel.mutate(n)}
        />
      </div>
      <div className="space-y-1">
        <Input
          value={draft.description}
          onChange={(e) => setDraft(d => ({ ...d, description: e.target.value }))}
          className="h-8 text-xs w-full"
          placeholder="Description"
        />
        <Input
          value={draft.notes}
          onChange={(e) => setDraft(d => ({ ...d, notes: e.target.value }))}
          className="h-7 text-[11px] w-full"
          placeholder="Note (e.g. why amount changed)"
        />
      </div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs w-full justify-start px-2">
              <CalendarIcon className="h-3 w-3 mr-1 shrink-0" />
              <span className="truncate">{draft.date ? format(draft.date, 'MMM d') : 'Date'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
            <Calendar mode="single" selected={draft.date} onSelect={(d) => setDraft(f => ({ ...f, date: d || undefined }))} className="pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Badge variant="outline" className="text-xs truncate">{sourceLabel(item.source)}</Badge>
      </div>
      <div className="flex justify-center">
        <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadReceipt(item.id, f); e.target.value = ''; }} />
        {item.receipt_path ? (
          <button
            type="button"
            className="h-7 w-7 flex items-center justify-center rounded-md text-primary hover:bg-primary/10 transition-colors"
            title="Remove receipt"
            onClick={() => onRemoveReceipt(item.id, item.receipt_path!)}
          >
            <Paperclip className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/50 transition-colors"
            title="Upload receipt"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-primary" onClick={save} disabled={isSaving}>
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancel}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ── New-row form (inline) ─────────────────────────────────── */

interface NewRowProps {
  onAdd: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
  channelsHook: ReturnType<typeof useWorkspaceChannels>;
}

function NewRow({ onAdd, onCancel, isPending, channelsHook }: NewRowProps) {
  const { customChannels, addCustomChannel } = channelsHook;
  const [draft, setDraft] = useState({
    item_type: 'media_spend',
    amount: '',
    channel: '',
    description: '',
    date: undefined as Date | undefined,
    is_estimate: false,
  });

  const save = () => {
    const amount = Number(draft.amount);
    if (isNaN(amount) || amount < 0 || !draft.amount) return;
    onAdd({
      item_type: draft.item_type,
      amount,
      channel: draft.channel || undefined,
      description: draft.description || undefined,
      date: draft.date ? format(draft.date, 'yyyy-MM-dd') : undefined,
      is_estimate: draft.is_estimate,
    });
  };

  return (
    <div className={`grid ${GRID_COLS} items-center gap-4 px-4 py-2 rounded-[12px] border border-primary/20 bg-primary/5 shadow-sm`}>
      <div>
        <Select value={draft.item_type} onValueChange={(v) => setDraft(d => ({ ...d, item_type: v }))}>
          <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {BUDGET_ITEM_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={draft.amount}
          onChange={(e) => setDraft(d => ({ ...d, amount: e.target.value }))}
          className="h-8 text-xs w-full text-right font-mono"
          placeholder="0.00"
          autoFocus
        />
      </div>
      <div className="flex items-center gap-1.5 truncate">
        <Switch
          checked={draft.is_estimate}
          onCheckedChange={(v) => setDraft(d => ({ ...d, is_estimate: v }))}
          className="scale-75"
        />
        <span className="text-xs text-muted-foreground">{draft.is_estimate ? 'Est' : 'Act'}</span>
      </div>
      <div>
        <ChannelCombobox
          value={draft.channel}
          onValueChange={(v) => setDraft(d => ({ ...d, channel: v }))}
          compact
          triggerClassName="w-full"
          customChannels={customChannels}
          onCustomChannelAdd={(n) => addCustomChannel.mutate(n)}
        />
      </div>
      <div>
        <Input
          value={draft.description}
          onChange={(e) => setDraft(d => ({ ...d, description: e.target.value }))}
          className="h-8 text-xs w-full"
          placeholder="Description"
        />
      </div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs w-full justify-start px-2">
              <CalendarIcon className="h-3 w-3 mr-1 shrink-0" />
              <span className="truncate">{draft.date ? format(draft.date, 'MMM d') : 'Date'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
            <Calendar mode="single" selected={draft.date} onSelect={(d) => setDraft(f => ({ ...f, date: d || undefined }))} className="pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>
      <div />
      <div />
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-primary" onClick={save} disabled={isPending || !draft.amount}>
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onCancel}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────── */

export function BudgetTracker({ campaignId, budget, budgetSettingsOpen, onBudgetSettingsChange }: Props) {
  const { items, addItem, updateItem, deleteItem, uploadReceipt, removeReceipt, getReceiptUrl } = useBudgetItems(campaignId);
  const channelsHook = useWorkspaceChannels();
  const [smartImportOpen, setSmartImportOpen] = useState(false);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [addingNew, setAddingNew] = useState(false);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const filteredItems = useMemo(() => {
    if (filter === 'estimates') return items.filter(i => i.is_estimate);
    if (filter === 'actuals') return items.filter(i => !i.is_estimate);
    return items;
  }, [items, filter]);

  const handleInlineSave = useCallback((id: string, updates: Partial<BudgetItemRow>) => {
    setSavingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    updateItem.mutate(
      { id, ...updates },
      {
        onSettled: () => {
          setSavingIds((prev) => {
            if (!prev.has(id)) return prev;
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      },
    );
  }, [updateItem]);

  const handleAdd = useCallback((data: any) => {
    addItem.mutate(data, { onSuccess: () => setAddingNew(false) });
  }, [addItem]);

  const handleUploadReceipt = useCallback((itemId: string, file: File) => {
    uploadReceipt.mutate({ itemId, file });
  }, [uploadReceipt]);

  const handleRemoveReceipt = useCallback((itemId: string, receiptPath: string) => {
    removeReceipt.mutate({ itemId, receiptPath });
  }, [removeReceipt]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="text-heading-sm">Expense Tracker</h4>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onBudgetSettingsChange?.(!budgetSettingsOpen)} className="h-8 shadow-sm">
            <Settings2 className="h-4 w-4 mr-1" /> {budget ? 'Edit Budget' : 'Set Up Budget'}
          </Button>
          <ShareBudgetButton campaignId={campaignId} />
          <Button variant="outline" size="sm" onClick={() => setSmartImportOpen(true)} className="h-8 shadow-sm">
            <Sparkles className="h-4 w-4 mr-1" /> Smart Import
          </Button>
          <Button variant="cta" size="sm" onClick={() => setAddingNew(true)} className="h-8 shadow-sm">
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
      </div>

      {onBudgetSettingsChange && (
        <Collapsible open={budgetSettingsOpen} onOpenChange={onBudgetSettingsChange}>
          <CollapsibleContent>
            <BudgetSetupForm campaignId={campaignId} />
          </CollapsibleContent>
        </Collapsible>
      )}

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
          <TabsList className="text-xs">
            <TabsTrigger value="all" className="text-xs">All ({items.length})</TabsTrigger>
            <TabsTrigger value="estimates" className="text-xs">Estimates ({items.filter(i => i.is_estimate).length})</TabsTrigger>
            <TabsTrigger value="actuals" className="text-xs">Actuals ({items.filter(i => !i.is_estimate).length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredItems.length === 0 && !addingNew ? (
        <div className="rounded-[20px] border border-white/5 bg-background/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-12 text-center">
          <p className="text-sm text-muted-foreground">No {filter === 'all' ? 'items' : filter} tracked yet.</p>
          <Button variant="cta" size="sm" className="mt-2" onClick={() => setAddingNew(true)}>
            Add your first item
          </Button>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          <div className={`grid ${GRID_COLS} items-center gap-4 px-4 py-3 mb-2 border-b border-border/50 text-xs font-medium text-muted-foreground`}>
            <div>Type</div>
            <div className="text-right">Amount</div>
            <div>Category</div>
            <div>Channel</div>
            <div>Description</div>
            <div>Date</div>
            <div>Source</div>
            <div className="text-center"><Paperclip className="h-3 w-3 mx-auto" /></div>
            <div></div>
          </div>
          
          <div className="space-y-2">
            {addingNew && (
              <NewRow
                onAdd={handleAdd}
                onCancel={() => setAddingNew(false)}
                isPending={addItem.isPending}
                channelsHook={channelsHook}
              />
            )}
            {filteredItems.map(item => (
              <EditableRow
                key={item.id}
                item={item}
                onSave={handleInlineSave}
                onDelete={(id) => deleteItem.mutate(id)}
                onUploadReceipt={handleUploadReceipt}
                onRemoveReceipt={handleRemoveReceipt}
                getReceiptUrl={getReceiptUrl}
                isSaving={savingIds.has(item.id)}
                channelsHook={channelsHook}
              />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">Click the pencil icon (or double-click a row) to edit amount, date, note, or switch between Estimate and Actual.</p>

      <SmartBudgetImport open={smartImportOpen} onOpenChange={setSmartImportOpen} campaignId={campaignId} />
    </div>
  );
}

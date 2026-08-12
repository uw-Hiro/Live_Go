import { useState } from 'react';
import { Plus, Trash2, Wallet, Pencil, Check, X } from 'lucide-react';
import type { BudgetCategory, BudgetItem } from '@/types';
import { BUDGET_CATEGORIES } from '@/data/presets';
import { formatYen, formatYenPlain } from '@/lib/format';

interface BudgetTrackerProps {
  items: BudgetItem[];
  total: number;
  limit: number | null;
  onAdd: (
    label: string,
    category: BudgetCategory,
    amount: number
  ) => Promise<void>;
  onUpdate: (
    id: string,
    patch: Partial<Pick<BudgetItem, 'label' | 'category' | 'amount'>>
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function BudgetTracker({
  items,
  total,
  limit,
  onAdd,
  onUpdate,
  onDelete,
}: BudgetTrackerProps) {
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<BudgetCategory>('transport');
  const [newAmount, setNewAmount] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editCategory, setEditCategory] = useState<BudgetCategory>('transport');
  const [editAmount, setEditAmount] = useState('');

  const byCategory = BUDGET_CATEGORIES.map((cat) => ({
    ...cat,
    items: items.filter((i) => i.category === cat.id),
    sum: items
      .filter((i) => i.category === cat.id)
      .reduce((acc, i) => acc + i.amount, 0),
  }));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const label = newLabel.trim();
    const amount = parseInt(newAmount.replace(/[,，¥\s]/g, ''), 10);
    if (!label || Number.isNaN(amount) || amount < 0) return;
    setAdding(true);
    try {
      await onAdd(label, newCategory, amount);
      setNewLabel('');
      setNewAmount('');
      setNewCategory('transport');
    } finally {
      setAdding(false);
    }
  }

  function startEdit(item: BudgetItem) {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditCategory(item.category);
    setEditAmount(String(item.amount));
  }

  async function saveEdit(id: string) {
    const label = editLabel.trim();
    const amount = parseInt(editAmount.replace(/[,，¥\s]/g, ''), 10);
    if (!label || Number.isNaN(amount) || amount < 0) return;
    await onUpdate(id, { label, category: editCategory, amount });
    setEditingId(null);
  }

  return (
    <div className="rounded-3xl bg-ink-850/80 border border-white/5 shadow-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-coral-500/15 text-coral-400 flex items-center justify-center">
          <Wallet className="w-4 h-4" />
        </div>
        <h3 className="font-display text-lg font-bold text-white">予算計算</h3>
      </div>

      {/* Total banner */}
      <div className="px-5 sm:px-6 py-5 border-b border-white/5 bg-gradient-to-br from-ink-900/60 to-transparent">
        <div className="flex items-end justify-between flex-wrap gap-2">
          <div>
            <div className="text-xs text-ink-500 mb-1">合計出費</div>
            <div className="font-display text-3xl font-extrabold text-white tabular-nums">
              {formatYen(total)}
            </div>
          </div>
          {limit != null && (
            <div className="text-right">
              <div className="text-xs text-ink-500 mb-1">予算上限</div>
              <div
                className={`text-sm font-semibold ${
                  total > limit ? 'text-coral-400' : 'text-ink-500'
                }`}
              >
                {formatYen(limit)}
              </div>
            </div>
          )}
        </div>

        {/* Category breakdown bar */}
        {total > 0 && limit !== 0 && (
          <div className="mt-4">
            <div className="flex h-2.5 rounded-full overflow-hidden bg-ink-800">
              {byCategory.map(
                (cat) =>
                  cat.sum > 0 && (
                    <div
                      key={cat.id}
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${(cat.sum / total) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                      title={`${cat.label}: ${formatYen(cat.sum)}`}
                    />
                  )
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
              {byCategory.map(
                (cat) =>
                  cat.sum > 0 && (
                    <div
                      key={cat.id}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-ink-500">{cat.label}</span>
                      <span className="text-white font-medium tabular-nums">
                        {formatYenPlain(cat.sum)}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="px-5 sm:px-6 py-4 border-b border-white/5 bg-ink-900/40"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="項目名（例: 新幹線往復）"
            className="flex-1 rounded-lg bg-ink-800 border border-white/5 focus:border-coral-500/50 focus:ring-2 focus:ring-coral-500/20 outline-none px-3 py-2 text-sm text-white placeholder:text-ink-600 transition"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as BudgetCategory)}
            className="rounded-lg bg-ink-800 border border-white/5 focus:border-coral-500/50 focus:ring-2 focus:ring-coral-500/20 outline-none px-3 py-2 text-sm text-ink-500 transition"
          >
            {BUDGET_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink-800 text-white">
                {c.label}
              </option>
            ))}
          </select>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-600 text-sm">
              ¥
            </span>
            <input
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              inputMode="numeric"
              placeholder="金額"
              className="w-full sm:w-28 rounded-lg bg-ink-800 border border-white/5 focus:border-coral-500/50 focus:ring-2 focus:ring-coral-500/20 outline-none pl-7 pr-3 py-2 text-sm text-white placeholder:text-ink-600 tabular-nums transition"
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newLabel.trim() || !newAmount}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-coral-500 hover:bg-coral-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="w-4 h-4" /> 追加
          </button>
        </div>
      </form>

      {/* Items */}
      <div className="max-h-[480px] overflow-y-auto p-3 sm:p-4 space-y-1">
        {items.length === 0 && (
          <div className="text-center py-10 text-ink-600 text-sm">
            まだ出費がありません。交通費や宿泊費から記録してみましょう。
          </div>
        )}
        {items.map((item) => {
          const cat = BUDGET_CATEGORIES.find((c) => c.id === item.category);
          const editing = editingId === item.id;
          return (
            <div
              key={item.id}
              className="group flex items-center gap-3 rounded-xl bg-ink-900/40 hover:bg-ink-900/80 border border-transparent hover:border-white/5 transition px-3 py-2.5 animate-fade-in"
            >
              {editing ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="flex-1 rounded-lg bg-ink-800 border border-white/5 focus:border-coral-500/50 outline-none px-2.5 py-1.5 text-sm text-white"
                  />
                  <select
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(e.target.value as BudgetCategory)
                    }
                    className="rounded-lg bg-ink-800 border border-white/5 focus:border-coral-500/50 outline-none px-2.5 py-1.5 text-sm text-ink-500"
                  >
                    {BUDGET_CATEGORIES.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                        className="bg-ink-800 text-white"
                      >
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-600 text-sm">
                      ¥
                    </span>
                    <input
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      inputMode="numeric"
                      className="w-full sm:w-24 rounded-lg bg-ink-800 border border-white/5 focus:border-coral-500/50 outline-none pl-6 pr-2 py-1.5 text-sm text-white tabular-nums"
                    />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="rounded-lg bg-mint-500 hover:bg-mint-600 text-ink-950 p-1.5"
                      aria-label="保存"
                    >
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg bg-white/5 hover:bg-white/10 text-ink-500 p-1.5"
                      aria-label="キャンセル"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span
                    className="w-1.5 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: cat?.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">
                      {item.label}
                    </div>
                    <div className="text-xs text-ink-600 mt-0.5">
                      {cat?.label}
                    </div>
                  </div>
                  <div className="font-semibold text-white tabular-nums text-sm shrink-0">
                    {formatYen(item.amount)}
                  </div>
                  <button
                    onClick={() => startEdit(item)}
                    className="opacity-0 group-hover:opacity-100 text-ink-600 hover:text-white transition p-1"
                    aria-label="編集"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-ink-600 hover:text-coral-400 transition p-1"
                    aria-label="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Plus, Check, Trash2, Package } from 'lucide-react';
import type { PackingCategory, PackingItem } from '@/types';
import { PACKING_CATEGORIES } from '@/data/presets';

interface PackingChecklistProps {
  items: PackingItem[];
  onAdd: (name: string, category: PackingCategory) => Promise<void>;
  onToggle: (id: string, checked: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function PackingChecklist({
  items,
  onAdd,
  onToggle,
  onDelete,
}: PackingChecklistProps) {
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<PackingCategory>('essentials');
  const [adding, setAdding] = useState(false);

  const grouped = PACKING_CATEGORIES.map((cat) => ({
    ...cat,
    items: items.filter((i) => i.category === cat.id),
  })).filter((g) => g.items.length > 0);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    try {
      await onAdd(name, newCategory);
      setNewName('');
      setNewCategory('essentials');
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="rounded-3xl bg-ink-850/80 border border-white/5 shadow-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-mint-500/15 text-mint-400 flex items-center justify-center">
          <Package className="w-4 h-4" />
        </div>
        <h3 className="font-display text-lg font-bold text-white">持ち物リスト</h3>
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="px-5 sm:px-6 py-4 border-b border-white/5 bg-ink-900/40"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="持ち物を追加…"
            className="flex-1 rounded-lg bg-ink-800 border border-white/5 focus:border-mint-500/50 focus:ring-2 focus:ring-mint-500/20 outline-none px-3 py-2 text-sm text-white placeholder:text-ink-600 transition"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as PackingCategory)}
            className="rounded-lg bg-ink-800 border border-white/5 focus:border-mint-500/50 focus:ring-2 focus:ring-mint-500/20 outline-none px-3 py-2 text-sm text-ink-500 transition"
          >
            {PACKING_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink-800 text-white">
                {c.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={adding || !newName.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-mint-500 hover:bg-mint-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition px-4 py-2 text-sm font-semibold text-ink-950"
          >
            <Plus className="w-4 h-4" /> 追加
          </button>
        </div>
      </form>

      {/* Items grouped by category */}
      <div className="max-h-[560px] overflow-y-auto p-3 sm:p-4 space-y-4">
        {grouped.length === 0 && (
          <div className="text-center py-10 text-ink-600 text-sm">
            まだ持ち物がありません。上から追加してみましょう。
          </div>
        )}
        {grouped.map((group) => (
          <div key={group.id}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {group.label}
              </span>
              <span className="text-xs text-ink-600">
                {group.items.filter((i) => i.checked).length}/{group.items.length}
              </span>
            </div>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center gap-3 rounded-xl bg-ink-900/40 hover:bg-ink-900/80 border border-transparent hover:border-white/5 transition px-3 py-2.5 animate-fade-in"
                >
                  <button
                    onClick={() => onToggle(item.id, !item.checked)}
                    className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                      item.checked
                        ? 'bg-mint-500 border-mint-500'
                        : 'border-ink-600 hover:border-mint-500/60'
                    }`}
                    aria-label={item.checked ? '未完了にする' : '完了にする'}
                  >
                    {item.checked && (
                      <Check
                        className="w-3.5 h-3.5 text-ink-950"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm transition ${
                      item.checked
                        ? 'text-ink-600 line-through'
                        : 'text-white'
                    }`}
                  >
                    {item.name}
                  </span>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-ink-600 hover:text-coral-400 transition p-1"
                    aria-label="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

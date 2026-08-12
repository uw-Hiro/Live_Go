import { useEffect, useState } from 'react';
import { X, CalendarDays, Wallet, Sparkles, MapPin } from 'lucide-react';
import type { Trip, TripType } from '@/types';
import { TRIP_TYPE_LABELS } from '@/data/presets';
import { PACKING_PRESETS } from '@/data/presets';

interface TripFormModalProps {
  open: boolean;
  initialTrip?: Trip | null;
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    trip_type: TripType;
    trip_date: string | null;
    budget_limit: number | null;
    location: string | null;
  }) => Promise<void>;
}

const TRIP_TYPES: TripType[] = ['day', 'overnight', 'festival'];

export function TripFormModal({
  open,
  initialTrip,
  onClose,
  onSubmit,
}: TripFormModalProps) {
  const isEdit = Boolean(initialTrip);
  const [title, setTitle] = useState('');
  const [tripType, setTripType] = useState<TripType>('day');
  const [tripDate, setTripDate] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialTrip?.title ?? '');
      setTripType(initialTrip?.trip_type ?? 'day');
      setTripDate(initialTrip?.trip_date ?? '');
      setBudgetLimit(
        initialTrip?.budget_limit != null ? String(initialTrip.budget_limit) : ''
      );
      setLocation(initialTrip?.location ?? '');
      setError(null);
    }
  }, [open, initialTrip]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError('タイトルを入力してください');
      return;
    }
    const limitRaw = budgetLimit.replace(/[,，¥\s]/g, '');
    const limit =
      limitRaw === '' ? null : Math.max(0, parseInt(limitRaw, 10) || 0);
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        title: t,
        trip_type: tripType,
        trip_date: tripDate || null,
        budget_limit: limit,
        location: location.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  const presetCount = PACKING_PRESETS[tripType].length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-3xl bg-ink-850 border border-white/10 shadow-card animate-pop-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {isEdit ? 'ライブを編集' : '新規ライブプラン'}
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              {isEdit
                ? 'プランの情報を更新します'
                : '旅行タイプに応じた持ち物を自動生成します'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg text-ink-500 hover:text-white hover:bg-white/5 p-2 transition"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-ink-500 mb-1.5">
              タイトル
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 〇〇くん 東京ドームライブ"
              autoFocus
              className="w-full rounded-xl bg-ink-800 border border-white/5 focus:border-coral-500/50 focus:ring-2 focus:ring-coral-500/20 outline-none px-4 py-2.5 text-sm text-white placeholder:text-ink-600 transition"
            />
          </div>

          {/* Trip type */}
          <div>
            <label className="block text-sm font-medium text-ink-500 mb-2">
              ライブタイプ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TRIP_TYPES.map((type) => {
                const active = tripType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTripType(type)}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                      active
                        ? 'bg-coral-500/15 border-coral-500/50 text-coral-400 ring-1 ring-coral-500/20'
                        : 'bg-ink-800 border-white/5 text-ink-500 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {TRIP_TYPE_LABELS[type]}
                  </button>
                );
              })}
            </div>
            {!isEdit && (
              <p className="text-xs text-ink-600 mt-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-ember-400" />
                このタイプの持ち物 {presetCount} 個を自動で追加します
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-ink-500 mb-1.5">
              <CalendarDays className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              ライブ日（任意）
            </label>
            <input
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              className="w-full rounded-xl bg-ink-800 border border-white/5 focus:border-coral-500/50 focus:ring-2 focus:ring-coral-500/20 outline-none px-4 py-2.5 text-sm text-white transition [color-scheme:dark]"
            />
          </div>

          {/* Budget limit */}
          <div>
            <label className="block text-sm font-medium text-ink-500 mb-1.5">
              <Wallet className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              予算上限（任意）
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 text-sm">
                ¥
              </span>
              <input
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                inputMode="numeric"
                placeholder="例: 30000"
                className="w-full rounded-xl bg-ink-800 border border-white/5 focus:border-coral-500/50 focus:ring-2 focus:ring-coral-500/20 outline-none pl-8 pr-4 py-2.5 text-sm text-white placeholder:text-ink-600 tabular-nums transition"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-ink-500 mb-1.5">
              <MapPin className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              会場・場所（任意）
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例: 東京ドーム, Zepp Tokyo, 住所"
              className="w-full rounded-xl bg-ink-800 border border-white/5 focus:border-coral-500/50 focus:ring-2 focus:ring-coral-500/20 outline-none px-4 py-2.5 text-sm text-white placeholder:text-ink-600 transition"
            />
            <p className="mt-1.5 text-xs text-ink-600">
              会場名や住所を入れると地図・距離・ルートが表示されます
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-coral-500/10 border border-coral-500/30 px-3 py-2 text-sm text-coral-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 text-ink-500 hover:text-white transition px-4 py-2.5 text-sm font-semibold"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-coral-500 hover:bg-coral-600 disabled:opacity-50 active:scale-[0.98] transition px-4 py-2.5 text-sm font-semibold text-white shadow-glow"
            >
              {saving ? '保存中…' : isEdit ? '更新する' : 'プランを作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

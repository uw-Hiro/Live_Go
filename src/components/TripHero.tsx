import { MapPin, CalendarDays, Trash2, Pencil } from 'lucide-react';
import type { Trip } from '@/types';
import { TRIP_TYPE_LABELS } from '@/data/presets';
import { formatDate, daysUntil, formatYen } from '@/lib/format';
import { ShareButtons } from '@/components/ShareButtons';

interface TripHeroProps {
  trip: Trip;
  packingTotal: number;
  packingChecked: number;
  budgetTotal: number;
  budgetLimit: number | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function TripHero({
  trip,
  packingTotal,
  packingChecked,
  budgetTotal,
  budgetLimit,
  onEdit,
  onDelete,
}: TripHeroProps) {
  const days = daysUntil(trip.trip_date);
  const packingPct =
    packingTotal > 0 ? Math.round((packingChecked / packingTotal) * 100) : 0;

  const budgetPct =
    budgetLimit && budgetLimit > 0
      ? Math.min(100, Math.round((budgetTotal / budgetLimit) * 100))
      : null;

  const budgetOver = budgetLimit != null && budgetTotal > budgetLimit;
  const budgetNear =
    budgetLimit != null &&
    !budgetOver &&
    budgetTotal / budgetLimit >= 0.8;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-850 to-ink-900 border border-white/5 shadow-card animate-fade-in">
      {/* sheen */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-sheen" />
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center rounded-full bg-coral-500/15 text-coral-400 px-2.5 py-1 text-xs font-semibold ring-1 ring-coral-500/30">
                {TRIP_TYPE_LABELS[trip.trip_type]}
              </span>
              {days != null && days >= 0 && (
                <span className="inline-flex items-center rounded-full bg-white/5 text-ink-500 px-2.5 py-1 text-xs font-medium ring-1 ring-white/10">
                  あと{days}日
                </span>
              )}
              {days != null && days < 0 && (
                <span className="inline-flex items-center rounded-full bg-white/5 text-ink-500 px-2.5 py-1 text-xs font-medium ring-1 ring-white/10">
                  終了
                </span>
              )}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-words">
              {trip.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-sm text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                {formatDate(trip.trip_date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {trip.location ? trip.location : `${TRIP_TYPE_LABELS[trip.trip_type]}ライブ`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ShareButtons
              text={`${trip.title} に行く！#LiveGo`}
              url={typeof window !== 'undefined' ? window.location.href : ''}
            />
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-ink-500 hover:text-white transition px-3 py-2 text-sm"
            >
              <Pencil className="w-4 h-4" /> 編集
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-coral-500/20 text-ink-500 hover:text-coral-400 transition px-3 py-2 text-sm"
            >
              <Trash2 className="w-4 h-4" /> 削除
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {/* Packing progress */}
          <div className="rounded-2xl bg-ink-900/60 border border-white/5 p-4">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm text-ink-500">持ち物準備</span>
              <span className="text-sm font-semibold text-white">
                {packingChecked} / {packingTotal}
                <span className="text-ink-500 font-normal ml-1">個</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-ink-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mint-500 to-mint-400 transition-all duration-700"
                style={{ width: `${packingPct}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-ink-500">
              {packingTotal === 0
                ? 'まだ持ち物がありません'
                : packingPct === 100
                ? '準備完了！'
                : `あと ${packingTotal - packingChecked} 個`}
            </div>
          </div>

          {/* Budget progress */}
          <div
            className={`rounded-2xl bg-ink-900/60 border p-4 transition-colors ${
              budgetOver
                ? 'border-coral-500/40 ring-1 ring-coral-500/20'
                : budgetNear
                ? 'border-ember-500/40 ring-1 ring-ember-500/20'
                : 'border-white/5'
            }`}
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm text-ink-500">予算使用</span>
              <span
                className={`text-sm font-semibold ${
                  budgetOver ? 'text-coral-400' : 'text-white'
                }`}
              >
                {formatYen(budgetTotal)}
                {budgetLimit != null && (
                  <span className="text-ink-500 font-normal ml-1">
                    / {formatYen(budgetLimit)}
                  </span>
                )}
              </span>
            </div>
            <div className="h-2 rounded-full bg-ink-800 overflow-hidden">
              {budgetPct != null ? (
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    budgetOver
                      ? 'bg-gradient-to-r from-coral-600 to-coral-400'
                      : budgetNear
                      ? 'bg-gradient-to-r from-ember-500 to-ember-400'
                      : 'bg-gradient-to-r from-mint-500 to-mint-400'
                  }`}
                  style={{ width: `${budgetPct}%` }}
                />
              ) : (
                <div
                  className="h-full rounded-full bg-gradient-to-r from-coral-500 to-coral-400"
                  style={{ width: '100%', opacity: 0.4 }}
                />
              )}
            </div>
            <div className="mt-2 text-xs">
              {budgetLimit == null ? (
                <span className="text-ink-500">予算上限なし</span>
              ) : budgetOver ? (
                <span className="text-coral-400 font-semibold">
                  {formatYen(budgetTotal - budgetLimit)} オーバー
                </span>
              ) : (
                <span className="text-ink-500">
                  あと {formatYen(budgetLimit - budgetTotal)} 使える
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

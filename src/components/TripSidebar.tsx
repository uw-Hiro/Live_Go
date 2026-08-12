import { Plane, Plus, Music4 } from 'lucide-react';
import type { Trip } from '@/types';
import { TRIP_TYPE_LABELS } from '@/data/presets';
import { formatYen, daysUntil } from '@/lib/format';

interface TripSidebarProps {
  trips: Trip[];
  activeTripId: string | null;
  onSelect: (trip: Trip) => void;
  onNew: () => void;
  loading: boolean;
}

export function TripSidebar({
  trips,
  activeTripId,
  onSelect,
  onNew,
  loading,
}: TripSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-20 space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-display text-sm font-bold text-ink-500 uppercase tracking-wider">
          ライブ一覧
        </h2>
        <button
          onClick={onNew}
          className="lg:hidden inline-flex items-center gap-1 text-xs text-coral-400 hover:text-coral-500"
        >
          <Plus className="w-3.5 h-3.5" /> 新規
        </button>
      </div>

      <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
        {loading && trips.length === 0 && (
          <div className="text-center py-8 text-ink-600 text-sm">読み込み中…</div>
        )}

        {!loading && trips.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
            <Music4 className="w-6 h-6 text-ink-600 mx-auto mb-2" />
            <p className="text-sm text-ink-500">
              最初のライブプランを
              <br />
              作ってみましょう
            </p>
            <button
              onClick={onNew}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-coral-500 hover:bg-coral-600 transition px-3.5 py-1.5 text-xs font-semibold text-white"
            >
              <Plus className="w-3.5 h-3.5" /> 新規ライブ
            </button>
          </div>
        )}

        {trips.map((trip) => {
          const days = daysUntil(trip.trip_date);
          const active = trip.id === activeTripId;
          return (
            <button
              key={trip.id}
              onClick={() => onSelect(trip)}
              className={`w-full text-left rounded-2xl p-3.5 border transition group ${
                active
                  ? 'bg-gradient-to-br from-coral-500/15 to-transparent border-coral-500/40 ring-1 ring-coral-500/20'
                  : 'bg-ink-850/60 border-white/5 hover:border-white/10 hover:bg-ink-850'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Plane
                  className={`w-3.5 h-3.5 shrink-0 ${
                    active ? 'text-coral-400' : 'text-ink-600'
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    active ? 'text-coral-400' : 'text-ink-500'
                  }`}
                >
                  {TRIP_TYPE_LABELS[trip.trip_type]}
                </span>
                {days != null && days >= 0 && (
                  <span className="ml-auto text-[10px] text-ink-600">
                    あと{days}日
                  </span>
                )}
              </div>
              <div
                className={`text-sm font-semibold truncate ${
                  active ? 'text-white' : 'text-ink-500 group-hover:text-white'
                }`}
              >
                {trip.title}
              </div>
              {trip.budget_limit != null && (
                <div className="text-xs text-ink-600 mt-1 tabular-nums">
                  予算 {formatYen(trip.budget_limit)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

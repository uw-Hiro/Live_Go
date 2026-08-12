import { useState } from 'react';
import {
  Hotel,
  Bus,
  TrainFront,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TravelAdsProps {
  location: string;
  tripDate: string | null;
  tripType: 'day' | 'overnight' | 'festival';
}

// ---- Affiliate IDs (replace with your own to earn commission) ---------------
// Register with each program and paste your ID here. Links work without them;
// they just won't track conversions until a real ID is set.
const BOOKING_AID = '';
const RAKUTEN_AFFILIATE_ID = '';
// ----------------------------------------------------------------------------

function addDays(iso: string, days: number): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildBookingUrl(location: string, checkin: string | null, checkout: string | null): string {
  const params = new URLSearchParams({ ss: location });
  if (checkin) params.set('checkin', checkin);
  if (checkout) params.set('checkout', checkout);
  if (BOOKING_AID) params.set('aid', BOOKING_AID);
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

function buildRakutenUrl(location: string, checkin: string | null, checkout: string | null): string {
  const params = new URLSearchParams({ f_hotel_keyword: location, f_x: '1', f_y: '1' });
  if (checkin) params.set('f_checkin', checkin);
  if (checkout) params.set('f_checkout', checkout);
  if (RAKUTEN_AFFILIATE_ID) params.set('f_affiliate_id', RAKUTEN_AFFILIATE_ID);
  return `https://search.travel.rakuten.co.jp/ds/HotelSearch/List?${params.toString()}`;
}

interface AdCard {
  icon: typeof Hotel;
  brand: string;
  title: string;
  desc: string;
  href: string;
  accent: string;
}

export function TravelAds({ location, tripDate, tripType }: TravelAdsProps) {
  const [open, setOpen] = useState(true);

  const checkin = tripDate;
  // Suggest one night for day/overnight lives, two nights for festivals.
  const nights = tripType === 'festival' ? 2 : 1;
  const checkout = tripDate ? addDays(tripDate, nights) : null;
  const dateLabel = tripDate
    ? `${tripDate.slice(5).replace('-', '/')}${checkout ? '〜' + checkout.slice(5).replace('-', '/') : ''}`
    : '日付未定';

  const cards: AdCard[] = [
    {
      icon: Hotel,
      brand: 'Booking.com',
      title: '会場周辺のホテル',
      desc: '世界中の宿を最安値保証で予約。キャンセル無料のプランも多数。',
      href: buildBookingUrl(location, checkin, checkout),
      accent: 'from-sky-500/20 to-sky-600/10 ring-sky-500/30',
    },
    {
      icon: Hotel,
      brand: '楽天トラベル',
      title: '会場近くの宿を探す',
      desc: '楽天ポイントが貯まる・使える。国内ホテルから民宿まで豊富に掲載。',
      href: buildRakutenUrl(location, checkin, checkout),
      accent: 'from-rose-500/20 to-rose-600/10 ring-rose-500/30',
    },
    {
      icon: Bus,
      brand: 'WILLER',
      title: '高速バスで現地へ',
      desc: '全国の高速バス・夜行バスを最安値比較。4列・3列・コンパートメントを選択可。',
      href: 'https://travel.willer.co.jp/bus_search',
      accent: 'from-amber-500/20 to-amber-600/10 ring-amber-500/30',
    },
    {
      icon: TrainFront,
      brand: 'えきねっと',
      title: '新幹線チケット',
      desc: 'JR東日本の新幹線・特急のネット予約。おトクなお先得トクだ値も。',
      href: 'https://www.eki-net.com/',
      accent: 'from-emerald-500/20 to-emerald-600/10 ring-emerald-500/30',
    },
  ];

  return (
    <section className="rounded-3xl bg-gradient-to-br from-ink-850 to-ink-900 border border-white/5 shadow-card overflow-hidden animate-fade-in">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-5 sm:p-6 text-left hover:bg-white/[0.02] transition"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500/30 to-ember-500/20 ring-1 ring-coral-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-coral-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-white">
                会場周辺の予約を探す
              </h3>
              <span className="text-[10px] font-bold tracking-wider text-coral-300 bg-coral-500/15 ring-1 ring-coral-500/30 rounded px-1.5 py-0.5">
                PR
              </span>
            </div>
            <p className="text-sm text-ink-500 truncate mt-0.5">
              {location} · {dateLabel}
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-ink-600 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-ink-600 shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cards.map((card) => (
              <a
                key={card.brand}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`group relative rounded-2xl bg-gradient-to-br ${card.accent} ring-1 p-4 hover:scale-[1.02] active:scale-[0.99] transition-transform`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ink-950/40 flex items-center justify-center shrink-0">
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
                        {card.brand}
                      </span>
                      <ExternalLink className="w-3 h-3 text-ink-600 group-hover:text-ink-400 transition" />
                    </div>
                    <h4 className="font-display font-bold text-white text-sm mt-0.5">
                      {card.title}
                    </h4>
                    <p className="text-xs text-ink-500 mt-1 leading-relaxed line-clamp-2">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-ink-600 leading-relaxed">
            会場と日程に合わせて予約サイトへ案内します。予約が成立すると手数料が発生する場合があります（アフィリエイト）。
          </p>
        </div>
      )}
    </section>
  );
}

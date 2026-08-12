import { useEffect, useState } from 'react';
import { MapPin, Navigation, LocateFixed, ExternalLink, Loader2 } from 'lucide-react';

interface MapPanelProps {
  location: string;
}

interface Coords {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

function haversineKm(a: Coords, b: Coords): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

type GeolocState = 'idle' | 'loading' | 'success' | 'error' | 'denied' | 'unsupported';

export function MapPanel({ location }: MapPanelProps) {
  const [here, setHere] = useState<Coords | null>(null);
  const [dest, setDest] = useState<Coords | null>(null);
  const [geoState, setGeoState] = useState<GeolocState>('idle');
  const [geoMsg, setGeoMsg] = useState<string>('');

  const encoded = encodeURIComponent(location);
  // Embedded map (no API key required) + deep link to the full app.
  const embedSrc = `https://www.google.com/maps?q=${encoded}&output=embed`;
  const fullMapUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

  // Try to resolve the destination coordinates so we can show straight-line
  // distance. We piggyback on Google's geocoding via a hidden fetch to the
  // public search endpoint (no key) — if it fails we gracefully skip distance.
  useEffect(() => {
    let cancelled = false;
    setDest(null);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encoded}`,
      { headers: { Accept: 'application/json' } }
    )
      .then((r) => (r.ok ? r.json() : []))
      .then((arr: Array<{ lat: string; lon: string }>) => {
        if (cancelled || !Array.isArray(arr) || arr.length === 0) return;
        const lat = Number(arr[0].lat);
        const lng = Number(arr[0].lon);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          setDest({ lat, lng });
        }
      })
      .catch(() => {
        /* distance is best-effort; ignore failures */
      });
    return () => {
      cancelled = true;
    };
  }, [encoded]);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoState('unsupported');
      setGeoMsg('このブラウザは位置情報に対応していません');
      return;
    }
    setGeoState('loading');
    setGeoMsg('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState('success');
        setGeoMsg('');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoState('denied');
          setGeoMsg('位置情報の利用が許可されていません');
        } else {
          setGeoState('error');
          setGeoMsg('位置情報を取得できませんでした');
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  };

  const distanceKm =
    here && dest ? haversineKm(here, dest) : null;

  // Build a directions deep link. When we know the user's location we can
  // prefill the origin; otherwise Google Maps will ask for it on open.
  const directionsUrl =
    here != null
      ? `https://www.google.com/maps/dir/?api=1&origin=${here.lat},${here.lng}&destination=${encoded}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;

  return (
    <section className="rounded-3xl bg-ink-850 border border-white/5 shadow-card overflow-hidden animate-fade-in">
      <div className="p-5 sm:p-6 border-b border-white/5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-coral-400 shrink-0" />
              <h3 className="font-display text-lg font-bold text-white truncate">
                会場マップ
              </h3>
            </div>
            <p className="text-sm text-ink-500 truncate">{location}</p>
          </div>
          <a
            href={fullMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-ink-500 hover:text-white transition px-3 py-2 text-sm shrink-0"
          >
            <ExternalLink className="w-4 h-4" /> Google Maps で開く
          </a>
        </div>
      </div>

      {/* Map embed */}
      <div className="relative bg-ink-900">
        <iframe
          title={`${location} の地図`}
          src={embedSrc}
          className="w-full h-64 sm:h-72 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* Distance + route actions */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={requestLocation}
            disabled={geoState === 'loading'}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint-500/15 hover:bg-mint-500/25 text-mint-400 ring-1 ring-mint-500/30 transition px-4 py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {geoState === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4" />
            )}
            現在地を取得
          </button>

          {distanceKm != null && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-500">現在地からの直線距離</span>
              <span className="font-display font-bold text-lg text-white tabular-nums">
                {formatDistance(distanceKm)}
              </span>
            </div>
          )}

          {geoState === 'success' && distanceKm == null && (
            <span className="text-sm text-ink-600">
              会場の座標が取得できなかったため距離計算をスキップしました
            </span>
          )}

          {(geoState === 'denied' || geoState === 'error' || geoState === 'unsupported') && (
            <span className="text-sm text-coral-400">{geoMsg}</span>
          )}
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-400 hover:to-coral-500 text-white font-semibold shadow-glow transition px-4 py-3 text-sm"
        >
          <Navigation className="w-4 h-4" />
          {here != null ? '現在地からルートを表示' : 'ルートを検索（Google Maps）'}
        </a>
        <p className="text-xs text-ink-600 text-center">
          距離は直線距離（ふくらんだ道のりより短くなります）。ルートは Google Maps で開きます。
        </p>
      </div>
    </section>
  );
}

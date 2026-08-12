export function formatYen(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatYenPlain(amount: number): string {
  return new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(iso: string | null): string {
  if (!iso) return '日付未定';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '日付未定';
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(d);
}

export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

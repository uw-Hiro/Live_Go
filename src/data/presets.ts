import type { PackingCategory, TripType } from '@/types';

export interface PresetItem {
  name: string;
  category: PackingCategory;
}

// Auto-generated packing lists keyed by trip type.
// 'day' = day trip, 'overnight' = stay one or more nights, 'festival' = outdoor festival.
export const PACKING_PRESETS: Record<TripType, PresetItem[]> = {
  day: [
    { name: 'チケット', category: 'tickets' },
    { name: '会場案内 / スケジュール', category: 'tickets' },
    { name: 'スマートフォン', category: 'essentials' },
    { name: 'モバイルバッテリー', category: 'electronics' },
    { name: '充電ケーブル', category: 'electronics' },
    { name: 'サイフ', category: 'essentials' },
    { name: 'ハンカチ / ティッシュ', category: 'essentials' },
    { name: 'ウエットティッシュ', category: 'toiletries' },
    { name: 'のど飴', category: 'optional' },
    { name: '折りたたみ傘', category: 'optional' },
  ],
  overnight: [
    { name: 'チケット', category: 'tickets' },
    { name: '会場案内 / スケジュール', category: 'tickets' },
    { name: '宿泊予約票', category: 'tickets' },
    { name: 'スマートフォン', category: 'essentials' },
    { name: 'モバイルバッテリー', category: 'electronics' },
    { name: '充電ケーブル', category: 'electronics' },
    { name: 'サイフ', category: 'essentials' },
    { name: '着替え', category: 'clothes' },
    { name: '下着', category: 'clothes' },
    { name: '洗顔 / 歯ブラシセット', category: 'toiletries' },
    { name: 'ハンカチ / タオル', category: 'essentials' },
    { name: 'ウエットティッシュ', category: 'toiletries' },
    { name: '折りたたみ傘', category: 'optional' },
    { name: 'のど飴', category: 'optional' },
  ],
  festival: [
    { name: 'チケット / チケット QR', category: 'tickets' },
    { name: '会場マップ / タイムテーブル', category: 'tickets' },
    { name: 'スマートフォン', category: 'essentials' },
    { name: 'モバイルバッテリー (大容量)', category: 'electronics' },
    { name: '充電ケーブル', category: 'electronics' },
    { name: 'サイフ (小銭あり)', category: 'essentials' },
    { name: 'レインコート', category: 'clothes' },
    { name: '帽子', category: 'clothes' },
    { name: 'タオル', category: 'essentials' },
    { name: 'ハンカチ / ティッシュ', category: 'essentials' },
    { name: 'ウエットティッシュ', category: 'toiletries' },
    { name: '日焼け止め', category: 'toiletries' },
    { name: '飲み物 (ペットボトル)', category: 'optional' },
    { name: '軽食 / エナジーバー', category: 'optional' },
    { name: 'ビニール袋 (ゴミ / 濡れ物)', category: 'optional' },
    { name: '折りたたみ傘', category: 'optional' },
  ],
};

export const PACKING_CATEGORIES: { id: PackingCategory; label: string }[] = [
  { id: 'tickets', label: 'チケット類' },
  { id: 'essentials', label: '必須' },
  { id: 'electronics', label: '充電・電子' },
  { id: 'clothes', label: '衣類' },
  { id: 'toiletries', label: '衛生用品' },
  { id: 'optional', label: 'あると便利' },
];

export const BUDGET_CATEGORIES: {
  id: import('@/types').BudgetCategory;
  label: string;
  color: string;
}[] = [
  { id: 'transport', label: '交通費', color: '#fb7185' },
  { id: 'lodging', label: '宿泊費', color: '#38bdf8' },
  { id: 'food', label: '飲食費', color: '#fbbf24' },
  { id: 'goods', label: 'グッズ代', color: '#a3e635' },
  { id: 'other', label: 'その他', color: '#cbd5e1' },
];

export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  day: '日帰り',
  overnight: '宿泊',
  festival: 'フェス',
};

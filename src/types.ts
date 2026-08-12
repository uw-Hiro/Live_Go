export type TripType = 'day' | 'overnight' | 'festival';

export type PackingCategory =
  | 'essentials'
  | 'tickets'
  | 'electronics'
  | 'clothes'
  | 'toiletries'
  | 'optional';

export type BudgetCategory =
  | 'transport'
  | 'lodging'
  | 'food'
  | 'goods'
  | 'other';

export interface Trip {
  id: string;
  title: string;
  trip_date: string | null;
  trip_type: TripType;
  budget_limit: number | null;
  location: string | null;
  created_at: string;
}

export interface PackingItem {
  id: string;
  trip_id: string;
  name: string;
  category: PackingCategory;
  checked: boolean;
  sort_order: number;
  created_at: string;
}

export interface BudgetItem {
  id: string;
  trip_id: string;
  label: string;
  category: BudgetCategory;
  amount: number;
  created_at: string;
}

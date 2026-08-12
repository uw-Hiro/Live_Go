import { supabase } from './supabase';
import { PACKING_PRESETS } from '@/data/presets';
import type { BudgetItem, PackingItem, Trip, TripType } from '@/types';

export async function fetchTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Trip[];
}

export async function fetchPackingItems(tripId: string): Promise<PackingItem[]> {
  const { data, error } = await supabase
    .from('packing_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as PackingItem[];
}

export async function fetchBudgetItems(tripId: string): Promise<BudgetItem[]> {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as BudgetItem[];
}

export interface NewTripInput {
  title: string;
  trip_type: TripType;
  trip_date: string | null;
  budget_limit: number | null;
  location: string | null;
}

export async function createTripWithPreset(input: NewTripInput): Promise<Trip> {
  const { data: trip, error } = await supabase
    .from('trips')
    .insert({
      title: input.title,
      trip_type: input.trip_type,
      trip_date: input.trip_date,
      budget_limit: input.budget_limit,
      location: input.location,
    })
    .select()
    .single();
  if (error) throw error;

  const preset = PACKING_PRESETS[input.trip_type];
  if (preset.length > 0) {
    const rows = preset.map((p, i) => ({
      trip_id: (trip as Trip).id,
      name: p.name,
      category: p.category,
      sort_order: i,
    }));
    const { error: pErr } = await supabase.from('packing_items').insert(rows);
    if (pErr) throw pErr;
  }

  return trip as Trip;
}

export async function updateTrip(
  id: string,
  patch: Partial<Pick<Trip, 'title' | 'trip_date' | 'trip_type' | 'budget_limit' | 'location'>>
): Promise<Trip> {
  const { data, error } = await supabase
    .from('trips')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Trip;
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase.from('trips').delete().eq('id', id);
  if (error) throw error;
}

export async function addPackingItem(
  tripId: string,
  name: string,
  category: PackingItem['category']
): Promise<PackingItem> {
  const { data, error } = await supabase
    .from('packing_items')
    .insert({ trip_id: tripId, name, category })
    .select()
    .single();
  if (error) throw error;
  return data as PackingItem;
}

export async function togglePackingItem(
  id: string,
  checked: boolean
): Promise<void> {
  const { error } = await supabase
    .from('packing_items')
    .update({ checked })
    .eq('id', id);
  if (error) throw error;
}

export async function deletePackingItem(id: string): Promise<void> {
  const { error } = await supabase.from('packing_items').delete().eq('id', id);
  if (error) throw error;
}

export async function addBudgetItem(
  tripId: string,
  label: string,
  category: BudgetItem['category'],
  amount: number
): Promise<BudgetItem> {
  const { data, error } = await supabase
    .from('budget_items')
    .insert({ trip_id: tripId, label, category, amount })
    .select()
    .single();
  if (error) throw error;
  return data as BudgetItem;
}

export async function updateBudgetItem(
  id: string,
  patch: Partial<Pick<BudgetItem, 'label' | 'category' | 'amount'>>
): Promise<void> {
  const { error } = await supabase
    .from('budget_items')
    .update(patch)
    .eq('id', id);
  if (error) throw error;
}

export async function deleteBudgetItem(id: string): Promise<void> {
  const { error } = await supabase.from('budget_items').delete().eq('id', id);
  if (error) throw error;
}

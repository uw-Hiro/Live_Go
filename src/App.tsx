import { useCallback, useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { TripSidebar } from '@/components/TripSidebar';
import { TripHero } from '@/components/TripHero';
import { PackingChecklist } from '@/components/PackingChecklist';
import { BudgetTracker } from '@/components/BudgetTracker';
import { MapPanel } from '@/components/MapPanel';
import { TravelAds } from '@/components/TravelAds';
import { TripFormModal } from '@/components/TripFormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import {
  fetchTrips,
  fetchPackingItems,
  fetchBudgetItems,
  createTripWithPreset,
  updateTrip,
  deleteTrip,
  addPackingItem,
  togglePackingItem,
  deletePackingItem,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
} from '@/lib/api';
import type { BudgetItem, PackingItem, Trip, TripType } from '@/types';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Load all trips on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchTrips();
        if (!alive) return;
        setTrips(data);
        if (data.length > 0) setActiveTrip(data[0]);
      } catch (err) {
        if (alive)
          setGlobalError(
            err instanceof Error ? err.message : 'ライブの読み込みに失敗しました'
          );
      } finally {
        if (alive) setLoadingTrips(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Load detail (packing + budget) when active trip changes
  useEffect(() => {
    if (!activeTrip) {
      setPackingItems([]);
      setBudgetItems([]);
      return;
    }
    let alive = true;
    setLoadingDetail(true);
    (async () => {
      try {
        const [p, b] = await Promise.all([
          fetchPackingItems(activeTrip.id),
          fetchBudgetItems(activeTrip.id),
        ]);
        if (!alive) return;
        setPackingItems(p);
        setBudgetItems(b);
      } catch (err) {
        if (alive)
          setGlobalError(
            err instanceof Error ? err.message : '詳細の読み込みに失敗しました'
          );
      } finally {
        if (alive) setLoadingDetail(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [activeTrip]);

  const handleCreateTrip = useCallback(
    async (input: {
      title: string;
      trip_type: TripType;
      trip_date: string | null;
      budget_limit: number | null;
      location: string | null;
    }) => {
      const trip = await createTripWithPreset(input);
      setTrips((prev) => [trip, ...prev]);
      setActiveTrip(trip);
    },
    []
  );

  const handleUpdateTrip = useCallback(
    async (input: {
      title: string;
      trip_type: TripType;
      trip_date: string | null;
      budget_limit: number | null;
      location: string | null;
    }) => {
      if (!editingTrip) return;
      const updated = await updateTrip(editingTrip.id, input);
      setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setActiveTrip((prev) => (prev?.id === updated.id ? updated : prev));
      setEditingTrip(null);
    },
    [editingTrip]
  );

  const handleDeleteTrip = useCallback(async () => {
    if (!activeTrip) return;
    const id = activeTrip.id;
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
    setActiveTrip((prev) => {
      if (prev?.id !== id) return prev;
      const remaining = trips.filter((t) => t.id !== id);
      return remaining[0] ?? null;
    });
  }, [activeTrip, trips]);

  // Packing handlers
  const handleAddPacking = useCallback(
    async (name: string, category: PackingItem['category']) => {
      if (!activeTrip) return;
      const item = await addPackingItem(activeTrip.id, name, category);
      setPackingItems((prev) => [...prev, item]);
    },
    [activeTrip]
  );

  const handleTogglePacking = useCallback(
    async (id: string, checked: boolean) => {
      setPackingItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, checked } : i))
      );
      try {
        await togglePackingItem(id, checked);
      } catch {
        setPackingItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, checked: !checked } : i))
        );
      }
    },
    []
  );

  const handleDeletePacking = useCallback(async (id: string) => {
    setPackingItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await deletePackingItem(id);
    } catch {
      // ignore — list will re-sync on next trip load
    }
  }, []);

  // Budget handlers
  const handleAddBudget = useCallback(
    async (
      label: string,
      category: BudgetItem['category'],
      amount: number
    ) => {
      if (!activeTrip) return;
      const item = await addBudgetItem(activeTrip.id, label, category, amount);
      setBudgetItems((prev) => [...prev, item]);
    },
    [activeTrip]
  );

  const handleUpdateBudget = useCallback(
    async (
      id: string,
      patch: Partial<Pick<BudgetItem, 'label' | 'category' | 'amount'>>
    ) => {
      setBudgetItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...patch } : i))
      );
      try {
        await updateBudgetItem(id, patch);
      } catch {
        setGlobalError('予算項目の更新に失敗しました');
      }
    },
    []
  );

  const handleDeleteBudget = useCallback(async (id: string) => {
    setBudgetItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await deleteBudgetItem(id);
    } catch {
      // ignore
    }
  }, []);

  const budgetTotal = budgetItems.reduce((acc, i) => acc + i.amount, 0);
  const packingChecked = packingItems.filter((i) => i.checked).length;

  function openNew() {
    setEditingTrip(null);
    setModalOpen(true);
  }

  function openEdit() {
    if (!activeTrip) return;
    setEditingTrip(activeTrip);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen relative">
      <div className="aurora" />

      <div className="relative z-10">
        <Header onNewTrip={openNew} onHome={() => setActiveTrip(null)} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {globalError && (
            <div className="mb-4 rounded-xl bg-coral-500/10 border border-coral-500/30 px-4 py-3 text-sm text-coral-400 flex items-center justify-between">
              <span>{globalError}</span>
              <button
                onClick={() => setGlobalError(null)}
                className="text-coral-400/70 hover:text-coral-400"
              >
                閉じる
              </button>
            </div>
          )}

          {!loadingTrips && trips.length === 0 ? (
            <EmptyState onNew={openNew} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
              <TripSidebar
                trips={trips}
                activeTripId={activeTrip?.id ?? null}
                onSelect={setActiveTrip}
                onNew={openNew}
                loading={loadingTrips}
              />

              <div className="space-y-5 min-w-0">
                {activeTrip ? (
                  <>
                    <TripHero
                      trip={activeTrip}
                      packingTotal={packingItems.length}
                      packingChecked={packingChecked}
                      budgetTotal={budgetTotal}
                      budgetLimit={activeTrip.budget_limit}
                      onEdit={openEdit}
                      onDelete={() => setConfirmDelete(true)}
                    />

                    {activeTrip.location && (
                      <MapPanel location={activeTrip.location} />
                    )}

                    {activeTrip.location && (
                      <TravelAds
                        location={activeTrip.location}
                        tripDate={activeTrip.trip_date}
                        tripType={activeTrip.trip_type}
                      />
                    )}

                    {loadingDetail ? (
                      <div className="text-center py-16 text-ink-600 text-sm">
                        読み込み中…
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                        <PackingChecklist
                          items={packingItems}
                          onAdd={handleAddPacking}
                          onToggle={handleTogglePacking}
                          onDelete={handleDeletePacking}
                        />
                        <BudgetTracker
                          items={budgetItems}
                          total={budgetTotal}
                          limit={activeTrip.budget_limit}
                          onAdd={handleAddBudget}
                          onUpdate={handleUpdateBudget}
                          onDelete={handleDeleteBudget}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16 text-ink-600 text-sm">
                    左のリストからライブを選ぶか、新規作成してください。
                  </div>
                )}
              </div>
            </div>
          )}

          <footer className="mt-12 text-center text-xs text-ink-600">
            Live Go — ライブの持ち物と予算を、ひとつの画面で。
          </footer>
        </main>
      </div>

      <TripFormModal
        open={modalOpen}
        initialTrip={editingTrip}
        onClose={() => {
          setModalOpen(false);
          setEditingTrip(null);
        }}
        onSubmit={editingTrip ? handleUpdateTrip : handleCreateTrip}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="ライブを削除しますか？"
        message="このライブの持ち物リストと予算項目もすべて削除されます。この操作は取り消せません。"
        onConfirm={handleDeleteTrip}
        onClose={() => setConfirmDelete(false)}
      />
    </div>
  );
}

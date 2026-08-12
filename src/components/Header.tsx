import { Sparkles, Music4 } from 'lucide-react';

interface HeaderProps {
  onNewTrip: () => void;
  onHome: () => void;
}

export function Header({ onNewTrip, onHome }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={onHome}
          className="flex items-center gap-3 group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400/60 px-1 py-1 -mx-1"
          aria-label="ホームに戻る"
          title="ホームに戻る"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center shadow-glow transition-transform group-hover:scale-105 group-active:scale-95">
              <Music4 className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <Sparkles className="w-3.5 h-3.5 text-ember-400 absolute -top-1 -right-1" />
          </div>
          <div className="leading-none">
            <h1 className="font-display text-xl font-extrabold tracking-tight text-white">
              Live<span className="text-coral-400">Go</span>
            </h1>
          </div>
        </button>

        <button
          onClick={onNewTrip}
          className="group inline-flex items-center gap-2 rounded-full bg-coral-500 hover:bg-coral-600 active:scale-95 transition px-4 py-2 text-sm font-semibold text-white shadow-glow"
        >
          <span className="text-base leading-none">+</span> 新規ライブ
        </button>
      </div>
    </header>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Music4, Wallet, Package, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onNew: () => void;
}

export function EmptyState({ onNew }: EmptyStateProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero — visible on first paint */}
      <section className="relative overflow-hidden rounded-3xl flex flex-col items-center justify-center text-center min-h-[60vh] py-16">
        {/* Concert background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/16996871/pexels-photo-16996871.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          }}
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/70 to-ink-950/90" />
        {/* Warm coral glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-coral-600/15 to-transparent" />

        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center shadow-glow">
            <Music4 className="w-10 h-10 text-white" strokeWidth={2.2} />
          </div>
          <Sparkles className="w-6 h-6 text-ember-400 absolute -top-2 -right-2" />
        </div>
        <h2 className="relative font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
          ライブを、スマートに。
        </h2>

        <Reveal className="relative mt-8">
          <p className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight max-w-2xl drop-shadow-lg">
            持ち物チェックと予算計算を、ひとつの画面で。
          </p>
        </Reveal>
      </section>

      {/* Second key sentence — revealed as you scroll, over a band photo */}
      <section className="relative overflow-hidden rounded-3xl flex flex-col items-center text-center py-20 sm:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/28096553/pexels-photo-28096553.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/90 via-ink-950/75 to-ink-950/90" />
        <Reveal className="relative">
          <p className="text-base sm:text-lg text-white max-w-2xl leading-relaxed drop-shadow-lg">
            後から「いくら使ったか分からない」をなくし、
            <br className="hidden sm:block" />
            お金の使い方を自分でコントロール。
          </p>
        </Reveal>
      </section>

      {/* Three feature cards — revealed together as you scroll */}
      <section className="py-16 sm:py-24">
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto w-full">
            <FeatureCard
              icon={<Package className="w-5 h-5" />}
              title="持ち物自動生成"
              desc="日帰り・宿泊・フェス別"
            />
            <FeatureCard
              icon={<Wallet className="w-5 h-5" />}
              title="リアルタイム予算"
              desc="出費をカテゴリ別に集計"
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5" />}
              title="無駄遣い防止"
              desc="上限で使いすぎを警告"
            />
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center py-16 sm:py-24">
        <Reveal>
          <button
            onClick={onNew}
            className="inline-flex items-center gap-2 rounded-full bg-coral-500 hover:bg-coral-600 active:scale-95 transition px-6 py-3 text-sm font-semibold text-white shadow-glow"
          >
            <span className="text-lg leading-none">+</span> 最初のライブスケジュールを考える
          </button>
        </Reveal>
      </section>
    </div>
  );
}

function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-700 ease-out will-change-opacity ${
        visible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-ink-850/60 border border-white/5 p-4 text-left">
      <div className="w-9 h-9 rounded-lg bg-coral-500/15 text-coral-400 flex items-center justify-center mb-2.5">
        {icon}
      </div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="text-xs text-ink-500 mt-0.5">{desc}</div>
    </div>
  );
}

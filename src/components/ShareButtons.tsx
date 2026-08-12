import { useState } from 'react';

interface ShareButtonsProps {
  text: string;
  url?: string;
}

export function ShareButtons({ text, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '');
  const fullText = `${text} ${shareUrl}`.trim();

  const openShare = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=540');
  };

  const shareX = () => {
    openShare(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
    );
  };

  const shareLine = () => {
    openShare(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
    );
  };

  const shareInstagram = async () => {
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: text, text: fullText, url: shareUrl });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={shareX}
        aria-label="Xでシェア"
        title="Xでシェア"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white text-ink-500 hover:text-ink-950 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        onClick={shareLine}
        aria-label="LINEでシェア"
        title="LINEでシェア"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-[#00B900] text-ink-500 hover:text-white transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.032-.199.032-.211 0-.391-.091-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.021.128-.031.196-.031.211 0 .4.111.508.25l2.448 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63zm-2.466.629H4.304c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.344 0 .626.285.626.63v3.748h1.776c.345 0 .627.284.627.629 0 .344-.282.629-.627.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.252 1.058.578.12.289.079.746.04 1.044l-.17 1.026c-.053.289-.242 1.135 1.039.621 1.281-.516 6.925-4.073 9.444-6.971C23.176 14.267 24 12.374 24 10.314" />
        </svg>
      </button>
      <button
        onClick={shareInstagram}
        aria-label="Instagramでシェア"
        title={copied ? 'コピーしました！Instagramで貼り付けます' : 'Instagramでシェア'}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-ink-500 hover:text-white transition-all"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      </button>
      {copied && (
        <span className="text-xs text-mint-400 ml-1 animate-fade-in">コピー済</span>
      )}
    </div>
  );
}

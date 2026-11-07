import React, { useEffect, useRef, useCallback } from 'react';

export default function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const focusGame = useCallback(() => {
    try {
      iframeRef.current?.contentWindow?.focus();
    } catch {}
  }, []);

  const triggerFlap = useCallback(() => {
    try {
      const win = iframeRef.current?.contentWindow as any;
      if (win) {
        if (typeof win.flap === 'function') {
          win.flap();
        } else {
          win.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
        }
      }
    } catch {}
    focusGame();
  }, [focusGame]);

  useEffect(() => {
    focusGame();

    const handleWindowClick = () => {
      triggerFlap();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        triggerFlap();
      }
    };

    window.addEventListener('click', handleWindowClick);
    window.addEventListener('touchstart', handleWindowClick, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('touchstart', handleWindowClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusGame, triggerFlap]);

  return (
    <div
      className="fixed inset-0 w-full h-full bg-[#0a1f44] flex items-center justify-center overflow-hidden m-0 p-0 select-none"
      onClick={triggerFlap}
    >
      <iframe
        ref={iframeRef}
        src="/assets/aistudio/Smash_Trump_c87fb6a5.html"
        title="Smash Trump"
        className="border-none block"
        style={{
          aspectRatio: '2/3',
          height: '100%',
          maxHeight: '100vh',
          width: 'auto',
          maxWidth: 'min(100vw, calc(100vh * 2 / 3))',
        }}
        tabIndex={0}
        allow="autoplay"
        onLoad={focusGame}
      />
    </div>
  );
}

import React, { useEffect, useRef, useCallback } from 'react';

export default function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const focusGame = useCallback(() => {
    try {
      iframeRef.current?.contentWindow?.focus();
    } catch {
      // ignore
    }
  }, []);

  const triggerFlap = useCallback(() => {
    try {
      const win = iframeRef.current?.contentWindow as any;
      if (win) {
        if (typeof win.flap === 'function') {
          win.flap();
        } else if (typeof win.flapGame === 'function') {
          win.flapGame();
        } else {
          win.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
        }
      }
    } catch {
      // ignore
    }
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
      } else if (e.code === 'KeyC') {
        try {
          const win = iframeRef.current?.contentWindow as any;
          if (win) {
            win.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyC' }));
          }
        } catch {
          // ignore
        }
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
      className="fixed inset-0 w-full h-[100dvh] bg-[#0a1f44] flex items-center justify-center overflow-hidden m-0 p-0 select-none touch-none"
      onClick={triggerFlap}
    >
      <iframe
        ref={iframeRef}
        src="/assets/aistudio/Smash_Trump_c87fb6a5.html"
        title="Smash Trump"
        className="border-none block w-full h-full"
        style={{
          aspectRatio: '2/3',
          height: '100%',
          maxHeight: '100dvh',
          width: '100%',
          maxWidth: 'min(100vw, calc(100dvh * 2 / 3))',
        }}
        tabIndex={0}
        allow="autoplay"
        onLoad={focusGame}
      />
    </div>
  );
}

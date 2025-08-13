import { useEffect, useState } from 'react';

export function LayoutDebug() {
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    // Only show debug in development
    const isDev = process.env.NODE_ENV === 'development';
    setDebug(isDev && localStorage.getItem('layout-debug') === 'true');
  }, []);

  if (!debug) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded text-xs z-50">
      <div>
        Screen:{' '}
        {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'SSR'}
      </div>
      <div>Scroll: {typeof window !== 'undefined' ? window.scrollY : 0}px</div>
      <button
        onClick={() => {
          localStorage.setItem('layout-debug', 'false');
          setDebug(false);
        }}
        className="text-xs underline"
      >
        Hide Debug
      </button>
    </div>
  );
}

// Helper to enable debug mode
export function enableLayoutDebug() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('layout-debug', 'true');
    window.location.reload();
  }
}

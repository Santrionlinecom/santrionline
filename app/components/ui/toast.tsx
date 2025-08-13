import { useEffect, useState } from 'react';

export type ToastMessage = { id: string; title?: string; description: string; type?: 'success' | 'error' | 'info' };

let listeners: ((toasts: ToastMessage[]) => void)[] = [];
let queue: ToastMessage[] = [];

export function pushToast(msg: Omit<ToastMessage, 'id'>) {
  const toast: ToastMessage = { id: Math.random().toString(36).slice(2), ...msg };
  queue = [...queue, toast];
  listeners.forEach(l => l(queue));
  setTimeout(() => dismissToast(toast.id), 4000);
}

export function dismissToast(id: string) {
  queue = queue.filter(t => t.id !== id);
  listeners.forEach(l => l(queue));
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>(queue);
  useEffect(() => {
    const listener = (t: ToastMessage[]) => setToasts(t);
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);
  return toasts;
}

export function ToastViewport() {
  const toasts = useToasts();
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 w-72">
      {toasts.map(t => (
        <div key={t.id} className={`rounded-md border p-3 shadow bg-white text-sm flex flex-col gap-1 ${t.type === 'error' ? 'border-red-300' : t.type === 'success' ? 'border-green-300' : 'border-gray-200'}`}> 
          {t.title && <div className="font-medium">{t.title}</div>}
          <div>{t.description}</div>
          <button onClick={() => dismissToast(t.id)} className="self-end text-xs text-muted-foreground hover:underline">Tutup</button>
        </div>
      ))}
    </div>
  );
}

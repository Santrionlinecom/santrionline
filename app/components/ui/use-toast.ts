// Toast notifications hook
// app/components/ui/use-toast.ts

import React, { useState } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
  variant?: 'default' | 'destructive';
}

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 1000000;

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ToasterToast = Toast & {
  id: string;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

const memoryState: { toasts: ToasterToast[] } = {
  toasts: [],
};

const listeners: Array<(state: typeof memoryState) => void> = [];

const removeTimeouts = new Map<string, NodeJS.Timeout>();

const dispatch = (action: { type: keyof typeof actionTypes; toast?: ToasterToast }) => {
  switch (action.type) {
    case 'ADD_TOAST':
      if (action.toast) {
        memoryState.toasts = [action.toast, ...memoryState.toasts].slice(0, TOAST_LIMIT);
      }
      break;
    case 'UPDATE_TOAST':
      if (action.toast) {
        memoryState.toasts = memoryState.toasts.map((t) =>
          t.id === action.toast!.id ? { ...t, ...action.toast } : t,
        );
      }
      break;
    case 'DISMISS_TOAST': {
      const { toast } = action;
      if (toast) {
        const id = toast.id;
        const existingTimeout = removeTimeouts.get(id);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        removeTimeouts.set(
          id,
          setTimeout(() => {
            memoryState.toasts = memoryState.toasts.filter((t) => t.id !== id);
            listeners.forEach((listener) => listener(memoryState));
            removeTimeouts.delete(id);
          }, TOAST_REMOVE_DELAY),
        );
      }
      break;
    }
    case 'REMOVE_TOAST':
      if (action.toast) {
        memoryState.toasts = memoryState.toasts.filter((t) => t.id !== action.toast!.id);
      }
      break;
  }

  listeners.forEach((listener) => listener(memoryState));
};

function toast({ ...props }: Omit<ToasterToast, 'id'>) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toast: { id, ...props } });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = useState<typeof memoryState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      dispatch({ type: 'DISMISS_TOAST', toast: { id: toastId || '', title: '', description: '' } });
    },
  };
}

export { useToast, toast };

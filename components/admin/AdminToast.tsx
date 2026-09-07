'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Toast, { type ToastTone } from '@/components/Toast';

type Notify = (message: string, tone?: ToastTone) => void;

const AdminToastContext = createContext<Notify>(() => {});

export function useAdminToast(): Notify {
  return useContext(AdminToastContext);
}

const DUREE_MS = 4000;

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; tone?: ToastTone; show: boolean }>({
    message: '',
    show: false,
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback<Notify>((message, tone) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, tone, show: true });
    timer.current = setTimeout(() => {
      setToast(current => ({ ...current, show: false }));
    }, DUREE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const close = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(current => ({ ...current, show: false }));
  }, []);

  return (
    <AdminToastContext.Provider value={notify}>
      {children}
      <Toast message={toast.message} tone={toast.tone} show={toast.show} onClose={close} />
    </AdminToastContext.Provider>
  );
}

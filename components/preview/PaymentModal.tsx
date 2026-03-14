'use client';

import { useEffect, useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

type PayPalActions = {
  subscription: {
    create: (options: { plan_id: string }) => Promise<string>;
  };
};

// window.paypal global type declared in PublishFlowDialog.tsx

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (subscriptionId: string) => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRendered = useRef(false);

  const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID ?? '';

  useEffect(() => {
    if (typeof window === 'undefined' || !isOpen) return;
    const check = () => {
      if (window.paypal) {
        setSdkReady(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const t = setInterval(() => {
      if (check()) clearInterval(t);
    }, 200);
    return () => clearInterval(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      buttonsRendered.current = false;
      setProcessing(false);
      return;
    }
    if (!sdkReady || !planId || !containerRef.current || buttonsRendered.current) return;
    buttonsRendered.current = true;
    setError(null);

    const container = containerRef.current;
    window
      .paypal!.Buttons({
        style: { shape: 'pill', color: 'gold' },
        createSubscription(_data, actions) {
          setProcessing(true);
          setError(null);
          return actions.subscription.create({ plan_id: planId });
        },
        onApprove(data) {
          onSuccess(data.subscriptionID);
          onClose();
        },
        onError(err) {
          const msg =
            typeof err === 'object' && err !== null && 'message' in err
              ? String((err as { message: unknown }).message)
              : 'Payment failed. Please try again.';
          setError(msg);
          setProcessing(false);
        },
        onCancel() {
          setProcessing(false);
        },
      })
      .render(container)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'PayPal failed to load. Refresh and try again.');
        buttonsRendered.current = false;
        setProcessing(false);
      });

    return () => {
      if (container) container.innerHTML = '';
      buttonsRendered.current = false;
    };
  }, [isOpen, sdkReady, planId, onSuccess, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subscribe to publish"
      maxWidth={420}
    >
      <div className="flex flex-col gap-4" style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}>
        <p className="text-stone-600 text-sm leading-relaxed">
          Your site is ready. Subscribe once to publish this site and get your live link. You can cancel anytime.
        </p>
        {!planId && (
          <p className="text-amber-700 text-sm bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            PayPal plan is not configured. Set <code className="text-xs">NEXT_PUBLIC_PAYPAL_PLAN_ID</code> in your environment.
          </p>
        )}
        {planId && !sdkReady && (
          <div className="flex items-center justify-center gap-2 py-6 text-stone-500 text-sm">
            <span className="inline-block w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            Loading PayPal…
          </div>
        )}
        {planId && sdkReady && (
          <div style={{ position: 'relative' }}>
            <div ref={containerRef} className="min-h-[45px]" />
            {processing && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(255,255,255,0.8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, borderRadius: 8,
              }}>
                <span className="inline-block w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-stone-600 text-sm">Processing payment…</span>
              </div>
            )}
          </div>
        )}
        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

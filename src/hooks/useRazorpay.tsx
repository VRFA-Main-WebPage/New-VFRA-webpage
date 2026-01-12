import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
    };
  }
}

export function useRazorpay() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        setError("Failed to load Razorpay SDK");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }, []);

  const openPayment = useCallback(
    async (options: Omit<RazorpayOptions, "key"> & { key: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const loaded = await loadScript();
        if (!loaded) {
          throw new Error("Failed to load Razorpay SDK");
        }

        const razorpay = new window.Razorpay({
          ...options,
          modal: {
            ...options.modal,
            ondismiss: () => {
              setIsLoading(false);
              options.modal?.ondismiss?.();
            },
          },
          handler: (response) => {
            setIsLoading(false);
            options.handler?.(response);
          },
        });

        razorpay.open();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Payment failed";
        setError(message);
        setIsLoading(false);
        toast({
          title: "Payment Error",
          description: message,
          variant: "destructive",
        });
      }
    },
    [loadScript, toast]
  );

  return { openPayment, isLoading, error };
}

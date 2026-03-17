"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { OnboardingStatus, getOnboardingStatus } from "@/app/(protected)/onboarding/actions";
import { usePathname } from "next/navigation";

interface OnboardingContextValue {
  status: OnboardingStatus | null;
  isLoading: boolean;
  refreshStatus: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ 
  children, 
  initialStatus 
}: { 
  children: ReactNode;
  initialStatus: OnboardingStatus | null;
}) {
  const [status, setStatus] = useState<OnboardingStatus | null>(initialStatus);
  const [isLoading, setIsLoading] = useState(!initialStatus);
  const pathname = usePathname();

  const refreshStatus = async () => {
    try {
      const newStatus = await getOnboardingStatus();
      setStatus(newStatus);
    } catch (error) {
      console.error("Failed to refresh onboarding status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh status when navigating and periodically (only if not completed)
  useEffect(() => {
    refreshStatus();

    // If onboarding is already completed, no need for background refresh
    if (status?.isCompleted) return;

    // Set up auto-refresh every 10 seconds while the tab is active
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshStatus();
      }
    }, 10000);

    // Refresh on window focus
    const onFocus = () => refreshStatus();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [pathname, status?.isCompleted]);

  return (
    <OnboardingContext.Provider value={{ status, isLoading, refreshStatus }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

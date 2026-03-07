"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface HeaderData {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

interface HeaderContextType {
  headerData: HeaderData;
  setHeaderData: (data: HeaderData) => void;
  resetHeader: () => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [headerData, setHeaderState] = useState<HeaderData>({
    title: "",
  });

  const setHeaderData = useCallback((data: HeaderData) => {
    setHeaderState(data);
  }, []);

  const resetHeader = useCallback(() => {
    setHeaderState({ title: "" });
  }, []);

  return (
    <HeaderContext.Provider value={{ headerData, setHeaderData, resetHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader(data?: HeaderData) {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }

  const { setHeaderData } = context;

  useEffect(() => {
    if (data) {
      setHeaderData(data);
    }
    // No cleaning up reset here because it might clear the header before the next page sets it
    // especially during navigation transitions. 
    // We rely on the next page calling useHeader to overwrite.
  }, [data, setHeaderData]);

  return context;
}

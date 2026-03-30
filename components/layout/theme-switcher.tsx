"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;
  const isDark = theme === "dark";

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 px-0"
      title={`Mudar para modo ${isDark ? "claro" : "escuro"}`}
    >
      {isDark ? (
        <Moon
          key="dark"
          size={ICON_SIZE}
          className="text-muted-foreground transition-all duration-300"
        />
      ) : (
        <Sun
          key="light"
          size={ICON_SIZE}
          className="text-muted-foreground transition-all duration-300"
        />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
};

export { ThemeSwitcher };

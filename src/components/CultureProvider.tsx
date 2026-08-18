import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CulturePanel = "culture" | "about" | "campaign";

type CultureContextValue = {
  open: boolean;
  panel: CulturePanel;
  craftId: string | null;
  openCulture: (craftId?: string) => void;
  openAbout: () => void;
  openCampaign: () => void;
  close: () => void;
};

const CultureContext = createContext<CultureContextValue | null>(null);

export function CultureProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<CulturePanel>("culture");
  const [craftId, setCraftId] = useState<string | null>(null);

  const openCulture = useCallback((id?: string) => {
    setPanel("culture");
    setCraftId(id ?? null);
    setOpen(true);
  }, []);

  const openAbout = useCallback(() => {
    setPanel("about");
    setCraftId(null);
    setOpen(true);
  }, []);

  const openCampaign = useCallback(() => {
    setPanel("campaign");
    setCraftId(null);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      open,
      panel,
      craftId,
      openCulture,
      openAbout,
      openCampaign,
      close,
    }),
    [open, panel, craftId, openCulture, openAbout, openCampaign, close],
  );

  return (
    <CultureContext.Provider value={value}>{children}</CultureContext.Provider>
  );
}

export function useCulture() {
  const ctx = useContext(CultureContext);
  if (!ctx) {
    throw new Error("useCulture must be used within CultureProvider");
  }
  return ctx;
}

export type GuestWork = {
  id: string;
  craft: string;
  prompt: string;
  svg: string;
  imageUrl?: string;
  createdAt: number;
};

const KEY = "feiyi-atelier-guest-works";
const LIMIT = 12;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadGuestWorks(): GuestWork[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestWork[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGuestWork(
  work: Omit<GuestWork, "id" | "createdAt"> & { createdAt?: number },
): GuestWork {
  const next: GuestWork = {
    id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: work.createdAt ?? Date.now(),
    craft: work.craft,
    prompt: work.prompt,
    svg: work.svg,
    imageUrl: work.imageUrl,
  };
  const list = [next, ...loadGuestWorks()].slice(0, LIMIT);
  if (canUseStorage()) {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  }
  return next;
}

export function removeGuestWork(id: string) {
  if (!canUseStorage()) return;
  const list = loadGuestWorks().filter((item) => item.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

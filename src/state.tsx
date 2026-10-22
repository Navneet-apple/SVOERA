import React, { createContext, useContext, useState } from "react";

export type Status = "Watching" | "Plan to Watch" | "Completed" | "On-Hold" | "Dropped";
type State = { entries: Record<string, Status>; setStatus: (id: string, status?: Status) => void };
const WatchlistContext = createContext<State | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Record<string, Status>>({ "blue-hour": "Watching", "crimson-orbit": "Watching", "paper-moon": "Completed", "last-signal": "Plan to Watch" });
  const setStatus = (id: string, status?: Status) => setEntries((current) => {
    const next = { ...current };
    if (status) next[id] = status; else delete next[id];
    return next;
  });
  return <WatchlistContext.Provider value={{ entries, setStatus }}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const value = useContext(WatchlistContext);
  if (!value) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return value;
}

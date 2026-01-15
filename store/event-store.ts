import { TicketMasterEvent } from "@/services/ticketmaster";
import { create } from "zustand";

// Helper function to remove duplicates from events array based on event name
const removeDuplicates = (events: TicketMasterEvent[]): TicketMasterEvent[] => {
  const seen = new Set<string>();
  return events.filter((event) => {
    const normalizedName = event.name?.trim().toLowerCase() || "";
    if (seen.has(normalizedName)) {
      return false;
    }
    seen.add(normalizedName);
    return true;
  });
};

interface EventState {
  // Search state
  searchKeyword: string;
  debouncedKeyword: string;
  isSearching: boolean;

  // Events state
  events: TicketMasterEvent[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;

  // Pagination state
  page: number;
  hasMore: boolean;

  // Search history (optional feature)
  searchHistory: string[];

  // Actions
  setSearchKeyword: (keyword: string) => void;
  setDebouncedKeyword: (keyword: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setEvents: (events: TicketMasterEvent[], append?: boolean) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setLoadingMore: (loadingMore: boolean) => void;
  setError: (error: string | null) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  addToSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;
  resetEvents: () => void;
  resetSearch: () => void;
}

export const useEventStore = create<EventState>((set) => ({
  // Initial state
  searchKeyword: "",
  debouncedKeyword: "",
  isSearching: false,
  events: [],
  loading: true,
  refreshing: false,
  loadingMore: false,
  error: null,
  page: 0,
  hasMore: true,
  searchHistory: [],

  // Actions
  setSearchKeyword: (keyword) =>
    set({ searchKeyword: keyword, isSearching: keyword !== "" }),

  setDebouncedKeyword: (keyword) => set({ debouncedKeyword: keyword }),

  setIsSearching: (isSearching) => set({ isSearching }),

  setEvents: (newEvents, append = false) =>
    set((state) => {
      if (append) {
        // Remove duplicates when appending
        const uniquePrev = removeDuplicates(state.events);
        const existingNames = new Set(
          uniquePrev.map((e) => e.name?.trim().toLowerCase() || "")
        );
        const uniqueNewEvents = removeDuplicates(newEvents).filter(
          (e) => !existingNames.has(e.name?.trim().toLowerCase() || "")
        );
        return { events: [...uniquePrev, ...uniqueNewEvents] };
      } else {
        // Remove duplicates in initial load
        const uniqueEvents = removeDuplicates(newEvents);
        return { events: uniqueEvents };
      }
    }),

  setLoading: (loading) => set({ loading }),

  setRefreshing: (refreshing) => set({ refreshing }),

  setLoadingMore: (loadingMore) => set({ loadingMore }),

  setError: (error) => set({ error }),

  setPage: (page) => set({ page }),

  setHasMore: (hasMore) => set({ hasMore }),

  addToSearchHistory: (keyword) =>
    set((state) => {
      if (!keyword.trim()) return state;
      const filtered = state.searchHistory.filter((h) => h !== keyword);
      return { searchHistory: [keyword, ...filtered].slice(0, 10) }; // Keep last 10
    }),

  clearSearchHistory: () => set({ searchHistory: [] }),

  resetEvents: () =>
    set({
      events: [],
      page: 0,
      hasMore: true,
      error: null,
    }),

  resetSearch: () =>
    set({
      searchKeyword: "",
      debouncedKeyword: "",
      isSearching: false,
    }),
}));

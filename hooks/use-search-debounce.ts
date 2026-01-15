import { useEffect, useRef } from "react";
import { useEventStore } from "@/store/event-store";

/**
 * Custom hook to handle search input debouncing
 * Updates debouncedKeyword after user stops typing for 500ms
 */
export function useSearchDebounce() {
  const { searchKeyword, debouncedKeyword, setDebouncedKeyword, setIsSearching } =
    useEventStore();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Show loading when user is typing and keyword is different from debounced
    if (searchKeyword !== debouncedKeyword) {
      setIsSearching(true);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 500); // Wait 500ms after user stops typing

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchKeyword, debouncedKeyword, setDebouncedKeyword, setIsSearching]);
}

import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import { EventItem } from "@/components/event-item";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  searchEvents,
  TicketMasterEvent,
  TicketMasterSearchResponse,
} from "@/services/ticketmaster";
import { useEventStore } from "@/store/event-store";

export function EventList() {
  // Use Zustand store for state management
  const {
    events,
    loading,
    refreshing,
    loadingMore,
    error,
    page,
    hasMore,
    debouncedKeyword,
    setEvents,
    setLoading,
    setRefreshing,
    setLoadingMore,
    setError,
    setPage,
    setHasMore,
    setIsSearching,
    addToSearchHistory,
  } = useEventStore();

  const iconColor = useThemeColor({}, "text");

  const loadEvents = useCallback(
    async (pageNum: number = 0, append: boolean = false, isRefresh: boolean = false) => {
      const keyword = debouncedKeyword;

      try {
        if (pageNum === 0) {
          setLoading(true);
          // Only set isSearching if not refreshing (to avoid showing loading in searchbar during pull-to-refresh)
          if (!isRefresh) {
            setIsSearching(true);
          }
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const response: TicketMasterSearchResponse = await searchEvents({
          size: 20,
          page: pageNum,
          sort: keyword ? "relevance,desc" : "date,asc",
          keyword: keyword || undefined,
        });

        const newEvents = response._embedded?.events || [];

        // Update events in store (store handles deduplication)
        setEvents(newEvents, append);

        // Add to search history if keyword exists and not refreshing
        if (keyword.trim() && !isRefresh && pageNum === 0) {
          addToSearchHistory(keyword);
        }

        // Check if there are more pages
        const totalPages = response.page?.totalPages || 0;
        setHasMore(pageNum < totalPages - 1);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load events";
        setError(errorMessage);
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
        if (pageNum === 0 && !isRefresh) {
          setIsSearching(false);
        }
      }
    },
    [
      debouncedKeyword,
      setEvents,
      setLoading,
      setLoadingMore,
      setRefreshing,
      setError,
      setHasMore,
      setIsSearching,
      addToSearchHistory,
    ]
  );

  // Reload events when search keyword changes
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    loadEvents(0, false);
  }, [debouncedKeyword, loadEvents, setPage, setHasMore]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    setHasMore(true); // Reset hasMore when refreshing
    loadEvents(0, false, true); // Pass isRefresh=true to prevent searchbar loading
  }, [loadEvents, setRefreshing, setPage, setHasMore]);

  const handleLoadMore = useCallback(() => {
    // Prevent multiple simultaneous loads
    if (!loadingMore && hasMore && !loading && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadEvents(nextPage, true);
    }
  }, [loadingMore, hasMore, loading, refreshing, page, loadEvents, setPage]);

  const renderItem = ({ item }: { item: TicketMasterEvent }) => (
    <EventItem event={item} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.emptyText}>Loading events...</ThemedText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
          <ThemedText style={styles.emptyText}>Pull down to refresh</ThemedText>
        </View>
      );
    }

    // Show search-specific message if there's a search keyword
    if (debouncedKeyword.trim()) {
      return (
        <View style={styles.centerContainer}>
          <MaterialIcons
            name="search-off"
            size={64}
            color={iconColor}
            style={styles.emptyIcon}
          />
          <ThemedText style={styles.emptyText}>
            No results for &ldquo;{debouncedKeyword}&rdquo;
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <MaterialIcons
          name="event-busy"
          size={64}
          color={iconColor}
          style={styles.emptyIcon}
        />
        <ThemedText style={styles.emptyText}>No events found</ThemedText>
      </View>
    );
  };

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={
        events.length === 0 ? styles.emptyContainer : styles.listContainer
      }
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={events.length > 0}
      maxToRenderPerBatch={10}
      windowSize={10}
      style={events.length === 0 ? { flex: 1 } : undefined}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  emptyIcon: {
    opacity: 0.4,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
});

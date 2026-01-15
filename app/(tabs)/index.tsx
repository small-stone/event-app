import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EventList } from "@/components/event-list";
import { SearchBar } from "@/components/search-bar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSearchDebounce } from "@/hooks/use-search-debounce";
import { useEventStore } from "@/store/event-store";

export default function HomeScreen() {
  // Use Zustand store for state management
  const { searchKeyword, isSearching, setSearchKeyword, resetSearch } =
    useEventStore();

  // Handle search debouncing
  useSearchDebounce();

  const handleClearSearch = () => {
    resetSearch();
  };

  const handleSearchChange = (text: string) => {
    setSearchKeyword(text);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Events
          </ThemedText>
        </ThemedView>
        <SearchBar
          value={searchKeyword}
          onChangeText={handleSearchChange}
          placeholder="Search events..."
          onClear={handleClearSearch}
          loading={isSearching}
        />
        <ThemedView style={styles.content}>
          <EventList />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
});

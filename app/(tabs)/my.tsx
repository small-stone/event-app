import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface MenuItemProps {
  title: string;
  icon?: string;
  onPress?: () => void;
}

function MenuItem({ title, icon, onPress }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <ThemedView style={styles.menuItemContent}>
        {icon && (
          <ThemedText style={styles.menuIcon}>{icon}</ThemedText>
        )}
        <ThemedText type="defaultSemiBold" style={styles.menuTitle}>
          {title}
        </ThemedText>
        <ThemedText style={styles.menuArrow}>›</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export default function MyScreen() {
  const handleMyEvents = () => {
    // Placeholder action
    console.log("My Events pressed");
  };

  const handleMyTickets = () => {
    // Placeholder action
    console.log("My Tickets pressed");
  };

  const handleMyFavorites = () => {
    // Placeholder action
    console.log("My Favorites pressed");
  };

  const handleMyBookmarks = () => {
    // Placeholder action
    console.log("My Bookmarks pressed");
  };

  const handleSettings = () => {
    // Placeholder action
    console.log("Settings pressed");
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            My
          </ThemedText>
        </ThemedView>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.section}>
            <MenuItem
              title="My Events"
              icon="📅"
              onPress={handleMyEvents}
            />
            <MenuItem
              title="My Tickets"
              icon="🎫"
              onPress={handleMyTickets}
            />
            <MenuItem
              title="My Favorites"
              icon="❤️"
              onPress={handleMyFavorites}
            />
            <MenuItem
              title="My Bookmarks"
              icon="🔖"
              onPress={handleMyBookmarks}
            />
          </ThemedView>

          <ThemedView style={styles.section}>
            <MenuItem
              title="Settings"
              icon="⚙️"
              onPress={handleSettings}
            />
          </ThemedView>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    gap: 12,
  },
  menuIcon: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
  },
  menuArrow: {
    fontSize: 24,
    opacity: 0.5,
  },
});

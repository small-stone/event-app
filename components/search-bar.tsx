import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useEventStore } from "@/store/event-store";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  loading?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search events...",
  onClear,
  loading = false,
}: SearchBarProps) {
  const { searchHistory, setSearchKeyword, clearSearchHistory } =
    useEventStore();
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasUserTyped, setHasUserTyped] = React.useState(false);

  const borderColor = useThemeColor(
    { light: "#e0e0e0", dark: "#333333" },
    "text"
  );
  const backgroundColor = useThemeColor(
    { light: "#f5f5f5", dark: "#2a2a2a" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const historyBgColor = useThemeColor(
    { light: "#ffffff", dark: "#1a1a1a" },
    "background"
  );

  // Only show history when focused, has history, no value, and user hasn't typed (or just focused)
  const showHistory = isFocused && searchHistory.length > 0 && !value && !hasUserTyped;

  const handleHistoryItemPress = (keyword: string) => {
    setSearchKeyword(keyword);
    setIsFocused(false);
    setHasUserTyped(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasUserTyped(false); // Reset when user focuses (clicks on input)
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
    setHasUserTyped(true); // Mark that user has typed
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    // Don't reset hasUserTyped here - keep it true so history won't show after clearing
    // History will only show when user clicks on input again (onFocus resets it)
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            borderColor,
            backgroundColor,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor={textColor + "80"}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {loading && value.length > 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={textColor} />
          </View>
        ) : (
          value.length > 0 &&
          onClear && (
            <Pressable onPress={handleClear} style={styles.clearButton}>
              <ThemedText style={styles.clearButtonText}>✕</ThemedText>
            </Pressable>
          )
        )}
      </View>
      {showHistory && (
        <View
          style={[
            styles.historyContainer,
            {
              backgroundColor: historyBgColor,
              borderColor: borderColor,
            },
          ]}
        >
          <View
            style={[
              styles.historyHeader,
              {
                borderBottomColor: borderColor,
              },
            ]}
          >
            <ThemedText style={styles.historyTitle}>Recent Searches</ThemedText>
            <Pressable
              onPress={clearSearchHistory}
              style={styles.clearHistoryButton}
            >
              <ThemedText style={styles.clearHistoryText}>Clear</ThemedText>
            </Pressable>
          </View>
          {searchHistory.map((keyword, index) => (
            <Pressable
              key={index}
              onPress={() => handleHistoryItemPress(keyword)}
              style={[
                styles.historyItem,
                index < searchHistory.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: borderColor,
                },
              ]}
            >
              <MaterialIcons
                name="history"
                size={20}
                color={textColor}
                style={styles.historyIcon}
              />
              <ThemedText style={styles.historyText}>{keyword}</ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "relative",
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 18,
    opacity: 0.6,
  },
  loadingContainer: {
    padding: 4,
    marginLeft: 8,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  historyContainer: {
    position: "absolute",
    top: "100%",
    left: 16,
    right: 16,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },
  clearHistoryButton: {
    padding: 4,
  },
  clearHistoryText: {
    fontSize: 12,
    opacity: 0.6,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  historyIcon: {
    marginRight: 12,
    opacity: 0.6,
  },
  historyText: {
    flex: 1,
    fontSize: 14,
  },
});

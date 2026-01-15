import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  getEventDetails,
  TicketMasterEventDetailsResponse,
} from "@/services/ticketmaster";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<TicketMasterEventDetailsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEventDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const eventData = await getEventDetails(id);
        setEvent(eventData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load event details";
        setError(errorMessage);
        console.error("Error loading event details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEventDetails();
  }, [id]);

  const formatDate = (dateString: string, timeString?: string) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    let formatted = date.toLocaleDateString("en-US", options);
    if (timeString) {
      const time = new Date(`${dateString}T${timeString}`);
      formatted += ` at ${time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }
    return formatted;
  };

  const formatPrice = (
    priceRanges?: { min: number; max: number; currency: string }[]
  ) => {
    if (!priceRanges || priceRanges.length === 0) return "Price TBA";
    const range = priceRanges[0];
    if (range.min === range.max) {
      return `${range.currency} ${range.min}`;
    }
    return `${range.currency} ${range.min} - ${range.max}`;
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>
            Loading event details...
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (error || !event) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>
            {error || "Event not found"}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  const eventImage =
    event.images?.find((img) => !img.fallback && img.ratio === "16_9")?.url ||
    event.images?.find((img) => !img.fallback)?.url ||
    event.images?.[0]?.url;

  const eventDate = formatDate(
    event.dates?.start?.localDate || "",
    event.dates?.start?.localTime
  );

  const venue = event._embedded?.venues?.[0];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {eventImage && (
          <Image
            source={{ uri: eventImage }}
            style={styles.headerImage}
            contentFit="cover"
            transition={200}
          />
        )}

        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {event.name}
          </ThemedText>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Date & Time
            </ThemedText>
            <ThemedText style={styles.sectionContent}>{eventDate}</ThemedText>
            {event.dates?.timezone && (
              <ThemedText style={styles.timezone}>
                Timezone: {event.dates.timezone}
              </ThemedText>
            )}
          </ThemedView>

          {venue && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Venue
              </ThemedText>
              <ThemedText style={styles.sectionContent}>
                {venue.name}
              </ThemedText>
              {venue.address?.line1 && (
                <ThemedText style={styles.sectionContent}>
                  {venue.address.line1}
                  {venue.address.line2 && `, ${venue.address.line2}`}
                </ThemedText>
              )}
              {venue.city?.name && venue.state?.stateCode && (
                <ThemedText style={styles.sectionContent}>
                  {venue.city.name}, {venue.state.stateCode} {venue.postalCode}
                </ThemedText>
              )}
            </ThemedView>
          )}

          {event.priceRanges && event.priceRanges.length > 0 && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Price
              </ThemedText>
              <ThemedText style={styles.sectionContent}>
                {formatPrice(event.priceRanges)}
              </ThemedText>
            </ThemedView>
          )}

          {event.classifications && event.classifications.length > 0 && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Category
              </ThemedText>
              {event.classifications
                .filter((c) => c.primary)
                .map((classification, index) => (
                  <ThemedText key={index} style={styles.sectionContent}>
                    {classification.segment?.name}
                    {classification.genre?.name &&
                      ` - ${classification.genre.name}`}
                  </ThemedText>
                ))}
            </ThemedView>
          )}

          {event.description && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Description
              </ThemedText>
              <ThemedText style={styles.sectionContent}>
                {event.description}
              </ThemedText>
            </ThemedView>
          )}

          {event.pleaseNote && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Please Note
              </ThemedText>
              <ThemedText style={styles.sectionContent}>
                {event.pleaseNote}
              </ThemedText>
            </ThemedView>
          )}

          {event.info && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Additional Info
              </ThemedText>
              <ThemedText style={styles.sectionContent}>
                {event.info}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  headerImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#e0e0e0",
  },
  content: {
    padding: 16,
    gap: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  timezone: {
    fontSize: 14,
    opacity: 0.7,
  },
  linkText: {
    fontSize: 14,
    color: "#0a7ea4",
    textDecorationLine: "underline",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.6,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
  },
});

import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TicketMasterEvent } from '@/services/ticketmaster';

interface EventItemProps {
  event: TicketMasterEvent;
}

export function EventItem({ event }: EventItemProps) {
  const router = useRouter();

  // Get the first image (preferably non-fallback)
  const eventImage =
    event.images?.find((img) => !img.fallback)?.url || event.images?.[0]?.url;

  // Format date
  const formatDate = (dateString: string, timeString?: string) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    let formatted = date.toLocaleDateString('en-US', options);
    if (timeString) {
      const time = new Date(`${dateString}T${timeString}`);
      formatted += `, ${time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`;
    }
    return formatted;
  };

  const eventDate = formatDate(
    event.dates?.start?.localDate || '',
    event.dates?.start?.localTime
  );

  const handlePress = () => {
    router.push(`/event/${event.id}`);
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <ThemedView style={styles.container}>
        {eventImage && (
          <Image
            source={{ uri: eventImage }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        )}
        <ThemedView style={styles.content}>
          <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
            {event.name}
          </ThemedText>
          <ThemedText style={styles.date}>{eventDate}</ThemedText>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    gap: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  },
});

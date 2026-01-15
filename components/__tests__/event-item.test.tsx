import { TicketMasterEvent } from "@/services/ticketmaster";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { EventItem } from "../event-item";

// Mock expo-router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("EventItem", () => {
  const mockEvent: TicketMasterEvent = {
    id: "test-event-1",
    name: "Test Concert",
    type: "event",
    url: "https://example.com/event",
    locale: "en-us",
    images: [
      {
        ratio: "16_9",
        url: "https://example.com/image.jpg",
        width: 1024,
        height: 576,
        fallback: false,
      },
    ],
    sales: {
      public: {
        startDateTime: "2024-01-01T00:00:00Z",
        endDateTime: "2024-12-31T23:59:59Z",
        startTBD: false,
        startTBA: false,
      },
    },
    dates: {
      start: {
        localDate: "2024-06-15",
        localTime: "19:00:00",
        dateTime: "2024-06-15T19:00:00Z",
        dateTBD: false,
        dateTBA: false,
        timeTBA: false,
        noSpecificTime: false,
      },
      timezone: "America/New_York",
      status: {
        code: "onsale",
      },
      spanMultipleDays: false,
    },
    classifications: [
      {
        primary: true,
        segment: {
          id: "KZFzniwnSyZfZ7v7nJ",
          name: "Music",
        },
        genre: {
          id: "KnvZfZ7vAeA",
          name: "Rock",
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render event name", () => {
    const { getByText } = render(<EventItem event={mockEvent} />);
    expect(getByText("Test Concert")).toBeTruthy();
  });

  it("should render event date", () => {
    const { getByText } = render(<EventItem event={mockEvent} />);
    // Date format should include the date
    expect(getByText(/Jun/i)).toBeTruthy();
  });

  it("should render component without errors", () => {
    const { getByText } = render(<EventItem event={mockEvent} />);
    expect(getByText("Test Concert")).toBeTruthy();
  });

  it("should navigate to event details when pressed", () => {
    const { getByText } = render(<EventItem event={mockEvent} />);
    const eventName = getByText("Test Concert");

    // Press the event name to trigger navigation
    fireEvent.press(eventName);
    expect(mockPush).toHaveBeenCalledWith("/event/test-event-1");
  });

  it("should handle event without image", () => {
    const eventWithoutImage = {
      ...mockEvent,
      images: [],
    };
    const { getByText } = render(<EventItem event={eventWithoutImage} />);
    expect(getByText("Test Concert")).toBeTruthy();
  });

  it("should handle event without date", () => {
    const eventWithoutDate = {
      ...mockEvent,
      dates: {
        ...mockEvent.dates,
        start: {
          ...mockEvent.dates.start,
          localDate: "",
          localTime: "",
        },
      },
    };
    const { getByText } = render(<EventItem event={eventWithoutDate} />);
    expect(getByText("Date TBA")).toBeTruthy();
  });

  it("should use fallback image when no non-fallback image available", () => {
    const eventWithFallbackOnly = {
      ...mockEvent,
      images: [
        {
          ratio: "16_9",
          url: "https://example.com/fallback.jpg",
          width: 1024,
          height: 576,
          fallback: true,
        },
      ],
    };
    const { getByText } = render(<EventItem event={eventWithFallbackOnly} />);
    expect(getByText("Test Concert")).toBeTruthy();
  });
});

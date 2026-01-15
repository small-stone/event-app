import { searchEvents, getEventDetails } from '../ticketmaster';
import apiClient from '@/utils/api';

// Mock the API client
jest.mock('@/utils/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('TicketMaster Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchEvents', () => {
    const mockResponse = {
      _embedded: {
        events: [
          {
            id: 'event-1',
            name: 'Concert 1',
            type: 'event',
            url: 'https://example.com/event1',
            locale: 'en-us',
            images: [],
            sales: {
              public: {
                startDateTime: '2024-01-01T00:00:00Z',
                endDateTime: '2024-12-31T23:59:59Z',
                startTBD: false,
                startTBA: false,
              },
            },
            dates: {
              start: {
                localDate: '2024-06-15',
                localTime: '19:00:00',
                dateTime: '2024-06-15T19:00:00Z',
                dateTBD: false,
                dateTBA: false,
                timeTBA: false,
                noSpecificTime: false,
              },
              timezone: 'America/New_York',
              status: {
                code: 'onsale',
              },
              spanMultipleDays: false,
            },
            classifications: [],
          },
        ],
      },
      _links: {
        self: {
          href: 'https://example.com/events',
          templated: false,
        },
      },
      page: {
        size: 20,
        totalElements: 100,
        totalPages: 5,
        number: 0,
      },
    };

    it('should search events with default parameters', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockResponse });

      const result = await searchEvents();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/events', {
        params: {
          size: '20',
          page: '0',
          sort: 'date,asc',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should search events with keyword', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockResponse });

      await searchEvents({ keyword: 'music' });

      expect(mockedApiClient.get).toHaveBeenCalledWith('/events', {
        params: {
          size: '20',
          page: '0',
          sort: 'date,asc',
          keyword: 'music',
        },
      });
    });

    it('should search events with pagination', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockResponse });

      await searchEvents({ page: 1, size: 10 });

      expect(mockedApiClient.get).toHaveBeenCalledWith('/events', {
        params: {
          size: '10',
          page: '1',
          sort: 'date,asc',
        },
      });
    });

    it('should search events with filters', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockResponse });

      await searchEvents({
        keyword: 'music',
        countryCode: 'US',
        city: 'New York',
        stateCode: 'NY',
        classificationName: 'music',
      });

      expect(mockedApiClient.get).toHaveBeenCalledWith('/events', {
        params: {
          size: '20',
          page: '0',
          sort: 'date,asc',
          keyword: 'music',
          countryCode: 'US',
          city: 'New York',
          stateCode: 'NY',
          classificationName: 'music',
        },
      });
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedApiClient.get.mockRejectedValue(error);

      await expect(searchEvents()).rejects.toThrow('API Error');
    });
  });

  describe('getEventDetails', () => {
    const mockEventDetails = {
      id: 'event-1',
      name: 'Concert 1',
      type: 'event',
      url: 'https://example.com/event1',
      locale: 'en-us',
      images: [],
      sales: {
        public: {
          startDateTime: '2024-01-01T00:00:00Z',
          endDateTime: '2024-12-31T23:59:59Z',
          startTBD: false,
          startTBA: false,
        },
      },
      dates: {
        start: {
          localDate: '2024-06-15',
          localTime: '19:00:00',
          dateTime: '2024-06-15T19:00:00Z',
          dateTBD: false,
          dateTBA: false,
          timeTBA: false,
          noSpecificTime: false,
        },
        timezone: 'America/New_York',
        status: {
          code: 'onsale',
        },
        spanMultipleDays: false,
      },
      classifications: [],
    };

    it('should get event details by ID', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockEventDetails });

      const result = await getEventDetails('event-1');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/events/event-1');
      expect(result).toEqual(mockEventDetails);
    });

    it('should handle API errors when getting event details', async () => {
      const error = new Error('Event not found');
      mockedApiClient.get.mockRejectedValue(error);

      await expect(getEventDetails('invalid-id')).rejects.toThrow('Event not found');
    });
  });
});

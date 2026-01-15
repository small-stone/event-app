import apiClient from "@/utils/api";

// Types for TicketMaster API responses
export interface TicketMasterEvent {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images: {
    ratio: string;
    url: string;
    width: number;
    height: number;
    fallback: boolean;
  }[];
  sales: {
    public: {
      startDateTime: string;
      endDateTime: string;
      startTBD: boolean;
      startTBA: boolean;
    };
  };
  dates: {
    start: {
      localDate: string;
      localTime: string;
      dateTime: string;
      dateTBD: boolean;
      dateTBA: boolean;
      timeTBA: boolean;
      noSpecificTime: boolean;
    };
    timezone: string;
    status: {
      code: string;
    };
    spanMultipleDays: boolean;
  };
  classifications: {
    primary: boolean;
    segment: {
      id: string;
      name: string;
    };
    genre: {
      id: string;
      name: string;
    };
    subGenre?: {
      id: string;
      name: string;
    };
  }[];
  priceRanges?: {
    type: string;
    currency: string;
    min: number;
    max: number;
  }[];
  _embedded?: {
    venues?: {
      id: string;
      name: string;
      type: string;
      url: string;
      locale: string;
      postalCode: string;
      timezone: string;
      city: {
        name: string;
      };
      state: {
        name: string;
        stateCode: string;
      };
      country: {
        name: string;
        countryCode: string;
      };
      address: {
        line1: string;
        line2?: string;
      };
      location: {
        longitude: string;
        latitude: string;
      };
    }[];
  };
  pleaseNote?: string;
  info?: string;
  description?: string;
}

export interface TicketMasterSearchResponse {
  _embedded: {
    events: TicketMasterEvent[];
  };
  _links: {
    self: {
      href: string;
      templated: boolean;
    };
    next?: {
      href: string;
      templated: boolean;
    };
    prev?: {
      href: string;
      templated: boolean;
    };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface TicketMasterEventDetailsResponse {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images: {
    ratio: string;
    url: string;
    width: number;
    height: number;
    fallback: boolean;
  }[];
  sales: {
    public: {
      startDateTime: string;
      endDateTime: string;
      startTBD: boolean;
      startTBA: boolean;
    };
  };
  dates: {
    start: {
      localDate: string;
      localTime: string;
      dateTime: string;
      dateTBD: boolean;
      dateTBA: boolean;
      timeTBA: boolean;
      noSpecificTime: boolean;
    };
    timezone: string;
    status: {
      code: string;
    };
    spanMultipleDays: boolean;
  };
  classifications: {
    primary: boolean;
    segment: {
      id: string;
      name: string;
    };
    genre: {
      id: string;
      name: string;
    };
    subGenre?: {
      id: string;
      name: string;
    };
  }[];
  priceRanges?: {
    type: string;
    currency: string;
    min: number;
    max: number;
  }[];
  _embedded?: {
    venues?: {
      id: string;
      name: string;
      type: string;
      url: string;
      locale: string;
      postalCode: string;
      timezone: string;
      city: {
        name: string;
      };
      state: {
        name: string;
        stateCode: string;
      };
      country: {
        name: string;
        countryCode: string;
      };
      address: {
        line1: string;
        line2?: string;
      };
      location: {
        longitude: string;
        latitude: string;
      };
    }[];
  };
  pleaseNote?: string;
  info?: string;
  description?: string;
}

// Search events API
export interface SearchEventsParams {
  keyword?: string;
  size?: number; // Number of results per page (default: 20, max: 200)
  page?: number; // Page number (default: 0)
  sort?: string; // Sort order: "name,asc", "name,desc", "date,asc", "date,desc", "relevance,asc", "relevance,desc"
  countryCode?: string; // ISO 3166-1 alpha-2 country code
  city?: string;
  stateCode?: string;
  classificationName?: string; // e.g., "music", "sports", "arts"
}

export const searchEvents = async (
  params: SearchEventsParams = {}
): Promise<TicketMasterSearchResponse> => {
  const {
    keyword,
    size = 20,
    page = 0,
    sort = "date,asc",
    countryCode,
    city,
    stateCode,
    classificationName,
  } = params;

  const queryParams: Record<string, string> = {
    size: size.toString(),
    page: page.toString(),
    sort,
  };

  if (keyword) {
    queryParams.keyword = keyword;
  }
  if (countryCode) {
    queryParams.countryCode = countryCode;
  }
  if (city) {
    queryParams.city = city;
  }
  if (stateCode) {
    queryParams.stateCode = stateCode;
  }
  if (classificationName) {
    queryParams.classificationName = classificationName;
  }

  const response = await apiClient.get<TicketMasterSearchResponse>("/events", {
    params: queryParams,
  });

  return response.data;
};

// Get event details by ID
export const getEventDetails = async (
  eventId: string
): Promise<TicketMasterEventDetailsResponse> => {
  const response = await apiClient.get<TicketMasterEventDetailsResponse>(
    `/events/${eventId}`
  );

  return response.data;
};

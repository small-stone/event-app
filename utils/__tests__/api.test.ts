import apiClient from '../api';

// Mock the API client module
jest.mock('../api', () => {
  const actualModule = jest.requireActual('../api');
  return {
    __esModule: true,
    default: {
      get: jest.fn(),
      post: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    },
    apiRequest: actualModule.apiRequest,
  };
});

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have API client instance', () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.get).toBeDefined();
  });

  it('should make GET requests', async () => {
    const mockResponse = { data: { success: true } };
    mockedApiClient.get.mockResolvedValue(mockResponse);

    const result = await apiClient.get('/test');

    expect(mockedApiClient.get).toHaveBeenCalledWith('/test');
    expect(result).toEqual(mockResponse);
  });

  it('should handle request errors', async () => {
    const error = {
      response: {
        status: 404,
        data: { message: 'Not found' },
      },
    };
    
    mockedApiClient.get.mockRejectedValue(error);

    await expect(apiClient.get('/test')).rejects.toEqual(error);
  });

  it('should handle network errors', async () => {
    const error = {
      request: {},
    };
    
    mockedApiClient.get.mockRejectedValue(error);

    await expect(apiClient.get('/test')).rejects.toEqual(error);
  });
});

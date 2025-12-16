import axios from 'axios';
import { instagramService } from '../../services/instagramService';

import { DEFAULT_HASHTAG, FACEBOOK_GRAPH_API_URL } from '../../constants/instagram';

jest.mock('axios');
jest.mock('../../utils/env', () => ({
  getEnvVar: (key: string) => {
    if (key === 'VITE_INSTAGRAM_ACCESS_TOKEN') return 'mock_token';
    if (key === 'VITE_INSTAGRAM_USER_ID') return 'test_user_id_123';
    return '';
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.isAxiosError
const mockIsAxiosError = axios.isAxiosError as jest.MockedFunction<typeof axios.isAxiosError>;

describe('instagramService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPostsByHashtag', () => {
    it('should fetch the Instagram posts successfully.', async () => {
      const mockPosts = [
        {
          id: '1',
          media_type: 'IMAGE' as const,
          media_url: 'https://example.com/image1.jpg',
          permalink: 'https://instagram.com/p/1',
          caption: 'Test post 1',
          timestamp: '2024-12-15T10:00:00Z',
        },
        {
          id: '2',
          media_type: 'IMAGE' as const,
          media_url: 'https://example.com/image2.jpg',
          permalink: 'https://instagram.com/p/2',
          caption: 'Test post 2',
          timestamp: '2024-12-15T11:00:00Z',
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({
        status: 200,
        data: { data: mockPosts },
      });

      const result = await instagramService.getPostsByHashtag();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${FACEBOOK_GRAPH_API_URL}/${DEFAULT_HASHTAG}/recent_media`,
        expect.objectContaining({
          params: expect.objectContaining({
            fields: 'id,caption,media_type,media_url,permalink,timestamp',
            limit: 25,
          }),
        })
      );
      expect(result).toEqual(mockPosts);
      expect(result).toHaveLength(2);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Invalid access token';
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            error: { message: errorMessage },
          },
        },
        message: 'Request failed',
      };
      
      mockedAxios.get.mockRejectedValueOnce(axiosError);
      mockIsAxiosError.mockReturnValue(true);

      await expect(instagramService.getPostsByHashtag()).rejects.toThrow(
        `Failed to fetch Instagram posts: ${errorMessage}`
      );
    });

    it('should return empty array when no posts are found', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 200,
        data: { data: [] },
      });

      const result = await instagramService.getPostsByHashtag();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});

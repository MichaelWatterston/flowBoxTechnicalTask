import { getEnvVar } from '../utils/env';
import axios from 'axios';

import { DEFAULT_HASHTAG, FACEBOOK_GRAPH_API_URL } from '../constants/instagram';
import { DEFAULT_POST_LIMIT } from '../constants/generalContants';
import type { InstagramPost } from '../types/instagram';

// Instagram API configuration.
const ACCESS_TOKEN = getEnvVar('VITE_INSTAGRAM_ACCESS_TOKEN');
const INSTAGRAM_USER_ID = getEnvVar('VITE_INSTAGRAM_USER_ID');

// Common fields for media queries.
const MEDIA_FIELDS = 'id,caption,media_type,media_url,permalink,timestamp';

// Helper to handle axios errors.
const handleApiError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    console.error(`${context}:`, error.response?.data || error.message);
    throw new Error(`${context}: ${errorMessage}`);
  }
  throw error;
};

// Helper for making API request.
const makeApiRequest = async <T>(
  endpoint: string,
  params: Record<string, string | number>
): Promise<T> => {
  const response = await axios.get(`${FACEBOOK_GRAPH_API_URL}${endpoint}`, {
    params: {
      access_token: ACCESS_TOKEN,
      ...params,
    },
  });
  return response.data;
};

export const instagramService = {
  // Search for a hashtag by name and get its ID from facebook graph API.

  async searchHashtagId(tagName: string): Promise<string> {
    try {
      const cleanTag = tagName.replace('#', '');
      const data = await makeApiRequest<{ data: Array<{ id: string }> }>(
        '/ig_hashtag_search',
        {
          user_id: INSTAGRAM_USER_ID,
          q: cleanTag,
        }
      );

      if (data.data && data.data.length > 0) {
        return data.data[0].id;
      }
      throw new Error(`Hashtag "${tagName}" not found`);
    } catch (error) {
      return handleApiError(error, 'Failed to search hashtag');
    }
  },

// Magic happens, Fetch Instagram posts by hashtag ID.
  async getPostsByHashtagId(
    hashtagId: string,
    limit: number = DEFAULT_POST_LIMIT
  ): Promise<InstagramPost[]> {
    try {
      const data = await makeApiRequest<{ data: InstagramPost[] }>(
        `/${hashtagId}/recent_media`,
        {
          user_id: INSTAGRAM_USER_ID,
          fields: MEDIA_FIELDS,
          limit,
        }
      );
      return data.data || [];
    } catch (error) {
      return handleApiError(error, 'Failed to fetch Instagram posts');
    }
  },

  // Fetch Instagram posts by hashtag name or use default hashtag
  async getPostsByHashtag(
    limit: number = DEFAULT_POST_LIMIT,
    hashtagName: string = 'cars'
  ): Promise<InstagramPost[]> {
    const hashtagId = hashtagName.toLowerCase() === 'cars'
      ? DEFAULT_HASHTAG
      : await this.searchHashtagId(hashtagName);

    return this.getPostsByHashtagId(hashtagId, limit);
  },


// Fetch the media.
  async getUserMedia(
    userId: string = INSTAGRAM_USER_ID,
    limit: number = DEFAULT_POST_LIMIT
  ): Promise<InstagramPost[]> {
    try {
      const data = await makeApiRequest<{ data: InstagramPost[] }>(
        `/${userId}/media`,
        {
          fields: MEDIA_FIELDS,
          limit,
        }
      );
      return data.data || [];
    } catch (error) {
      return handleApiError(error, 'Failed to fetch user media');
    }
  },
};

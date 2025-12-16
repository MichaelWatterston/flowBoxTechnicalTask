import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

import { instagramService } from '../services/instagramService';
import { DEFAULT_POST_LIMIT } from '../constants/generalContants';
import { DEFAULT_HASHTAG } from '../constants/instagram';
import { UI_MESSAGES } from '../constants/messages';
import type { InstagramPost } from '../types/instagram';

interface InstagramContextType {
  posts: InstagramPost[];
  loading: boolean;
  error: string | null;
  hashtag: string;
  searchHashtag: (tag: string) => Promise<void>;
}

const InstagramContext = createContext<InstagramContextType | undefined>(undefined);

export function InstagramProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hashtag, setHashtag] = useState(DEFAULT_HASHTAG);

  const fetchPosts = useCallback(async (tag?: string) => {
    const searchTag = tag || hashtag;
    try {
      setLoading(true);
      setError(null);
      const data = await instagramService.getPostsByHashtag(DEFAULT_POST_LIMIT, searchTag);
      setPosts(data);
      if (tag) {
        setHashtag(tag);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : UI_MESSAGES.fetchError);
      console.error('Error fetching Instagram posts:', err);
    } finally {
      setLoading(false);
    }
  }, [hashtag]);

  const value = {
    posts,
    loading,
    error,
    hashtag,
    searchHashtag: fetchPosts,
  };

  return (
    <InstagramContext.Provider value={value}>
      {children}
    </InstagramContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInstagram() {
  const context = useContext(InstagramContext);
  if (context === undefined) {
    throw new Error('useInstagram must be used within an InstagramProvider');
  }
  return context;
}

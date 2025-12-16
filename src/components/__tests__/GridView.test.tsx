import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GridView from '../views/GridView';
import type { InstagramPost } from '../../types/instagram';

// Mock hooks.
const mockHandleLike = jest.fn();
const mockHandleDelete = jest.fn();

jest.mock('../../hooks/usePostActions', () => ({
  usePostActions: () => ({
    handleLike: mockHandleLike,
    handleDelete: mockHandleDelete,
  }),
}));

describe('GridView', () => {
  const mockPosts: InstagramPost[] = [
    {
      id: '1',
      media_type: 'IMAGE',
      media_url: 'https://example.com/image1.jpg',
      permalink: 'https://instagram.com/p/1',
      caption: 'Beautiful car photo with a long description that should be truncated',
      timestamp: '2024-12-15T10:00:00Z',
    },
    {
      id: '2',
      media_type: 'VIDEO',
      media_url: 'https://example.com/video1.mp4',
      permalink: 'https://instagram.com/p/2',
      caption: 'Car video',
      timestamp: '2024-12-15T11:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render all posts in grid items view.', () => {
      render(<GridView posts={mockPosts} />);

      const gridItems = document.querySelectorAll('.grid-view__item');
      expect(gridItems).toHaveLength(mockPosts.length);
    });

    it('should display empty state when there are no posts.', () => {
      render(<GridView posts={[]} />);

      expect(screen.getByText('No posts found.')).toBeInTheDocument();
    });
  });

  describe('media content', () => {
    it('should show an image with the correct src and alt.', () => {
      render(<GridView posts={[mockPosts[0]]} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', mockPosts[0].media_url);
      expect(image).toHaveAttribute('alt', mockPosts[0].caption);
      expect(image).toHaveClass('grid-view__media');
    });

    it('should show the video with correct src.', () => {
      render(<GridView posts={[mockPosts[1]]} />);

      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', mockPosts[1].media_url);
      expect(video).toHaveClass('grid-view__media');
    });
  });

  describe('captions', () => {
    it('should shorten long image captions to 100 characters', () => {
      render(<GridView posts={[mockPosts[0]]} />);

      const caption = screen.getByText(/Beautiful car photo/i);
      expect(caption).toBeInTheDocument();
      expect(caption.textContent).toMatch(/\.\.\.$/); // Should end with ...
    });

    it('should handle posts without captions.', () => {
      const postWithoutCaption = { ...mockPosts[0], caption: undefined };
      render(<GridView posts={[postWithoutCaption]} />);

      const captionElements = screen.queryByText(/.{10,}/);
      expect(captionElements).toBeInTheDocument();
    });
  });

  describe('links and navigation', () => {
    it('should show links with correct attributes.', () => {
      render(<GridView posts={mockPosts} />);

      const links = screen.getAllByRole('link');
      
      links.forEach((link, index) => {
        const expectedPost = mockPosts[Math.floor(index / 2)]; // Each post has 2 links
        expect(link).toHaveAttribute('href', expectedPost.permalink);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('actions', () => {
    it('should show like and delete buttons for each post.', () => {
      render(<GridView posts={mockPosts} />);

      const likeButtons = screen.getAllByTitle('Like');
      const deleteButtons = screen.getAllByTitle('Delete');

      expect(likeButtons).toHaveLength(mockPosts.length);
      expect(deleteButtons).toHaveLength(mockPosts.length);
    });

    it('should show View on Instagram link for each post', () => {
      render(<GridView posts={mockPosts} />);

      const viewLinks = screen.getAllByText('View on Instagram');
      expect(viewLinks).toHaveLength(mockPosts.length);
    });
  });

  describe('advanced user interactions', () => {
    it('calls the like handler for the specific post when user clicks its like button', async () => {
      const user = userEvent.setup();
      render(<GridView posts={mockPosts} />);

      const gridItems = document.querySelectorAll('.grid-view__item');
      const firstItem = gridItems[0];
      const likeButton = within(firstItem as HTMLElement).getByTitle('Like');

      await user.click(likeButton);

      expect(mockHandleLike).toHaveBeenCalledTimes(1);
      expect(mockHandleLike.mock.calls[0][1]).toBe(mockPosts[0].id);
    });

    it('tracks the correct post IDs when user likes and deletes multiple posts in sequence', async () => {
      const user = userEvent.setup();
      render(<GridView posts={mockPosts} />);

      const gridItems = document.querySelectorAll('.grid-view__item');
      
      // User likes first post.
      const firstLikeBtn = within(gridItems[0] as HTMLElement).getByTitle('Like');
      await user.click(firstLikeBtn);

      // User deletes second post.
      const secondDeleteBtn = within(gridItems[1] as HTMLElement).getByTitle('Delete');
      await user.click(secondDeleteBtn);

      // User likes second post.
      const secondLikeBtn = within(gridItems[1] as HTMLElement).getByTitle('Like');
      await user.click(secondLikeBtn);

      // Check correct sequence of calls with correct IDs.
      expect(mockHandleLike).toHaveBeenCalledTimes(2);
      expect(mockHandleDelete).toHaveBeenCalledTimes(1);
      
      // Check that the second argument (post ID) matches.
      expect(mockHandleLike.mock.calls[0][1]).toBe(mockPosts[0].id);
      expect(mockHandleDelete.mock.calls[0][1]).toBe(mockPosts[1].id);
      expect(mockHandleLike.mock.calls[1][1]).toBe(mockPosts[1].id);
    });
  });
});

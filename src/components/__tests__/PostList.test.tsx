import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostList from '../views/PostList';
import type { InstagramPost } from '../../types/instagram';

describe('PostList', () => {
  const mockPosts: InstagramPost[] = [
    {
      id: '1',
      media_type: 'IMAGE',
      media_url: 'https://example.com/image1.jpg',
      permalink: 'https://instagram.com/p/1',
      caption: 'Amazing sports car #cars',
      timestamp: '2024-12-15T10:00:00Z',
      like_count: 1500,
      comments_count: 50,
      username: 'car_lover',
    },
    {
      id: '2',
      media_type: 'VIDEO',
      media_url: 'https://example.com/video2.mp4',
      permalink: 'https://instagram.com/p/2',
      caption: 'Fast car in action',
      timestamp: '2024-12-16T14:30:00Z',
      like_count: 2300,
      comments_count: 120,
      username: 'speed_demon',
    },
  ];

  describe('rendering', () => {
    it('should show all posts in a list.', () => {
      render(<PostList posts={mockPosts} />);

      const postItems = document.querySelectorAll('.post-list__item');
      expect(postItems).toHaveLength(mockPosts.length);
    });

    it('should display np post empty state.', () => {
      render(<PostList posts={[]} />);

      expect(screen.getByText('No posts found.')).toBeInTheDocument();
    });
  });

  describe('post details', () => {
    it('should display the instagram username.', () => {
      render(<PostList posts={[mockPosts[0]]} />);

      expect(screen.getByText('@car_lover')).toBeInTheDocument();
    });

    it('should show caption.', () => {
      render(<PostList posts={[mockPosts[0]]} />);

      expect(screen.getByText('Amazing sports car #cars')).toBeInTheDocument();
    });

    it('should show like count.', () => {
      render(<PostList posts={[mockPosts[0]]} />);

      const likeElement = screen.getByLabelText('1500 likes');
      expect(likeElement).toBeInTheDocument();
      expect(likeElement).toHaveTextContent('1500');
    });

    it('should display comments count when provided.', () => {
      render(<PostList posts={[mockPosts[0]]} />);

      const commentsElement = screen.getByLabelText('50 comments');
      expect(commentsElement).toBeInTheDocument();
      expect(commentsElement).toHaveTextContent('50');
    });

    it('should show formatted timestamp.', () => {
      render(<PostList posts={[mockPosts[0]]} />);

      const dateElement = document.querySelector('.post-list__date');
      expect(dateElement).toBeInTheDocument();
      expect(dateElement?.textContent).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should handle posts without optional fields', () => {
      const minimalPost: InstagramPost = {
        id: '3',
        media_type: 'IMAGE',
        media_url: 'https://example.com/image3.jpg',
        permalink: 'https://instagram.com/p/3',
        timestamp: '2024-12-17T08:00:00Z',
      };

      render(<PostList posts={[minimalPost]} />);

      const postItem = document.querySelector('.post-list__item');
      expect(postItem).toBeInTheDocument();
      
      expect(screen.queryByText(/@/)).not.toBeInTheDocument();
    });
  });

  describe('media content', () => {
    it('should render image with correct attributes image type.', () => {
      render(<PostList posts={[mockPosts[0]]} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', mockPosts[0].media_url);
      expect(image).toHaveAttribute('alt', mockPosts[0].caption);
      expect(image).toHaveClass('post-list__media');
    });

    it('should show videos with correct src attributes.', () => {
      render(<PostList posts={[mockPosts[1]]} />);

      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', mockPosts[1].media_url);
      expect(video).toHaveClass('post-list__media');
    });
  });

  describe('navigation', () => {
    it('should show links with correct attributes.', () => {
      render(<PostList posts={[mockPosts[0]]} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', mockPosts[0].permalink);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have accessible link for screen readers', () => {
      render(<PostList posts={[mockPosts[0]]} />);

      const link = screen.getByLabelText('View on Instagram');
      expect(link).toBeInTheDocument();
    });
  });
});

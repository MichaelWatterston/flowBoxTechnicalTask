import { MediaContent } from '../ui/MediaContent';
import ImageDropZone from '../ui/ImageDropZone';
import { UI_MESSAGES } from '../../constants/messages';
import type { InstagramPost } from '../../types/instagram';

import '../../styles/GridView.css';
import '../../styles/PostList.css';

interface PostListProps {
  posts: InstagramPost[];
}

function PostItem({ post }: { post: InstagramPost }) {
  return (
    <div className="post-list__item">
      <div className="post-list__media-section">
        <a 
          href={post.permalink} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={UI_MESSAGES.viewOnInstagram}
        >
          <MediaContent post={post} className="post-list__media" />
        </a>
      </div>
      <div className="post-list__details">
        {post.username && (
          <p className="post-list__username">@{post.username}</p>
        )}
        {post.caption && (
          <p className="post-list__caption">{post.caption}</p>
        )}
        <div className="post-list__stats">
          {post.like_count !== undefined && (
            <span aria-label={`${post.like_count} likes`}>
              ❤️ {post.like_count}
            </span>
          )}
          {post.comments_count !== undefined && (
            <span aria-label={`${post.comments_count} comments`}>
              💬 {post.comments_count}
            </span>
          )}
          <p className="post-list__date">
            {new Date(post.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <>
        <div className="status-message status-message--empty">{UI_MESSAGES.noPosts}</div>
        <ImageDropZone />
      </>
    );
  }

  return (
    <>
      <div className="post-list__wrapper">
        <div className="post-list">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </div>
      <ImageDropZone />
    </>
  );
}

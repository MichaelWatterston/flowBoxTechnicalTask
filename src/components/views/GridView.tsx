import { usePostActions } from '../../hooks/usePostActions';
import { HeartIcon, DeleteIcon } from '../ui/Icons';
import { MediaContent } from '../ui/MediaContent';
import { CAPTION_MAX_LENGTH } from '../../constants/generalContants';
import { UI_MESSAGES } from '../../constants/messages';
import type { InstagramPost } from '../../types/instagram';

import '../../styles/GridView.css';

interface GridViewProps {
  posts: InstagramPost[];
}

function GridItem({ post, onLike, onDelete }: { 
  post: InstagramPost; 
  onLike: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}) {
  return (
    <div className="grid-view__item">
      <a 
        href={post.permalink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="grid-view__media-link"
      >
        <MediaContent post={post} className="grid-view__media" />
      </a>
      <p className="grid-view__caption">
        {post.caption ? `${post.caption.slice(0, CAPTION_MAX_LENGTH)}...` : ''}
      </p>
      <div className="grid-view__actions">
        <button 
          className="grid-view__action-btn" 
          onClick={(e) => onLike(e, post.id)}
          title={UI_MESSAGES.likePost}
          aria-label={UI_MESSAGES.likePost}
        >
          <HeartIcon />
        </button>
        <a 
          href={post.permalink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="grid-view__action-link"
          title={UI_MESSAGES.viewOnInstagram}
        >
          {UI_MESSAGES.viewOnInstagram}
        </a>
        <button 
          className="grid-view__action-btn" 
          onClick={(e) => onDelete(e, post.id)}
          title={UI_MESSAGES.deletePost}
          aria-label={UI_MESSAGES.deletePost}
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}

export default function GridView({ posts }: GridViewProps) {
  const { handleLike, handleDelete } = usePostActions();

  if (posts.length === 0) {
    return <div className="status-message status-message--empty">{UI_MESSAGES.noPosts}</div>;
  }

  return (
    <>
      {posts.map((post) => (
        <GridItem 
          key={post.id} 
          post={post} 
          onLike={handleLike} 
          onDelete={handleDelete} 
        />
      ))}
    </>
  );
}

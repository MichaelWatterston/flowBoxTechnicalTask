import type { InstagramPost } from '../../types/instagram';
import { UI_MESSAGES } from '../../constants/messages';

interface MediaContentProps {
  post: InstagramPost;
  className: string;
}

export function MediaContent({ post, className }: MediaContentProps) {
  const alt = post.caption || UI_MESSAGES.defaultAlt;
  
  return post.media_type === 'VIDEO' ? (
    <video src={post.media_url} className={className} />
  ) : (
    <img src={post.media_url} alt={alt} className={className} />
  );
}

import { useCallback } from 'react';

export const usePostActions = () => {
  const handleLike = useCallback((e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    // TODO: Implement this
    console.log('Liked post:', postId);
    alert("Whoops, I didn't do this part yet!");
  }, []);

  const handleDelete = useCallback((e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    // TODO: Implement this
    console.log('Delete post:', postId);
    alert("Whoops, I didn't do this part yet!");
  }, []);

  return {
    handleLike,
    handleDelete
  };
};

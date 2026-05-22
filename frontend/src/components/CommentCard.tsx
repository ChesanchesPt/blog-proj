import { Link } from 'react-router-dom';
import { upvoteComment, downvoteComment, deleteComment } from '../api/comments';
import { type Comment } from '../types';
import { formatRelativeDate } from '../utils/dates';
import { VoteActions } from './VoteActions';
import { useAuth } from '../contexts/AuthContext';

interface CommentCardProps {
  comment: Comment;
  onDeleteSuccess: (commentId: number) => void;
  onVoteSuccess: (commentId: number, delta: number) => void;
}

export const CommentCard = ({ comment, onDeleteSuccess, onVoteSuccess }: CommentCardProps) => {

  const { user } = useAuth();
  const isAuthor = user && comment && user.id === comment.authorId;
  const isAdmin = user?.isAdmin || false;
  const canModify = isAuthor || isAdmin;

  const handleUpvote = async () => {
    try {
      const response = await upvoteComment(comment.id);
      onVoteSuccess(comment.id, response.data.pointsDelta);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvote = async () => {
    try {
      const response = await downvoteComment(comment.id);
      onVoteSuccess(comment.id, response.data.pointsDelta);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(comment.id);
      onDeleteSuccess(comment.id);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Не получилось удалить комментарий');
    }
  };

  return (
    <div className="border-3 border-black shadow-[3px_3px_0px_#1A1A1A] bg-white p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3 mb-2 text-x">
            <span>
                <Link to={`/users/${comment.author.id}`} className="font-bold underline hover:bg-accent">
                    {comment.author.username}
                </Link>
            </span>
            <span>{formatRelativeDate(comment.createdAt)}</span>
        </div>

        <p className="text-sm whitespace-pre-line">{comment.text}</p>

        <div >
          <div className="mt-2">
            <VoteActions
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              points={comment.points}
              onDelete={handleDelete}
              canModify={canModify}
            />
          </div>
        </div>
    </div>
  );
};
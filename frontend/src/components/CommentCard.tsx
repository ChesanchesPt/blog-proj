import { Link } from 'react-router-dom';
import { upvoteComment, downvoteComment, deleteComment } from '../api/comments';
import { type Comment } from '../types';
import { formatRelativeDate } from '../utils/dates';
import { VoteActions } from './VoteActions';

interface CommentCardProps {
  comment: Comment;
  onDeleteSuccess: () => void;
  onVoteSuccess: () => void;
}

export const CommentCard = ({ comment, onDeleteSuccess, onVoteSuccess }: CommentCardProps) => {

  const handleUpvote = async () => {
    try {
      await upvoteComment(comment.id);
      onVoteSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvote = async () => {
    try {
      await downvoteComment(comment.id);
      onVoteSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(comment.id);
      onDeleteSuccess();
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

        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium text-gray-600">
          <div className="flex gap-2 ml-auto">
            <VoteActions
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              points={comment.points}
              onDelete={handleDelete}
            />
          </div>
        </div>
    </div>
  );
};
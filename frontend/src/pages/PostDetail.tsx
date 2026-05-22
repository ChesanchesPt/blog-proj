import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRecentPosts } from '../contexts/RecentPostsContext';
import { getPostById, deletePost, upvotePost, downvotePost } from '../api/posts';
import { Navbar } from '../components/NavBar';
import { VoteActions } from '../components/VoteActions';
import { CommentCard } from '../components/CommentCard';
import { CommentForm } from '../components/CommentForm';
import { formatRelativeDate } from '../utils/dates';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useApiCall } from '../hooks/useApiCall';
import { ErrorMessage } from '../components/ErrorMessage';
import type { Comment, Post } from '../types';

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, loading, error, execute: loadPost } = useApiCall(
    () => getPostById(Number(id)),
    []
  );
  const [postState, setPostState] = useState<Post | null>(null);
  const { user } = useAuth();
  const { addRecentPost } = useRecentPosts();
  const navigate = useNavigate();

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      setPostState(post);
      addRecentPost(post);
    }
  }, [post?.id]);

  const updatePostPoints = (delta: number) => {
    setPostState((prev) => {
      if (!prev) return prev;
      return { ...prev, points: prev.points + delta };
    });
  };

  const handleCommentPosted = (newComment: Comment) => {
    setPostState((prev) => {
      if (!prev) return prev;
      return { ...prev, comments: [...prev.comments, newComment] };
    });
  };

  const handleCommentVote = (commentId: number, delta: number) => {
    setPostState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.map((comment) =>
          comment.id === commentId ? { ...comment, points: comment.points + delta } : comment
        ),
      };
    });
  };

  const handleCommentDelete = (commentId: number) => {
    setPostState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.filter((comment) => comment.id !== commentId),
      };
    });
  };

  const isAuthor = user && postState && user.id === postState.authorId;
  const isAdmin = user?.isAdmin || false;
  const canModify = isAuthor || isAdmin;

  const handleDeletePost = async () => {
    if (!confirm('Delete this post? This will also delete all comments.')) return;
    try {
      await deletePost(Number(id));
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleUpvote = async () => {
    if (!user || !postState) return;
    try {
      const response = await upvotePost(postState.id);
      updatePostPoints(response.data.pointsDelta);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvote = async () => {
    if (!user || !postState) return;
    try {
      const response = await downvotePost(postState.id);
      updatePostPoints(response.data.pointsDelta);
    } catch (err) {
      console.error(err);
    }
  };

  const postData = postState || post;

  if (loading) return <><Navbar /><LoadingSpinner /></>;
  if (error) return <><Navbar /><div className="max-w-2xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div></>;
  if (!postData) return <><Navbar /><div className="max-w-2xl mx-auto px-4 py-8"><p className="font-bold text-xl">Пост не найден</p></div></>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 font-mono">
        <article className="border-3 border-black shadow-[6px_6px_0px_#1A1A1A] bg-white p-6 mb-6">
          <h1 className="text-2xl font-black text-black mb-2">{postData.title}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-black mb-4">
            <span>
              Автор:{' '}
              <Link to={`/users/${postData.author.id}`} className="font-bold underline hover:bg-accent">
                {postData.author.username}
              </Link>
            </span>
            <span>{formatRelativeDate(postData.createdAt)}</span>
          </div>

          {postData.imageUrl && (
            <img
              src={postData.imageUrl}
              alt={`Изображение для поста`}
              className="w-full border-2 border-black rounded-md mb-4"
            />
          )}

          <p className="text-base leading-relaxed whitespace-pre-line">
            {postData.description || '(нет описания)'}
          </p>
        </article>

        <VoteActions
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
          points={postData.points}
          canModify={canModify}
          editUrl={`/edit/${postData.id}`}
          onDelete={handleDeletePost}
        />

        <section className="mt-8">
          <h2 className="text-2xl font-black border-b-3 border-black pb-2 mb-4">
            Комментарии ({postData.comments?.length || 0})
          </h2>

          {user && (
            <CommentForm postId={postData.id} onCommentPosted={handleCommentPosted} />
          )}

          {postData.comments?.length === 0 && (
            <p className="text-gray-600 mb-4">Пока нет комментариев. Будьте первым!</p>
          )}

          {postData.comments?.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onDeleteSuccess={handleCommentDelete}
              onVoteSuccess={handleCommentVote}
            />
          ))}
        </section>
      </div>
    </>
  );
};
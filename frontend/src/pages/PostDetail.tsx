import { useEffect } from 'react';
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

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, loading, error, execute: loadPost } = useApiCall(
    () => getPostById(Number(id)),
    []
  );
  const { user } = useAuth();
  const { addRecentPost } = useRecentPosts();
  const navigate = useNavigate();

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      addRecentPost(post);
    }
  }, [post?.id]);

  const isAuthor = user && post && user.id === post.authorId;
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

  if (loading) return <><Navbar /><LoadingSpinner /></>;
  if (error) return <><Navbar /><div className="max-w-2xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div></>;
  if (!post) return <><Navbar /><div className="max-w-2xl mx-auto px-4 py-8"><p className="font-bold text-xl">Post not found</p></div></>;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8 font-mono">
        <article className="border-3 border-black shadow-[6px_6px_0px_#1A1A1A] bg-white p-6 mb-6">
          <h1 className="text-4xl font-black text-black mb-2">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-gray-600 mb-4">
            <span>
              Автор{' '}
              <Link to={`/users/${post.author.id}`} className="font-bold underline hover:bg-accent">
                {post.author.username}
              </Link>
            </span>
            <span>{formatRelativeDate(post.createdAt)}</span>
          </div>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={`Изображение для ${post.title}`}
              className="w-full border-2 border-black rounded-md mb-4"
            />
          )}

          <p className="text-base leading-relaxed whitespace-pre-line">
            {post.description || '(нет описания)'}
          </p>
        </article>

        <VoteActions
          onUpvote={async () => {
            if (!user) return;
            try {
              await upvotePost(post.id);
              loadPost();
            } catch (err) { console.error(err); }
          }}
          onDownvote={async () => {
            if (!user) return;
            try {
              await downvotePost(post.id);
              loadPost();
            } catch (err) { console.error(err); }
          }}
          points={post.points}
          canModify={canModify}
          editUrl={`/edit/${post.id}`}
          onDelete={handleDeletePost}
        />

        <section className="mt-8">
          <h2 className="text-2xl font-black border-b-3 border-black pb-2 mb-4">
            Комментарии ({post.comments?.length || 0})
          </h2>

          {user && (
            <CommentForm postId={post.id} onCommentPosted={loadPost} />
          )}

          {post.comments?.length === 0 && (
            <p className="text-gray-600 mb-4">Пока нет комментариев. Будьте первым!</p>
          )}

          {post.comments?.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onDeleteSuccess={loadPost}
              onVoteSuccess={loadPost}
            />
          ))}
        </section>
      </div>
    </>
  );
};
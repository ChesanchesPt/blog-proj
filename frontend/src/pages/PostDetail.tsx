import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPostById, upvotePost, downvotePost, deletePost } from '../api/posts';
import { createComment, upvoteComment, downvoteComment, deleteComment } from '../api/comments';
import { type Post, type Comment } from '../types';

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAuthor = user && post && user.id === post.authorId;
  const isAdmin = user?.isAdmin || false;
  const canModify = isAuthor || isAdmin;

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const res = await getPostById(Number(id));
      setPost(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Не получилось загрузить пост');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvotePost = async () => {
    if (!user) return;
    try {
      await upvotePost(Number(id));
      await loadPost();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvotePost = async () => {
    if (!user) return;
    try {
      await downvotePost(Number(id));
      await loadPost();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await createComment({ text: commentText, postId: Number(id) });
      setCommentText('');
      await loadPost(); // refresh comments
    } catch (err: any) {
      alert(err.response?.data?.error || 'Не удалось опубликовать комментарий');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvoteComment = async (commentId: number) => {
    try {
      await upvoteComment(commentId);
      await loadPost();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvoteComment = async (commentId: number) => {
    try {
      await downvoteComment(commentId);
      await loadPost();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId);
      await loadPost();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Не удалось удалить комментарий');
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Delete this post? This will also delete all comments.')) return;
    try {
      await deletePost(Number(id));
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Не удалось удалить пост');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!post) return <div>Пост не найден</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>{post.title}</h1>
      <p>
        By <Link to={`/users/${post.author.id}`}>{post.author.username}</Link> | 
        Posted on {new Date(post.createdAt).toLocaleString()}
      </p>
      {post.imageUrl && <img src={post.imageUrl} alt="post" style={{ maxWidth: '100%' }} />}
      <p>{post.description || '(no description)'}</p>

      <div>
        <button onClick={handleUpvotePost}>Upvote ({post.points})</button>
        <button onClick={handleDownvotePost}>Downvote</button>
        {canModify && (
          <>
            <Link to={`/edit/${post.id}`}><button>Редактировать</button></Link>
            <button onClick={handleDeletePost} style={{ backgroundColor: 'red', color: 'white' }}>Удалить</button>
          </>
        )}
      </div>

      <hr />

      <h3>Comments</h3>
      {post.comments && post.comments.length === 0 ? (
        <p>Комментариев пока нет. Будьте первым!</p>
      ) : (
        post.comments?.map((comment: Comment) => (
          <div key={comment.id} style={{ border: '1px solid #eee', padding: '10px', margin: '10px 0' }}>
            <p>{comment.text}</p>
            <small>
              От <Link to={`/users/${comment.author.id}`}>{comment.author.username}</Link> | 
              Очков: {comment.points} | {new Date(comment.createdAt).toLocaleString()}
            </small>
            <div>
              <button onClick={() => handleUpvoteComment(comment.id)}>⬆️</button>
              <button onClick={() => handleDownvoteComment(comment.id)}>⬇️</button>
              {(user?.id === comment.authorId || user?.isAdmin) && (
                <button onClick={() => handleDeleteComment(comment.id)}>Удалить</button>
              )}
            </div>
          </div>
        ))
      )}

      {user && (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            rows={3}
            placeholder="Напишите комментарий"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button type="submit" disabled={submitting}>Опубликовать</button>
        </form>
      )}
    </div>
  );
};
import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPostById, updatePost } from '../api/posts';

export const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await getPostById(Number(id));
        const post = res.data;
        // Authorization check
        if (user?.id !== post.authorId && !user?.isAdmin) {
          navigate('/');
          return;
        }
        setTitle(post.title);
        setDescription(post.description || '');
        setImageUrl(post.imageUrl || '');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updatePost(Number(id), { title, description, imageUrl: imageUrl || undefined });
      navigate(`/posts/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update post');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Image URL</label>
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate(`/posts/${id}`)}>Cancel</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

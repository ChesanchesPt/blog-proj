import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPosts } from '../api/posts';
import { type Post } from '../types';

export const PostsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Blog Posts</h1>
      <Link to="/create">
        <button>Create New Post</button>
      </Link>
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to create one!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h2>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <p>{post.description?.substring(0, 100)}...</p>
            <p>
              By {post.author.username} | Points: {post.points} | {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPosts } from '../api/posts';
import { type Post } from '../types';
import { PostsList } from '../components/PostsList';

export const Home = () => {
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

  return (
    <PostsList posts={posts} loading={loading} error={error}/>
  );
};
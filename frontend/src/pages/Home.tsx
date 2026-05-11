import { useEffect, useState } from 'react';
import { getPosts } from '../api/posts';
import { type Post } from '../types';
import { PostsList } from '../components/PostsList';
import { Navbar } from '../components/NavBar';
import { RecentNav } from '../components/RecentNav';

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Не получилось загрузить посты');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 min-w-0">
          <PostsList posts={posts} loading={loading} error={error} />
        </div>
        <RecentNav />
      </div>
    </>
  );
};
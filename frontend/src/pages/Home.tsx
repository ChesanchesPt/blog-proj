import { useEffect } from 'react';
import { getPosts } from '../api/posts';
import { PostsList } from '../components/PostsList';
import { Navbar } from '../components/NavBar';
import { RecentNav } from '../components/RecentNav';
import { useApiCall } from '../hooks/useApiCall';

export const Home = () => {
  const { data: posts, loading, error, execute } = useApiCall(getPosts, [])

  useEffect(() => {
    execute()
  }, [execute])

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 min-w-0">
          <PostsList posts={posts || []} loading={loading} error={error} />
        </div>
        <RecentNav />
      </div>
    </>
  );
};
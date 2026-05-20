import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserById } from '../api/users';
import { getPosts } from '../api/posts';
import { type User, type Post } from '../types';
import { Navbar } from '../components/NavBar';
import { PostCard } from '../components/PostCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const isOwnProfile = currentUser && user && currentUser.id === user.id;

  useEffect(() => {
    const loadUserAndPosts = async () => {
      try {
        if (!userId) return;
        const userRes = await getUserById(parseInt(userId));
        setUser(userRes.data);
        const postsRes = await getPosts(parseInt(userId));
        setPosts(postsRes.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    loadUserAndPosts();
  }, [userId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <><Navbar /><LoadingSpinner /></>;
  if (error) return <><Navbar /><div className="max-w-4xl mx-auto px-4 py-6"><ErrorMessage message={error} /></div></>;
  if (!user) return <><Navbar /><div className="max-w-4xl mx-auto px-4 py-6"><ErrorMessage message="Пользователь не найден" /></div></>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="border-3 border-black shadow-[3px_3px_0px_#1A1A1A] bg-white p-6 mb-8">
          <h1 className="text-4xl font-black text-black mb-2">{user.username}</h1>
          <p className="text-sm text-gray-600 mb-4">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="border-3 border-black bg-red-100 px-4 py-2 font-bold hover:shadow-[3px_3px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Выйти
            </button>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-black text-black mb-4">Посты от {user.username}</h2>
          {posts.length === 0 ? (
            <div className="text-center text-xl font-bold text-gray-500">
              Постов еще нет
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link to="/" className="text-neo-accent font-bold underline hover:no-underline">
            ← На главную
          </Link>
        </div>
      </div>
    </>
  );
};
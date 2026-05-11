import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserById } from '../api/users';
import { getPosts } from '../api/posts';
import { type User, type Post } from '../types';

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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!user) return <div>Пользователь не найден</div>;

  return (
    <div>
      <h1>{user.username}</h1>
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
      {isOwnProfile && (
        <button onClick={handleLogout}>Logout</button>
      )}

      <h2>Посты от {user.username}</h2>
      {posts.length === 0 ? (
        <p>Постов еще нет</p>
      ) : (
        posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
            <Link to={`/posts/${post.id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>{post.description?.substring(0, 150)}...</p>
            <small>Очков: {post.points} | {new Date(post.createdAt).toLocaleDateString()}</small>
          </div>
        ))
      )}
      <Link to="/">На главную</Link>
    </div>
  );
};
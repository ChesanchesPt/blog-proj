import { Link } from 'react-router-dom';
import { useRecentPosts } from '../contexts/RecentPostsContext';

export const RecentNav = () => {
  const { recentPosts } = useRecentPosts();

  return (
    <aside className="w-80 lg:block sticky top-20 self-start">
      <div className="border-3 border-black shadow-[4px_4px_0px_#1A1A1A] bg-white p-4 font-mono">
        <h2 className="text-xl font-black mb-3 border-b-3 border-black pb-2">
          Недавние посты
        </h2>
        {recentPosts.length === 0 ? (
          <p className="text-sm text-gray-500">
            Пока нет просмотренных постов
          </p>
        ) : (
          <ul className="space-y-2">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/posts/${post.id}`}
                  className="block text-sm font-medium 
                  hover:underline hover:bg-accent px-1 -mx-1 transition-colors"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};
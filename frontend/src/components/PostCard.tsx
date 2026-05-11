import { Link } from 'react-router-dom';
import { formatRelativeDate } from '../utils/dates';
import { type Post } from '../types';
import { useRecentPosts } from '../contexts/RecentPostsContext';
import { ButtonSmall } from './ButtonSmall';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { addRecentPost } = useRecentPosts();

  return (
    <article
      className="max-w-185 border-3 border-neo-black bg-white p-4 transition-shadow 
      hover:shadow-[2px_2px_0px_#1A1A1A] hover:-translate-y-0.5"
    >
      <div className="flex flex-wrap gap-x-4 mb-2.5 items-center text-[14px] font-medium text-black">
        <span>
          Автор:{' '}
          <Link to={`/users/${post.author.id}`} className="font-bold underline hover:bg-neo-yellow">
            {post.author.username}
          </Link>
        </span>
        <span>{formatRelativeDate(post.createdAt)}</span>
      </div>

      <h2 className="text-x mb-2.5 font-bold">
        <Link 
          to={`/posts/${post.id}`} 
          onClick={() => addRecentPost(post)}
          className="hover:underline hover:decoration-accent hover:decoration-4">
          {post.title}
        </Link>
      </h2>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={`Изображение для ${post.title}`}
          className="max-w-175 w-full max-h-135 object-contain border-2 border-neo-black mb-4"
        />
      )}

      <p className="text-sm text-black line-clamp-5">
        {post.description}
      </p>

      <div className="mt-3 flex justify-between items-center text-xs font-medium text-gray-600">
          <ButtonSmall variant='accent'>
            <img src="/icons/plus.svg" alt="Плюс" className="w-3.5" />
          </ButtonSmall>
          {post.points}
          <ButtonSmall variant='accent'>
            <img src="/icons/minus.svg" alt="Минус" className="w-3.5" />
          </ButtonSmall>
      </div>
    </article>
  );
};
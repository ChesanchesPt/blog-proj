import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Post } from '../types';

interface RecentPostsContextType {
  recentPosts: Post[];
  addRecentPost: (post: Post) => void;
}

const RecentPostsContext = createContext<RecentPostsContextType>({
  recentPosts: [],
  addRecentPost: () => {},
});

export const RecentPostsProvider = ({ children }: { children: ReactNode }) => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  const addRecentPost = (post: Post) => {
    setRecentPosts((prev) => {
      const filtered = prev.filter((p) => p.id !== post.id);
      return [post, ...filtered].slice(0, 5);
    });
  };

  return (
    <RecentPostsContext.Provider value={{ recentPosts, addRecentPost }}>
      {children}
    </RecentPostsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRecentPosts = () => useContext(RecentPostsContext);
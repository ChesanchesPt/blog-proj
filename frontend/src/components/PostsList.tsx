import { type Post } from "../types";
import { PostCard } from "./PostCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";

interface PostsListProps {
    posts?: Post[];
    loading: boolean;
    error?: string | null;
}

export const PostsList = ({ posts, loading, error }: PostsListProps ) => {
    return (
        <div className="">
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}

            {!loading && !error && (
                posts && posts.length === 0? (
                    <h1 className="text-center text-xl font-bold">Здесь пока ничего нет</h1>
                ) : (
                    <div className="flex flex-col gap-6">
                        {posts?.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )
            )}
        </div>
    )
}
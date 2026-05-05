import { type Post } from "../types";
import { PostCard } from "./PostCard";
import { LoadingSpinner, ErrorMessage } from "../utils/loadingError";

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
                    <h2></h2>
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
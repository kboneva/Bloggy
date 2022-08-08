import { Post } from "./Post";

export const PostsList = ({posts}) => {

    return (
        <div>
            {posts.length > 0
                ? <div >
                    {posts.sort((a, b) => b.createdAt - a.createdAt).map(post =>
                        <Post key={post._id} post={post} />
                    )}
                </div>
                : ""
            }
        </div>
    );
}
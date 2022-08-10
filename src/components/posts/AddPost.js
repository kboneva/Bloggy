import { useContext } from "react";
import { PostContext } from "../../contexts/PostContext";

export const AddPost = () => {
    const { addPostHandler, addPostToggle } = useContext(PostContext);

    return (
        <form id="post" onSubmit={addPostHandler}>
            <div className="border-box">
                <div className="text">
                    <input type="text" id="text" name="text" placeholder="What's on your mind?" />
                </div>

                <div>
                    <input type="submit" className="post-btn big-btn primary-color-blue" value="Post" />
                    <button type="button" onClick={() => addPostToggle()} className="post-btn big-btn">Cancel</button>
                </div>

            </div>
        </form>
    );
}
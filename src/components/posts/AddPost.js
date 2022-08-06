import { addNewPost } from "../../services/postService";
import { useNavigate } from "react-router-dom";

export const AddPost = () => {
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const { text } = Object.fromEntries(new FormData(e.target));

        addNewPost(text)
            .then(() => {
                navigate('/');
            })
            .catch(() => {
                navigate('/404');
            })

    }

    return (
        <form id="post" onSubmit={onSubmit}>
            <div className="container">
                <div className="text">
                    <input type="text" id="text" name="text" placeholder="What's on your mind?" />
                </div>

                <div>
                    <input type="submit" className="btn add-post" value="Post" />
                </div>
            </div>
        </form>
    );
}
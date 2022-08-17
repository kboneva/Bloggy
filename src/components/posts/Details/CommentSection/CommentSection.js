import { useEffect, useState } from "react";
import { Comment } from "./Comment/Comment";
import { addNewComment, deleteComment } from "../../../../services/commentService";
import styles from './CommentSection.module.css';

export const CommentSection = ({ postId, commentsFromPost }) => {
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState('');
    const [errors, setErrors] = useState({
        empty: false,
        tooLong: false,
        somethingWentWrong: false
    })
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        if (!!commentsFromPost) {
            setComments(Object.entries(commentsFromPost).map(([id, comment]) => {
                return {
                    _id: id,
                    ...comment
                }}).sort((a, b) => b.createdAt - a.createdAt))
        }
    }, [])


    const addCommentHandler = (e) => {
        e.preventDefault();

        const { text } = Object.fromEntries(new FormData(e.target));

        addNewComment(postId, text)
            .then(newComment => {
                setComments(state => ([
                    newComment,
                    ...state
                ]));
                setInput('');
            })
            .catch((e) => {
                console.log(e.code);
                setErrors(state => ({
                    ...state,
                    somethingWentWrong: true
                }))
            })
    }

    const deleteCommentHandler = (commentId) => {
        deleteComment(postId, commentId)
            .then(() => {
                setComments(state => state.filter(x => x._id !== commentId))
            })
    }


    const onChange = (e) => {
        setInput(e.target.value);
        setErrors(false, false, false)
        setFormValid((e.target.value.length > 0) && (e.target.value.length <= 200));
    }


    const validator = (e) => {
        setErrors(() => ({
            empty: e.target.value.length === 0,
            tooLong: e.target.value.length > 200
        }))
    }


    return (
        <div>
            <h1 className={styles.title}>Comments <small>- {comments.length}</small></h1>
            <form onSubmit={addCommentHandler}>
                <div className={`border ${styles.margin}`}>
                    <textarea id="text" className={styles.text}
                        value={input}
                        name="text" rows={3} placeholder="What's on your mind?"
                        onBlur={validator}
                        onChange={onChange} ></textarea>
                    {errors.empty && <p className={styles.error}>Post can't be empty!</p>}
                    {errors.tooLong && <p className={styles.error}>Post should be under 200 characters long!</p>}
                    {errors.somethingWentWrong && <p className={styles.error}>Something went wrong.</p>}

                    <div className={styles.buttons}>
                        <input type="submit" disabled={!formValid} className={`${styles.post} primary-color-blue`} value="Comment" />
                    </div>

                </div>
            </form>
            {!!comments && comments.map(comment =>
                <Comment key={comment._id} comment={comment} deleteCommentHandler={deleteCommentHandler} />)}
        </div>
    );
}
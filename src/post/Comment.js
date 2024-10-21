import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';
import Picker from 'emoji-picker-react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { timeDifference } from './timeDifference';
import Loading from '../loading/Loading';

import { isAuthenticated } from '../auth';
import { comment, uncomment } from './apiPost';
import '../css/Comment.css';

class Comment extends Component {
    constructor() {
        super();
        this.state = {
            text: "",
            error: "",
            chosenEmoji: null,
            showPicker: false,
            loading: false
        };
    }

    // handleChange
    handleChange = e => {
        this.setState({ text: e.target.value, error: "" });
    };

    // isValid
    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0) {
            this.setState({
                error: "Comment cannot be empty"
            });
            return false;
        }
        if (text.length > 1000) {
            this.setState({
                error: "Comment cannot be more than 1000 characters long"
            });
            return false;
        }
        return true;
    };

    // addComment
    addComment = e => {
        e.preventDefault();
        if (!isAuthenticated()) {
            this.setState({
                error: "Please Signin first to leave a comment"
            });
            return false;
        }
        if (this.isValid()) {
            this.setState({ loading: true });
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;
            const commentText = { text: this.state.text };

            comment(userId, token, postId, commentText)
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.setState({
                            text: "",
                            showPicker: false,
                            loading: false
                        });
                        // Send the updated/fresh list of comments to the parent component
                        this.props.updateComments(data.comments);
                    }
                });
        }
    };

    // deleteComment
    deleteComment = (comment) => {
        this.setState({ loading: true });
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    console.log(data); // Log the data to verify the response
                    this.setState({ loading: false });
                    // Send the updated/fresh list of comments to the parent component
                    this.props.updateComments(data.comments);
                }
            });
    };

    // deleteConfirmed
    deleteConfirmed = (comment) => {
        confirmAlert({
            customUI: ({ onClose }) => (
                <div className="custom-confirm-alert">
                    <div className="custom-confirm-alert-header">
                        <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>Confirm Delete Comment</h1>
                    </div>
                    <div className="custom-confirm-alert-body">
                        <p>Are you sure you want to delete this comment?</p>
                        <div className="custom-confirm-alert-buttons">
                            <button
                                onClick={() => {
                                    this.deleteComment(comment);
                                    onClose();
                                }}
                                className="custom-confirm-alert-button custom-confirm-alert-button-yes"
                                style={{ borderRadius: "20px" }}
                            >
                                Yes
                            </button>
                            <button
                                onClick={onClose}
                                className="custom-confirm-alert-button custom-confirm-alert-button-no"
                                style={{ borderRadius: "20px" }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )
        });
    };

    // onEmojiClick
    onEmojiClick = (event, emojiObject) => {
        let comment = this.state.text;
        comment = comment + emojiObject.emoji;
        this.setState({
            chosenEmoji: emojiObject,
            text: comment
        });
    };

    render() {
        const { text, error, showPicker, loading } = this.state;
        const { comments } = this.props;

        return (
            <div>
                {loading ? (
                    <Loading />
                ) : (
                    <div>
                        {/* COMMENTS, LENGTH COMMENT */}
                        <h6 className="mt-3 mb-1 ml-3 mr-3">
                            Comments <span className="pull-right">{comments.length} comments</span>
                        </h6>
                        <div className="panel-body">
                            <form onSubmit={this.addComment}>
                                <div style={{ position: 'relative', margin: '10px 0' }}>
                                    {/* WRITE COMMENT INPUT */}
                                    <input
                                        type="text"
                                        onChange={this.handleChange}
                                        value={text}
                                        placeholder="Write your thoughts..."
                                        style={{
                                            padding: '10px 50px 10px 15px',
                                            borderRadius: '25px',
                                            border: '1px solid #ddd',
                                            fontSize: '16px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                            outline: 'none',
                                            width: '100%',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#D19616'; /* Highlight color on focus */
                                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#ddd'; /* Reset border color */
                                            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                        }}
                                    />

                                    {/* ADD EMOJI BUTTON */}
                                    <button
                                        type="button"
                                        onClick={() => this.setState({ showPicker: !showPicker })}
                                        style={{
                                            position: 'absolute',
                                            right: '20px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            padding: '8px',
                                            border: 'none',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <i
                                            style={{
                                                color: '#D19616',
                                            }}
                                            className="far fa-smile"
                                        ></i>
                                    </button>
                                </div>

                                {/* ADD COMMENT BUTTON */}
                                <button
                                    style={{ borderRadius: "20px", fontWeight: "bold", width: "100%" }}
                                    type="submit"
                                    className="btn btn-raised btn-sm btn-info pull-right mt-3 mb-4">
                                    Add comment
                                </button>
                            </form>

                            {/* EMOJI PICKER */}
                            {showPicker ? <Picker onEmojiClick={this.onEmojiClick} /> : ""}
                            <div className="alert alert-danger" style={{ display: error ? "" : "none", marginTop: "70px", marginBottom: 0 }}>
                                {error}
                            </div>

                            <br />
                            <div className="clearfix"></div>
                            <hr />
                            <ul className="media-list">
                                {comments.reverse().map((comment, i) => (
                                    <li key={i} className="media">
                                        <Link to={`/user/${comment.postedBy._id}`}>
                                            {/* User avatar */}
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                                onError={i => (i.target.src = DefaultProfile)}
                                                alt={comment.postedBy.name}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    marginRight: '10px',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </Link>

                                        <div className="media-body">
                                            <span className="text-muted pull-right">
                                                {/* Created datetime */}
                                                <small className="text-muted mr-3">
                                                    <i className="far fa-clock"></i>{" " + timeDifference(new Date(), new Date(comment.created))}
                                                </small>

                                                <br />

                                                <span>
                                                    {isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id && (
                                                        <>
                                                            <span onClick={() => this.deleteConfirmed(comment)} className="text-danger float-right mr-2 mt-2 mr-3" style={{ cursor: "pointer" }}>
                                                                <i className="fas fa-trash"></i>
                                                            </span>
                                                        </>
                                                    )}
                                                </span>
                                            </span>

                                            {/* USER NAME */}
                                            <Link to={`/user/${comment.postedBy._id}`}
                                                style={{
                                                    color: '#262626',
                                                    textDecoration: 'none',
                                                }}>
                                                <h5 style={{ alignItems: "center" }}>
                                                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>{comment.postedBy.name}</span>
                                                    <i
                                                        style={{
                                                            marginLeft: "5px",
                                                            fontSize: "10px",
                                                            color: "#3897f0",
                                                            verticalAlign: "top"
                                                        }}
                                                        className="fa fa-check-circle"
                                                        aria-hidden="true">
                                                    </i>
                                                </h5>
                                            </Link>

                                            {/* COMMENT TEXT */}
                                            <p>
                                                {comment.text}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Comment;

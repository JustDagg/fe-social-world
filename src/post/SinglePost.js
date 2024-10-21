import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Loading from '../loading/Loading';
import Comment from './Comment';
import DefaultProfile from '../images/avatar.jpg';
import { timeDifference } from './timeDifference';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Divider } from '@material-ui/core';
import Footer from '../component/Footer';

import { isAuthenticated } from "../auth";
import { singlePost, remove, like, unlike } from './apiPost';
import '../css/SinglePost.css';

class SinglePost extends Component {
    constructor() {
        super();
        this.state = {
            post: '',
            redirectToHome: false,
            redirectToSignin: false,
            like: false,
            likes: 0,
            comments: [],
            loading: false,
            isPostImageModalOpen: false
        };
    }

    // checkLike
    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1; // true if user found
        return match;
    };

    componentDidMount() {
        const postId = this.props.match.params.postId;
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({
                        post: data,
                        likes: data.likes.length,
                        like: this.checkLike(data.likes),
                        comments: data.comments
                    });
                }
            });
    }

    // updateComments
    updateComments = comments => {
        this.setState({ comments });
    };

    // likeToggle
    likeToggle = () => {
        this.setState({ loading: true });
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true, loading: false });
            return false; // so that the rest of code isn't executed
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;
        callApi(userId, token, postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({
                        like: !this.state.like,
                        likes: data.likes.length,
                        loading: false
                    });
                }
            });
    };

    // deletePost
    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ redirectToHome: true });
                }
            });
    };

    // deleteConfirmed
    deleteConfirmed = (post) => {
        confirmAlert({
            customUI: ({ onClose }) => (
                <div className="custom-confirm-alert">
                    <div className="custom-confirm-alert-header">
                        <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>Confirm Delete Post</h1>
                    </div>
                    <div className="custom-confirm-alert-body">
                        <p>Are you sure you want to delete this post with title <b>{post.title}</b> ?</p>
                        <div className="custom-confirm-alert-buttons">
                            <button
                                onClick={() => {
                                    this.deletePost();
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

    // sharePost
    sharePost = () => {
        const { post } = this.state;
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.body,
                url: `${window.location.origin}/post/${post._id}`
            }).catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback for browsers that do not support the Web Share API
            alert('Sharing is not supported by this browser.');
        }
    };

    // Method to toggle the modal post image 
    toggleModal = () => {
        this.setState((prevState) => ({
            isPostImageModalOpen: !prevState.isPostImageModalOpen,
        }));
    };

    // Method to close modal when clicking outside of the post image
    handleClickOutside = (e) => {
        if (e.target.id === 'modal-background') {
            this.toggleModal();
        }
    };

    // handleCopy
    handleCopy = () => {
        navigator.clipboard.writeText(this.state.post.body) // Sao chép nội dung vào clipboard
            .then(() => {
                this.setState({ tooltipVisible: true });
                setTimeout(() => this.setState({ tooltipVisible: false }), 2000); // Ẩn tooltip sau 2 giây
            })
            .catch(err => console.error('Failed to copy: ', err));
    };

    renderPost = (post) => {
        const posterId = post.postedBy ? post.postedBy._id : "";
        const posterName = post.postedBy ? post.postedBy.name : "Unknown";

        const { like, likes, redirectToSignin, redirectToHome, comments, isPostImageModalOpen, tooltipVisible } = this.state;

        if (redirectToHome) {
            return <Redirect to='/' />;
        } else if (redirectToSignin) {
            return <Redirect to='/signin' />;
        }

        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    borderRadius: '8px',
                    marginBottom: '30px',
                    width: '100%',
                    maxWidth: '600px',
                    backgroundColor: 'white'
                }}>
                    {/* Post Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px'
                    }}>
                        {/* User avatar */}
                        <img
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                            onError={i => (i.target.src = DefaultProfile)}
                            alt={posterName}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                marginRight: '10px',
                                objectFit: 'contain'
                            }}
                        />

                        {/* User name */}
                        <Link to={`/user/${posterId}`} style={{
                            color: '#262626',
                            textDecoration: 'none',
                        }}>
                            <h5 style={{ alignItems: "center" }}>
                                <span style={{ fontWeight: "bold", fontSize: "16px" }}>{posterName}</span>
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

                        {/* Created datetime */}
                        <p style={{ marginLeft: 'auto', color: '#8e8e8e', fontSize: '15px' }}>
                            <i style={{ marginRight: "5px" }} className="far fa-clock"></i>
                            {timeDifference(new Date(), new Date(post.created))}
                        </p>
                    </div>

                    {/* Post Image */}
                    {post.photo && post.photo.data ? (
                        <img
                            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                            alt={post.title}
                            style={{
                                width: '100%',
                                maxHeight: '700px',
                                objectFit: 'cover',
                                backgroundColor: '#fafafa',
                                cursor: 'pointer',
                            }}
                            onClick={this.toggleModal}
                        />
                    ) : (
                        null
                    )}

                    {/* Modal for displaying full image */}
                    {isPostImageModalOpen && (
                        <div
                            id="modal-background"
                            style={{
                                position: 'fixed',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1000,
                            }}
                            onClick={this.handleClickOutside}
                        >
                            {/* Full image */}
                            <img
                                src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                alt={post.title}
                                style={{
                                    maxWidth: '90%',
                                    maxHeight: '90%',
                                    borderRadius: '10px',
                                }}
                            />
                        </div>
                    )}

                    {/* Action */}
                    <div style={{ padding: '10px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {like ? (
                                // LIKE
                                <h3>
                                    <i onClick={this.likeToggle} className="fa fa-heart" style={{ color: "red", padding: "10px", cursor: "pointer" }} aria-hidden="true"></i>
                                </h3>
                            ) : (
                                // UNLIKE
                                <h3>
                                    <i onClick={this.likeToggle} className="fa fa-heart-o" style={{ padding: "10px", cursor: "pointer" }} aria-hidden="true"></i>
                                </h3>
                            )}

                            {/* SHARE POST */}
                            <h3>
                                <i onClick={this.sharePost} className="fa fa-share-alt" style={{ color: "#1DA1F2", padding: "10px", cursor: "pointer" }} aria-hidden="true"></i>
                            </h3>

                            {/* EDIT POST (only visible if the user is the author) */}
                            {isAuthenticated().user && isAuthenticated().user._id === this.state.post.postedBy._id && (
                                <h3>
                                    <Link to={`/post/edit/${this.state.post._id}`} style={{ textDecoration: 'none' }}>
                                        <i className="fa fa-pencil" style={{ color: "#44E076", padding: "10px", cursor: "pointer" }} aria-hidden="true"></i>
                                    </Link>
                                </h3>
                            )}

                            {/* DELETE POST (only visible if the user is the author) */}
                            {isAuthenticated().user && isAuthenticated().user._id === this.state.post.postedBy._id && (
                                <h3>
                                    <i onClick={() => this.deleteConfirmed(post)} className="fa fa-trash" style={{ color: "red", padding: "10px", cursor: "pointer" }} aria-hidden="true"></i>
                                </h3>
                            )}

                        </div>

                        {/* COUNT LIKE */}
                        <span style={{ fontSize: "18px" }} className="ml-1">{likes} likes</span>
                    </div>

                    {/* TITLE */}
                    <h5 style={{ fontWeight: 'bold' }} className="card-title ml-3">{post.title}</h5>

                    {/* DESCRIPTION */}
                    <div style={{
                        position: 'relative',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '10px',
                        backgroundColor: '#f9f9f9'
                    }}>

                        {/* Copy Button */}
                        <button onClick={this.handleCopy} style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: '0'
                        }}>
                            <i className="fa fa-copy" style={{ fontSize: '20px', color: '#3897f0' }} />
                        </button>

                        {/* Tooltip */}
                        {tooltipVisible && (
                            <div style={{
                                position: 'absolute',
                                top: '35px',
                                right: '10px',
                                backgroundColor: '#333',
                                color: '#fff',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                zIndex: 1000,
                                whiteSpace: 'nowrap'
                            }}>
                                Copied!
                            </div>
                        )}

                        {/* body */}
                        <p className="card-text ml-3" style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            marginRight: '10px'
                        }}>
                            {post.body}
                        </p>

                    </div>

                    <Divider style={{ marginTop: "15px" }} />

                    {/* Comment Section */}
                    <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />

                </div>
            </div >
        );
    }

    render() {
        const { post, loading } = this.state;
        return (
            <>
                <div className="container" style={{ maxWidth: "100%", minHeight: '100vh' }}>
                    {/* RETURN TO HOME PAGE BUTTON */}
                    <button
                        style={{
                            width: "300px",
                            marginTop: "20px",
                            borderRadius: "20px",
                            height: "3rem",
                            backgroundColor: "#e0e0e0",
                            border: "1px solid #ccc",
                            color: "#333",
                            fontSize: "16px"
                        }}
                        onClick={() => this.props.history.push('/')}
                        className="btn btn-raised btn-secondary"
                    >
                        <i className="fas fa-arrow-left" style={{ marginRight: "15px" }}></i>
                        <span style={{ fontWeight: "bold" }}>Return to Home Page</span>
                    </button>

                    {(!post || loading) ? (
                        <Loading />
                    ) : (
                        this.renderPost(post)
                    )}
                </div>

                {/* Footer Field */}
                <Footer />
            </>
        );
    }
}

export default SinglePost;

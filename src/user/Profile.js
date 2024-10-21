import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import Loading from '../loading/Loading';
import Sidebar from '../component/Sidebar';

import { isAuthenticated } from "../auth";
import { listByUser } from '../post/apiPost';
import { createNote, deleteNote, getNotesByUser, read } from "./apiUser";
import '../css/Profile.css';
import Footer from '../component/Footer';
import NoteModal from './NoteModal';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: "",
            posts: [],
            loading: false,
            isAvatarModalOpen: false,
            isNoteModalOpen: false,
            note: "",
            existingNote: null
        }
    }

    // check follow
    checkFollow = (user) => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id
        })
        return match
    }

    // clickFollowButton
    clickFollowButton = callApi => {
        this.setState({ loading: true })
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id)
            .then(data => {
                if (data.error) {

                    this.setState({ error: data.error })
                } else {
                    this.setState({ user: data, following: !this.state.following, loading: false })
                }
            })
    }

    init = (userId) => {
        this.setState({ loading: true })
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true });
                } else {
                    let following = this.checkFollow(data);
                    this.setState({ user: data, following });
                    this.loadPosts(data._id);
                }
            });
    };

    // loadPosts
    loadPosts = (userId) => {
        const token = isAuthenticated().token;
        listByUser(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ posts: data, loading: false });
                }
            })
    }

    // fetchNotesForUser
    fetchNotesForUser = (userId) => {
        const token = isAuthenticated().token;

        getNotesByUser(userId, token)
            .then(data => {
                console.log("Note", data)
                if (data.error) {
                    console.log(data.error);
                } else {
                    if (data.length > 0) {
                        this.setState({ existingNote: data[0] }); // Lưu note đầu tiên vào state
                    } else {
                        this.setState({ existingNote: null }); // Không có ghi chú thì đặt thành null
                    }
                }
            });
    };

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
        this.fetchNotesForUser(userId); // Fetch the user's note on load
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
        this.fetchNotesForUser(userId); // Cập nhật khi nhận props mới
    }

    // Method to toggle the avatar image modal
    toggleAvatarModal = () => {
        this.setState((prevState) => ({
            isAvatarModalOpen: !prevState.isAvatarModalOpen,
        }));
    };

    // Method to close modal when clicking outside the avatar image
    handleAvatarClickOutside = (e) => {
        if (e.target.id === 'avatar-modal-background') {
            this.toggleAvatarModal();
        }
    };

    // Toggle note modal
    toggleNoteModal = () => {
        this.setState((prevState) => ({
            isNoteModalOpen: !prevState.isNoteModalOpen,
        }));
    };

    // Handle note change
    handleNoteChange = (event) => {
        this.setState({ note: event.target.value });
    };

    // saveNote
    saveNote = () => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        createNote(userId, token, this.state.note).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ existingNote: data, note: "" });
                this.toggleNoteModal();
                this.fetchNotesForUser();
            }
        });
    };

    // deleteNote
    deleteNote = () => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        // Sửa lại cách gọi hàm deleteNote, truyền vào cả noteId và userId
        deleteNote(this.state.existingNote._id, userId, token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ existingNote: null, note: "" });
                this.toggleNoteModal();
                this.fetchNotesForUser();
            }
        });
    };

    renderProfile = () => {
        const { user, following, posts, isAvatarModalOpen, isNoteModalOpen, existingNote, note } = this.state;
        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;

        // Kiểm tra người dùng hiện tại có phải là người đăng nhập không
        const isLoggedInUser = isAuthenticated() && isAuthenticated().user._id === user._id;

        // noteDisplay
        const noteDisplay = existingNote ? (
            <span style={{
                display: 'inline-block',
                maxWidth: '80%',
                textAlign: 'center',
                position: 'absolute',
                top: '1%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#363636',
                color: 'grey',
                borderRadius: '15px',
                padding: '8px 10px',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                cursor: isLoggedInUser ? 'pointer' : 'default',
                zIndex: 10,
                border: '1px solid #ccc',
            }} onClick={isLoggedInUser ? this.toggleNoteModal : null}>
                {existingNote.content}
            </span>
        ) : (
            // Chỉ hiển thị khi người dùng đã đăng nhập
            isLoggedInUser && (
                <span style={{
                    display: 'inline-block',
                    maxWidth: '80%',
                    textAlign: 'center',
                    position: 'absolute',
                    top: '1%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#363636',
                    color: 'grey',
                    borderRadius: '15px',
                    padding: '8px 10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    zIndex: 10,
                    border: '1px solid #ccc',
                }} onClick={this.toggleNoteModal}>
                    Ghi chú...
                </span>
            )
        );

        // followingBadge
        let followingBadge = (
            <p style={{ marginBottom: "0", cursor: "pointer", display: 'flex', alignItems: 'center' }}>
                <span
                    style={{
                        marginRight: "10px",
                        background: 'black',
                        color: '#fff',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Shadow for depth
                        transition: 'transform 0.3s ease', // Smooth transition for hover effect
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} // Hover effect
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {user.following.length}
                </span>
                <span style={{ fontSize: '16px', color: '#333', fontWeight: 'bold' }}>Following</span>
            </p>
        );

        // followersBadge
        let followersBadge = (
            <p style={{ marginBottom: "0", cursor: "pointer", display: 'flex', alignItems: 'center' }}>
                <span
                    style={{
                        marginRight: "10px",
                        background: 'black',
                        color: '#fff',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Shadow for depth
                        transition: 'transform 0.3s ease', // Smooth transition for hover effect
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} // Hover effect
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {user.followers.length}
                </span>
                <span style={{ fontSize: '16px', color: '#333', fontWeight: 'bold' }}>Followers</span>
            </p>
        );

        // postsBadge
        let postsBadge = (
            <p style={{ marginBottom: "0", cursor: "pointer", display: 'flex', alignItems: 'center' }}>
                <span
                    style={{
                        marginRight: "10px",
                        background: 'black',
                        color: '#fff',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Shadow for depth
                        transition: 'transform 0.3s ease', // Smooth transition for hover effect
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} // Hover effect
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {posts.length}
                </span>
                <span style={{ fontSize: '16px', color: '#333', fontWeight: 'bold' }}>Posts</span>
            </p>
        );

        return <div className="user-profile">
            <div className="row">
                <div className="col-md-10">
                    <div className="profile-info-left">

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                            {/* Left Side: Avatar and User Info */}
                            <div style={{ flex: '1', display: 'flex', alignItems: 'center', position: 'relative' }}>

                                {/* Container for Avatar and Note */}
                                <div style={{ position: 'relative' }}>
                                    {/* Avatar Image */}
                                    <img
                                        style={{
                                            borderRadius: "50%",
                                            objectFit: "contain",
                                            width: "200px",
                                            height: "200px",
                                            display: "block",
                                            marginRight: "20px",
                                            cursor: "pointer",
                                        }}
                                        src={photoUrl}
                                        alt={user.name}
                                        onError={(i) => (i.target.src = DefaultProfile)}
                                        className="avatar img-circle"
                                        onClick={this.toggleAvatarModal} // Open avatar modal on avatar click
                                    />
                                    {/* Modal to display full avatar image */}
                                    {isAvatarModalOpen && (
                                        <div
                                            id="avatar-modal-background"
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
                                            onClick={this.toggleAvatarModal}
                                        >
                                            <img
                                                src={photoUrl}
                                                alt={user.name}
                                                style={{
                                                    borderRadius: "5%",
                                                    maxWidth: '90%',
                                                    maxHeight: '90%',
                                                    objectFit: 'contain',
                                                }}
                                                onError={(i) => (i.target.src = DefaultProfile)}
                                            />
                                        </div>
                                    )}

                                    {/* noteDisplay */}
                                    {noteDisplay}
                                    {/* NoteModal */}
                                    <NoteModal
                                        user={user}
                                        isOpen={isNoteModalOpen}
                                        onClose={this.toggleNoteModal}
                                        existingNote={existingNote}
                                        onDelete={this.deleteNote}
                                        onSave={this.saveNote}
                                        note={note}
                                        handleNoteChange={this.handleNoteChange}
                                    />
                                </div>

                                <div style={{ textAlign: 'left' }}>
                                    {/* User Name */}
                                    <h2 style={{ margin: 0 }}>
                                        <span style={{ fontWeight: "bold", fontSize: "30px" }}>{user.name}</span>
                                        <i
                                            style={{
                                                marginLeft: "5px",
                                                fontSize: "15px",
                                                color: "#3897f0",
                                                verticalAlign: "top"
                                            }}
                                            className="fa fa-check-circle"
                                            aria-hidden="true"
                                        />
                                    </h2>

                                    {/* User Email */}
                                    <p style={{ fontSize: "15px", marginTop: "10px" }}>{user.email}</p>

                                    {/* User Information */}
                                    <div style={{ justifyContent: "center", alignItems: "center" }}>
                                        {/* User Birth Year */}
                                        {user.birthYear && (
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <i
                                                    style={{ fontSize: "20px" }}
                                                    className="fa fa-birthday-cake"
                                                    aria-hidden="true"
                                                ></i>
                                                <span style={{ marginLeft: "8px", fontSize: "20px" }}>{user.birthYear}</span>
                                            </div>
                                        )}


                                        {/* University */}
                                        {user.university && (
                                            <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
                                                <i
                                                    style={{ fontSize: "20px" }}
                                                    className="fa fa-graduation-cap"
                                                    aria-hidden="true"
                                                ></i>
                                                <span style={{ marginLeft: "8px", fontSize: "20px" }}>{user.university}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Statistics */}
                            <div style={{ flex: '1', textAlign: 'left' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#333' }}>Statistics</h3>

                                {/* Following */}
                                <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <span
                                        style={{
                                            marginRight: "10px",
                                            fontSize: "18px",
                                            padding: "8px 16px",
                                            borderRadius: "20px",
                                            background: 'linear-gradient(135deg, #007bff, #00d2ff)',
                                            color: '#fff',
                                            fontWeight: '500',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease',
                                            display: 'inline-block'
                                        }}
                                        className="badge badge-pill badge-primary"
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        {user.following.length}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "18px",
                                            color: '#333',
                                            fontWeight: '400'
                                        }}
                                    >
                                        Following
                                    </span>
                                </p>

                                {/* Followers */}
                                <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <span
                                        style={{
                                            marginRight: "10px",
                                            fontSize: "18px",
                                            padding: "8px 16px",
                                            borderRadius: "20px",
                                            background: 'linear-gradient(135deg, #28a745, #56ab2f)',
                                            color: '#fff',
                                            fontWeight: '500',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease',
                                            display: 'inline-block'
                                        }}
                                        className="badge badge-pill badge-success"
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        {user.followers.length}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "18px",
                                            color: '#333',
                                            fontWeight: '400'
                                        }}
                                    >
                                        Followers
                                    </span>
                                </p>

                                {/* Posts */}
                                <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <span
                                        style={{
                                            marginRight: "10px",
                                            fontSize: "18px",
                                            padding: "8px 16px",
                                            borderRadius: "20px",
                                            background: 'linear-gradient(135deg, #ffc107, #ff6f00)',
                                            color: '#fff',
                                            fontWeight: '500',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease',
                                            display: 'inline-block'
                                        }}
                                        className="badge badge-pill badge-warning"
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        {posts.length}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "18px",
                                            color: '#333',
                                            fontWeight: '400'
                                        }}
                                    >
                                        Posts
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="button-container">
                            {isAuthenticated().user && isAuthenticated().user._id === user._id ? (
                                <>
                                    {/* CREATE POST BUTTON */}
                                    <Link
                                        className="btn btn-sm btn-raised btn-dark"
                                        to={`/post/create`}
                                        style={{
                                            backgroundColor: "#343a40",
                                            borderRadius: "25px",
                                            padding: "8px 16px",
                                            fontSize: "14px",
                                            textDecoration: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            transition: "background-color 0.3s ease, transform 0.3s ease",
                                        }}
                                    >
                                        <i style={{ marginRight: "5px" }} class="fa fa-plus-square" aria-hidden="true"></i> Create Post
                                    </Link>

                                    {/* EDIT PROFILE BUTTON */}
                                    <Link
                                        className="btn btn-sm btn-raised btn-dark"
                                        to={`/user/edit/${user._id}`}
                                        style={{
                                            backgroundColor: "#343a40",
                                            borderRadius: "25px",
                                            padding: "8px 16px",
                                            fontSize: "14px",
                                            textDecoration: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            transition: "background-color 0.3s ease, transform 0.3s ease",
                                        }}
                                    >
                                        <i style={{ marginRight: "5px" }} class="fa fa-pencil-square" aria-hidden="true"></i> Edit Profile
                                    </Link>

                                    {/* DELETE USER PROFILE */}
                                    <DeleteUser userId={user._id} username={user.name} />
                                </>
                            ) : (
                                <div className="row">
                                    {/* MESSAGE BUTTON */}
                                    <div>
                                        <Link
                                            className="btn btn-sm btn-raised btn-dark"
                                            style={{ borderRadius: "20px", padding: "10px 50px" }}
                                            to={`/chat/${isAuthenticated().user._id}/${user._id}`}
                                        >
                                            <i style={{ marginRight: "5px" }} class="fa fa-commenting" aria-hidden="true"></i> Message
                                        </Link>
                                    </div>

                                    {/* FOLLOW USER BUTTON */}
                                    <div className="col-md-5 col-xs-6">
                                        <FollowProfileButton following={following} onButtonClick={this.clickFollowButton} />
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Bio */}
                        <div className="section">
                            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>Bio</h3>
                            <p style={{ fontSize: "18px", }}>{user.about}</p>
                        </div>

                    </div>
                </div>
                <div className="col-md-11">
                    <div className="profile-info-right">
                        <Tabs onSelect={(index, label) => console.log(label + ' selected')}>

                            {/* POSTS TAB */}
                            <Tab label={postsBadge} className="tab-title-name">
                                <div className="row">
                                    {posts.map((post, i) => (
                                        <div key={i} style={{ paddingBottom: "15px" }} className="col-md-4">
                                            {post.photo && post.photo.data ? (
                                                // Nếu post có ảnh, hiển thị ảnh và biểu tượng trái tim với số lượt thích
                                                <Link to={`/post/${post._id}`} >
                                                    <figure className="snip1205 red">
                                                        <img
                                                            style={{ objectFit: "cover", padding: "0" }}
                                                            height="200"
                                                            width="200"
                                                            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                                            alt={post.title}
                                                        />
                                                        <i className="fas fa-heart" style={{ position: "absolute", bottom: "10px", right: "10px" }}>
                                                            <br />
                                                            <span style={{ color: "white", fontSize: "18px" }}>{post.likes.length}</span>
                                                        </i>
                                                    </figure>
                                                </Link>
                                            ) : (
                                                // Nếu không có ảnh, hiển thị tiêu đề bài viết và biểu tượng trái tim với số lượt thích
                                                <Link style={{ textDecoration: "none" }} to={`/post/${post._id}`} >
                                                    <div>
                                                        <figure className="snip1205 red" style={{
                                                            display: 'flex',
                                                            height: '200px',
                                                            width: '200px',
                                                            position: 'relative'
                                                        }}>
                                                            <h4 style={{
                                                                marginTop: '10px',
                                                                fontSize: '16px',
                                                                color: 'whitesmoke',
                                                                padding: "5px"
                                                            }}>
                                                                {post.title}
                                                            </h4>
                                                            <i className="fas fa-heart" style={{
                                                                position: 'absolute',
                                                                bottom: '10px',
                                                                right: '10px'
                                                            }}>
                                                                <br />
                                                                <span style={{ color: 'white', fontSize: '18px' }}>{post.likes.length}</span>
                                                            </i>
                                                        </figure>
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Tab>

                            {/* FOLLOWERS TAB */}
                            <Tab label={followersBadge} className="tab-title-name">
                                {user.followers.map((person, i) => (
                                    <div
                                        key={i}
                                        className="media user-follower"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '15px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            backgroundColor: '#f8f9fa',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}

                                    >
                                        {/* IMAGE */}
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            alt={person.name}
                                            className="media-object pull-left mr-2"
                                            style={{
                                                borderRadius: '50%',
                                                objectFit: 'contain',
                                                width: '80px',
                                                height: '80px',
                                            }}
                                        />
                                        {/* LINK TO AND USER NAME */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                marginLeft: '15px',
                                            }}
                                            className="media-body">
                                            <Link to={`/user/${person._id}`}
                                                style={{
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    color: '#333',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.3s ease',
                                                }}
                                            >
                                                @{person.name}
                                            </Link>
                                            {/* <button type="button" className="btn btn-sm btn-toggle-following pull-right"><i className="fa fa-checkmark-round"></i> <span>Following</span></button> */}
                                        </div>
                                    </div>
                                ))}
                            </Tab>

                            {/* FOLLOWING TAB */}
                            <Tab label={followingBadge} className="tab-title-name">
                                {user.following.map((person, i) => (
                                    <div
                                        key={i}
                                        className="media user-following"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '15px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            backgroundColor: '#f8f9fa', // Light background color
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                            position: 'relative', // For button positioning
                                        }}
                                    >
                                        {/* IMAGE */}
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            alt={person.name}
                                            className="media-object pull-left mr-2"
                                            style={{
                                                borderRadius: '50%',
                                                objectFit: 'contain',
                                                width: '80px',
                                                height: '80px',
                                            }}
                                        />
                                        {/* LINK TO AND USER NAME */}
                                        <div
                                            className="media-body"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                marginLeft: '15px',
                                                flexGrow: 1,
                                            }}
                                        >
                                            <Link to={`/user/${person._id}`}
                                                style={{
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    color: '#333', // Dark color for text
                                                    textDecoration: 'none',
                                                    transition: 'color 0.3s ease',
                                                }}
                                            >
                                                @{person.name}
                                            </Link>
                                            {/* <button data-index = {person._id} onClick={this.unfollowClick} type="button" className="btn btn-sm btn-toggle-following pull-right"><i className="fa fa-checkmark-round"></i> <span>Unfollow</span></button> */}
                                        </div>
                                    </div>
                                ))}
                            </Tab>

                        </Tabs>
                    </div>
                </div>
            </div>
        </div >
    }


    render() {
        const { redirectToSignin, user, loading } = this.state;
        console.log("state user", user);
        if (redirectToSignin) {
            return <Redirect to='/signin' />
        }


        return (
            <>
                <div
                    className="container"
                    style={{
                        maxWidth: "100%",
                        display: "flex",
                        margin: 0,
                        padding: 0,
                        overflowX: "hidden",
                        minHeight: '100vh'
                    }}
                >
                    {/* Sidebar */}
                    <div style={{ width: '200px', backgroundColor: '#fafafa', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
                        <Sidebar />
                    </div>
                    {loading ? (
                        <Loading />
                    ) : (
                        this.renderProfile()
                    )}
                </div>

                {/* Footer Field */}
                <Footer />
            </>
        );
    }
}

export default Profile;
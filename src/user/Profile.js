import React, { Component } from 'react';
import {
    Box,
    Paper
} from '@material-ui/core';
import { Redirect, Link } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import * as XLSX from 'xlsx';
import DefaultProfile from '../images/avatar.jpg';
import DeleteUserButton from './DeleteUserButton';
import { SettingButton } from './SettingButton';
import { ProfileShowButton } from './ProfileShowButton';
import FollowProfileButton from './FollowProfileButton';
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
            existingNote: null,
            buttonVisibility: {
                showCreatePostButton: true,
                showEditProfileButton: true,
                showDeleteProfileButton: true,
                showUserDetailsButton: true,
            }
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
                        this.setState({ existingNote: data[0] });
                    } else {
                        this.setState({ existingNote: null });
                    }
                }
            });
    };

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
        this.fetchNotesForUser(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
        this.fetchNotesForUser(userId);
    }

    toggleAvatarModal = () => {
        this.setState((prevState) => ({
            isAvatarModalOpen: !prevState.isAvatarModalOpen,
        }));
    };

    handleAvatarClickOutside = (e) => {
        if (e.target.id === 'avatar-modal-background') {
            this.toggleAvatarModal();
        }
    };

    toggleNoteModal = () => {
        this.setState((prevState) => ({
            isNoteModalOpen: !prevState.isNoteModalOpen,
        }));
    };

    handleNoteChange = (event) => {
        this.setState({ note: event.target.value });
    };

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

    deleteNote = () => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

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

    updateButtonVisibility = (buttonName, isVisible) => {
        this.setState((prevState) => ({
            buttonVisibility: {
                ...prevState.buttonVisibility,
                [buttonName]: isVisible,
            }
        }));
    };

    exportToExcel = (user) => {
        const data = [
            { label: 'Birth Year', value: user.birthYear },
            { label: 'Gender', value: user.sex },
            { label: 'Religion', value: user.religion },
            { label: 'Ethnicity', value: user.ethnicity },
            { label: 'Province/City', value: user.city },
            { label: 'Hometown', value: user.hometown },
            { label: 'University', value: user.university },
            { label: 'Major', value: user.major },
            { label: 'Specialization', value: user.specialization },
            { label: 'Study Status', value: user.studyStatus === '0' ? 'Ra trường' : 'Vẫn đang học' },
            { label: 'Hobby', value: user.hobby },
            { label: 'Social Network Link', value: user.socialNetworkLink },
            { label: 'Join Date', value: user.created ? new Date(user.created).toLocaleDateString() : '' }
        ];
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'User Information');
        XLSX.writeFile(wb, 'user_information.xlsx');
    };

    renderProfile = () => {
        const { token, user, following, posts, isAvatarModalOpen, isNoteModalOpen, existingNote, note } = this.state;
        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;
        const { buttonVisibility } = this.state;

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
                    Note...
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
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
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
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
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
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
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

                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                backgroundColor: '#f4f4f9',
                                padding: '20px',
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                width: '100%',
                            }}
                        >
                            {/* Left: Avatar and User Info */}
                            <div
                                style={{
                                    flex: '1',
                                    textAlign: 'center',
                                    backgroundColor: '#fff',
                                    padding: '20px',
                                    borderRadius: '20px',
                                    margin: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                {/* Avatar Section */}
                                <div style={{ position: 'relative', marginBottom: '20px', textAlign: 'center' }}>
                                    {/* Note Display */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: '#fff',
                                            padding: '10px 100px',
                                            zIndex: 2,
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: '#333',
                                        }}
                                    >
                                        {noteDisplay}
                                    </div>
                                    {/* Notes Modal */}
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

                                    {/* Avatar */}
                                    <img
                                        style={{
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            width: '150px',
                                            height: '150px',
                                            border: '3px solid #f0f0f0',
                                            cursor: 'pointer',
                                        }}
                                        src={photoUrl}
                                        alt={user.name}
                                        onError={(i) => (i.target.src = DefaultProfile)}
                                        onClick={this.toggleAvatarModal}
                                    />
                                    {isAvatarModalOpen && (
                                        <div
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
                                                    borderRadius: '10px',
                                                    maxWidth: '90%',
                                                    maxHeight: '90%',
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <h2 style={{ margin: 0, textAlign: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '28px', color: '#333' }}>{user.name}</span>
                                    <i
                                        style={{
                                            marginLeft: '8px',
                                            fontSize: '16px',
                                            color: '#3897f0',
                                            verticalAlign: 'top'
                                        }}
                                        className="fa fa-check-circle"
                                        aria-hidden="true"
                                    />
                                    <p style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>{user.nickname ? `(${user.nickname})` : ""}</p>
                                </h2>

                                {/* Email */}
                                <p style={{ fontSize: '14px', color: '#888' }}>{user.email}</p>

                                {/* Statistics */}
                                <div
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: '20px',
                                        borderRadius: '10px',
                                        marginLeft: '10px',
                                        marginTop: '10px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#333',
                                            marginBottom: '20px',
                                            position: 'relative',
                                            display: 'inline-block',
                                        }}
                                    >
                                        Statistics
                                        <span
                                            style={{
                                                position: 'absolute',
                                                bottom: '-5px',
                                                left: '0',
                                                width: '100%',
                                                height: '4px',
                                                background: '#D19616',
                                                borderRadius: '2px',
                                            }}
                                        ></span>
                                    </h3>

                                    {/* posts */}
                                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    fontSize: '16px',
                                                    padding: '10px 20px',
                                                    borderRadius: '25px',
                                                    background: 'linear-gradient(135deg, #ffc107, #ff6f00)',
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                }}
                                            >
                                                {posts.length}
                                            </span>
                                            <div style={{ marginTop: '8px', fontSize: '14px', color: '#6c757d' }}>Posts</div>
                                        </div>

                                        {/* followers */}
                                        <div style={{ textAlign: 'center' }}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    fontSize: '16px',
                                                    padding: '10px 20px',
                                                    borderRadius: '25px',
                                                    background: 'linear-gradient(135deg, #28a745, #56ab2f)',
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                }}
                                            >
                                                {user.followers.length}
                                            </span>
                                            <div style={{ marginTop: '8px', fontSize: '14px', color: '#6c757d' }}>Followers</div>
                                        </div>

                                        {/* following */}
                                        <div style={{ textAlign: 'center' }}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    fontSize: '16px',
                                                    padding: '10px 20px',
                                                    borderRadius: '25px',
                                                    background: 'linear-gradient(135deg, #007bff, #00d2ff)',
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                }}
                                            >
                                                {user.following.length}
                                            </span>
                                            <div style={{ marginTop: '8px', fontSize: '14px', color: '#6c757d' }}>Following</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: User Details */}
                            <div
                                style={{
                                    flex: '2',
                                    backgroundColor: '#fff',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    margin: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    width="100%"
                                    mb={3} // Add margin-bottom for spacing
                                >
                                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', margin: 0 }}>
                                        Information
                                    </h3>
                                    {/* Export Button */}
                                    <button
                                        title='Export to excel (xlsx)'
                                        onClick={() => this.exportToExcel(user)}
                                        style={{
                                            padding: '5px 14px',
                                            fontSize: '13px',
                                            backgroundColor: 'black',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s, transform 0.2s',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        }}
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#333')}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'black')}
                                    >
                                        <i style={{ marginRight: '10px' }} class="fa fa-download" aria-hidden="true"></i>
                                        <span style={{ fontWeight: 'bold' }}>Export</span>
                                    </button>
                                </Box>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {user.birthYear && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Birth Year (Năm sinh)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>{user.birthYear}</td>
                                            </tr>
                                        )}
                                        {user.sex && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Gender (Giới tính)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>{user.sex}</td>
                                            </tr>
                                        )}
                                        {user.religion && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Religion (Tôn giáo)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>{user.religion}</td>
                                            </tr>
                                        )}
                                        {user.ethnicity && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Ethnicity (Dân tộc)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>{user.ethnicity}</td>
                                            </tr>
                                        )}
                                        {user.city && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Province/City (Tỉnh/Thành phố)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>Living in {user.city}</td>
                                            </tr>
                                        )}
                                        {user.hometown && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Hometown</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>From {user.hometown}</td>
                                            </tr>
                                        )}
                                        {user.university && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>University (Đại học)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>{user.university}</td>
                                            </tr>
                                        )}
                                        {user.major && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Major (Nghành)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>{user.major}</td>
                                            </tr>
                                        )}
                                        {user.specialization && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Specialization (Chuyên nghành)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>{user.specialization}</td>
                                            </tr>
                                        )}
                                        {user.studyStatus && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Study status (Tình trạng học)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>
                                                    {user.studyStatus === '0' ? 'Ra trường' : 'Vẫn đang học'}
                                                </td>
                                            </tr>
                                        )}
                                        {user.hobby && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Hobby (Sở thích)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>{user.hobby}</td>
                                            </tr>
                                        )}
                                        {user.socialNetworkLink && (
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Social Network Link (Liên kết MXH)</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>
                                                    <a href={user.socialNetworkLink} target="_blank" rel="noopener noreferrer">
                                                        {user.socialNetworkLink}
                                                    </a></td>
                                            </tr>
                                        )}
                                        {user.created && (
                                            <tr>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#777' }}>Join SocialWorld</td>
                                                <td style={{ padding: '10px', fontSize: '16px', color: '#333', textAlign: 'right' }}>
                                                    {(() => {
                                                        const CustomDateTime = (dateString) => {
                                                            const date = new Date(dateString);
                                                            const day = String(date.getDate()).padStart(2, '0');
                                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                                            const year = date.getFullYear();

                                                            // Format: dd/MM/yyyy, hh:mm
                                                            return `${day}/${month}/${year}`;
                                                        };
                                                        return CustomDateTime(user.created);
                                                    })()}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Action */}
                            <Box
                                width={'100%'}
                                p={2}
                            >
                                {isAuthenticated().user && isAuthenticated().user._id === user._id ? (
                                    <>
                                        <Box
                                            display={'flex'}
                                            justifyContent={'space-between'}
                                            sx={{ gap: 10 }}
                                        >
                                            {/* SETTING BUTTON */}
                                            <SettingButton
                                                buttonVisibility={this.state.buttonVisibility}
                                                updateButtonVisibility={this.updateButtonVisibility}
                                            />

                                            {/* Create Post Button */}
                                            {buttonVisibility.showCreatePostButton && (
                                                <Link
                                                    className="btn btn-sm btn-raised btn-dark"
                                                    to={`/post/create`}
                                                    style={{
                                                        padding: '10px 20px',
                                                        backgroundColor: "#343a40",
                                                        borderRadius: "25px",
                                                        width: '100%',
                                                        fontSize: "14px",
                                                        textDecoration: "none",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        transition: "background-color 0.3s ease, transform 0.3s ease",
                                                    }}
                                                >
                                                    <i style={{ marginRight: "15px" }} className="fa fa-plus-square" aria-hidden="true"></i> Create Post
                                                </Link>
                                            )}

                                            {/* Edit Profile Button */}
                                            {buttonVisibility.showEditProfileButton && (
                                                <Link
                                                    className="btn btn-sm btn-raised btn-dark"
                                                    to={`/user/edit/${user._id}`}
                                                    style={{
                                                        padding: '10px 20px',
                                                        backgroundColor: "#343a40",
                                                        borderRadius: "25px",
                                                        width: '100%',
                                                        fontSize: "14px",
                                                        textDecoration: "none",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        transition: "background-color 0.3s ease, transform 0.3s ease",
                                                    }}
                                                >
                                                    <i style={{ marginRight: "15px" }} className="fa fa-pencil-square" aria-hidden="true"></i> Edit Profile
                                                </Link>
                                            )}

                                            {/* Delete User Button */}
                                            {buttonVisibility.showDeleteProfileButton && (
                                                <DeleteUserButton userId={user._id} username={user.name} />
                                            )}

                                            {/* Profile Show Button */}
                                            {buttonVisibility.showUserDetailsButton && (
                                                <ProfileShowButton user={user} />
                                            )}
                                        </Box>
                                    </>
                                ) : (
                                    <Box display={'flex'} width={'100%'} justifyContent={'center'} sx={{ gap: 10 }}>
                                        {/* MESSAGE BUTTON */}
                                        <div>
                                            <Link
                                                className="btn btn-sm btn-raised btn-dark"
                                                style={{ borderRadius: "20px", padding: '10px 50px' }}
                                                to={`/chat/${isAuthenticated().user._id}/${user._id}`}
                                            >
                                                <i style={{ marginRight: "15px" }} class="fa fa-commenting" aria-hidden="true"></i> Message
                                            </Link>
                                        </div>

                                        {/* FOLLOW USER BUTTON */}
                                        <div>
                                            <FollowProfileButton following={following} onButtonClick={this.clickFollowButton} />
                                        </div>
                                    </Box>
                                )}

                            </Box>
                        </div>

                        <Paper style={{ padding: '5px', borderRadius: '30px', marginTop: '5px' }}>
                            {/* Bio */}
                            <Box mt={2} mx={2} className="section">
                                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>BIO</h3>
                                <p style={{ fontSize: "18px", }}>{user.about}</p>
                            </Box>
                        </Paper>

                    </div>
                </div>
                <div style={{ marginTop: '10px' }} className="col-md-11">
                    <div className="profile-info-right">
                        <Tabs onSelect={(index, label) => console.log(label + ' selected')}>

                            {/* POSTS TAB */}
                            <Tab label={postsBadge} className="tab-title-name">
                                <div style={{ width: '100%', gap: '80px' }} className="row">
                                    {posts.map((post, i) => (
                                        <div key={i} style={{ paddingBottom: "15px" }} className="col-md-2">
                                            {post.photo && post.photo.data ? (
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
                                            backgroundColor: '#f8f9fa',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            position: 'relative',
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
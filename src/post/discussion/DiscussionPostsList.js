import React, { useEffect, useState } from 'react';
import { deleteDiscussionPost, fetchDiscussionPosts, fetchSubjects, likeDiscussionPost, unlikeDiscussionPost, updateDiscussionPost } from '../apiPost';
import { isAuthenticated } from '../../auth/index';
import DefaultProfile from '../../images/avatar.jpg';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';
import { confirmAlert } from 'react-confirm-alert';
import '../../css/DiscussionPostsList.css';
import Loading from '../../loading/Loading';
import EditDiscussionModal from './EditDiscussionModal';

const DiscussionPostsList = () => {
    // state for discussions
    const [discussions, setDiscussions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // state for subjects
    const [subjects, setSubjects] = useState([]);
    // state for subject
    const [subject, setSubject] = useState("");

    // State for date filters
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // fetchDiscussionPosts
    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true); // Set loading before fetching
            try {
                const data = await fetchDiscussionPosts(subject, startDate, endDate); // Pass dates as arguments
                setDiscussions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [subject, startDate, endDate]);

    // Fetch subjects
    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const data = await fetchSubjects();
                setSubjects(data);
            } catch (error) {
                setError(error.message);
            }
        };

        loadSubjects();
    }, []);

    // refreshData
    const refreshData = async () => {
        setLoading(true);
        try {
            const data = await fetchDiscussionPosts(subject);
            setDiscussions(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // handleDeleteDiscussion
    const handleDeleteDiscussion = async (discussionId) => {
        const token = isAuthenticated().token;
        try {
            await deleteDiscussionPost(discussionId, token);
            setDiscussions(prevDiscussions =>
                prevDiscussions.filter(discussion => discussion._id !== discussionId)
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // confirmDelete
    const confirmDelete = (discussion) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-confirm-alert">
                        <div className="custom-confirm-alert-header">
                            <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>Confirm Delete Discussion</h1>
                        </div>
                        <div className="custom-confirm-alert-body">
                            <p>Are you sure you want to delete this discussion?</p>
                            <div className="custom-confirm-alert-buttons">
                                <button
                                    onClick={() => {
                                        handleDeleteDiscussion(discussion._id);
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
                );
            },
        });
    };

    // handleSubjectChange
    const handleSubjectChange = (e) => {
        setSubject(e.target.value); // set the selected subject
    };

    // Function to handle date changes
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p style={{ color: 'red', textAlign: 'center' }}>Error fetching discussion posts: {error}</p>;
    }

    return (
        <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>

            {/* Filter Dropdown */}
            <div style={{ marginTop: '40px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <label
                    htmlFor="subjectFilter"
                    title="Filters" // Tooltip for the icon
                    style={{
                        fontWeight: 'bold',
                        fontSize: '20px',
                        color: '#007bff',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        marginRight: '20px' // Space between icon and dropdown
                    }}>
                    <i
                        className="fa fa-filter"
                        aria-hidden="true"
                        style={{
                            fontSize: '30px',
                            marginRight: '10px',
                            color: '#007bff',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    ></i>
                </label>

                {/* Subject Filter */}
                <div style={{ marginRight: '15px' }}>
                    <label htmlFor="subjectFilter" style={{ fontSize: '16px', color: '#007bff', marginBottom: '5px', display: 'block' }}>Subjects:</label>
                    <select
                        id="subjectFilter"
                        value={subject}
                        onChange={handleSubjectChange}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #007bff',
                            outline: 'none',
                            transition: 'border-color 0.3s ease',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            minWidth: '150px' // Ensures a minimum width
                        }}
                        onMouseOver={(e) => {
                            e.target.style.borderColor = '#0056b3';
                            e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.borderColor = '#007bff';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map((subject) => (
                            <option style={{ cursor: 'pointer' }} key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                </div>

                {/* Start Date Input */}
                <div style={{ marginRight: '15px' }}>
                    <label htmlFor="startDate" style={{ fontSize: '16px', color: '#007bff', marginBottom: '5px', display: 'block' }}>Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={handleStartDateChange}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #007bff',
                            outline: 'none',
                            transition: 'border-color 0.3s ease',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            minWidth: '150px' // Ensures a minimum width
                        }}
                        onMouseOver={(e) => {
                            e.target.style.borderColor = '#0056b3';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.borderColor = '#007bff';
                        }}
                    />
                </div>

                {/* End Date Input */}
                <div style={{ marginRight: '15px' }}>
                    <label htmlFor="endDate" style={{ fontSize: '16px', color: '#007bff', marginBottom: '5px', display: 'block' }}>End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={handleEndDateChange}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #007bff',
                            outline: 'none',
                            transition: 'border-color 0.3s ease',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            minWidth: '150px' // Ensures a minimum width
                        }}
                        onMouseOver={(e) => {
                            e.target.style.borderColor = '#0056b3';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.borderColor = '#007bff';
                        }}
                    />
                </div>

                {/* Reset Filters Icon */}
                <div style={{ position: 'relative' }}>
                    <i
                        className="fa fa-refresh"
                        aria-hidden="true"
                        title="Reset Filters" // Tooltip for the icon
                        style={{
                            fontSize: '20px',
                            color: '#007bff',
                            cursor: 'pointer',
                            marginLeft: '10px',
                            transition: 'transform 0.3s ease'
                        }}
                        onClick={() => {
                            // Reset the filters
                            setSubject("");
                            setStartDate("");
                            setEndDate("");
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    ></i>
                </div>
            </div>

            {Array.isArray(discussions) && discussions.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'gray' }}>No discussions available.</p>
            ) : (
                discussions.map((discussion) => (
                    <DiscussionPost
                        key={discussion._id}
                        discussion={discussion}
                        onDelete={confirmDelete}
                        refreshData={refreshData}
                    />
                ))
            )}
        </div>
    );
};

const DiscussionPost = ({ discussion, onDelete, refreshData }) => {
    // AUTH
    const token = isAuthenticated().token;
    const auth = isAuthenticated();
    const userId = auth ? auth.user._id : null;
    const { user } = isAuthenticated();

    // state for selectedAnswer
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    // state for likes
    const [likes, setLikes] = useState(discussion.likes.length);
    // state for liked
    const [liked, setLiked] = useState(discussion.likes.includes(userId));
    // state for isEditing
    const [isEditing, setIsEditing] = useState(false);
    // state for updatedPost
    const [updatedPost, setUpdatedPost] = useState({
        question: discussion.question,
        correctAnswer: discussion.correctAnswer,
        answer1: discussion.answer1,
        answer2: discussion.answer2,
        answer3: discussion.answer3,
        answer4: discussion.answer4,
        subject: discussion.subject,
    });

    const [error, setError] = useState("");

    // handleAnswerChange
    const handleAnswerChange = (e) => {
        setSelectedAnswer(e.target.value);
    };

    // handleLikeToggle
    const handleLikeToggle = async () => {
        try {
            if (liked) {
                await unlikeDiscussionPost(userId, token, discussion._id);
                setLikes(likes - 1);
                setLiked(false);
            } else {
                await likeDiscussionPost(userId, token, discussion._id);
                setLikes(likes + 1);
                setLiked(true);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // handleEditSubmit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedPostResponse = await updateDiscussionPost(discussion._id, token, updatedPost);
            setUpdatedPost(updatedPostResponse);
            setIsEditing(false);
            refreshData();
        } catch (err) {
            setError(err.message);
        }
    };

    // postedBy
    const posterId = discussion.postedBy ? discussion.postedBy._id : '';
    const posterName = discussion.postedBy ? discussion.postedBy.name : 'Unknown';
    const posterUniversity = discussion.postedBy ? discussion.postedBy.university : '';

    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '20px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
            {/* EditDiscussionModal */}
            <EditDiscussionModal
                open={isEditing}
                onClose={() => setIsEditing(false)}
                updatedPost={updatedPost}
                setUpdatedPost={setUpdatedPost}
                handleEditSubmit={handleEditSubmit}
            />

            {/* Question title */}
            <div style={{ marginBottom: '10px' }}>
                <h5 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30px',
                        height: '30px',
                        border: '1px solid #007bff',
                        borderRadius: '20px',
                        marginRight: '10px',
                        backgroundColor: '#f0f8ff',
                    }}>
                        <i className="fa fa-question" aria-hidden="true" style={{ color: '#007bff' }}></i>
                    </div>
                    <span>Question:</span>
                </h5>

                {/* {discussion.question} */}
                <div style={{
                    position: 'relative',
                    fontSize: '20px',
                    whiteSpace: 'pre-wrap',
                    color: '#333',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '12px',
                    marginBottom: '10px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                }}>
                    {discussion.question}

                    {/* Copy feature */}
                    <i
                        className="fa fa-copy"
                        aria-hidden="true"
                        // copy function
                        onClick={() => {
                            navigator.clipboard.writeText(discussion.question)
                                .then(() => {
                                    alert('Copied Question Successfully!');
                                })
                                .catch(err => {
                                    console.error('Failed to copy: ', err);
                                });
                        }}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            cursor: 'pointer',
                            color: '#007bff'
                        }}
                    ></i>

                </div>
            </div>

            {/* PostedBy */}
            <div style={{ marginBottom: '20px', color: '#555' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Posted by:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* UserImage */}
                        <img
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                            onError={i => (i.target.src = DefaultProfile)}
                            alt={posterName}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                marginRight: '10px',
                            }}
                        />

                        {/* Name */}
                        <Link
                            to={user ? `/user/${posterId}` : '/signin'}
                            style={{
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                color: 'black'
                            }}
                        >
                            <span style={{ fontWeight: 'bold' }}>{posterName}</span>
                            <i
                                style={{
                                    marginLeft: '5px',
                                    fontSize: '10px',
                                    color: '#3897f0',
                                    verticalAlign: 'top',
                                }}
                                className="fa fa-check-circle"
                                aria-hidden="true"
                            />
                        </Link>
                    </div>

                    {/* Created date */}
                    <div style={{ fontSize: '14px', color: '#777' }}>
                        <strong>Created:</strong> {new Date(discussion.created).toLocaleString()}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* User university */}
                    <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                        University: <strong>{posterUniversity}</strong>
                    </div>
                    {/* Subject */}
                    {discussion.subject && (
                        <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                            <i style={{ marginRight: '5px' }} class="fa fa-book" aria-hidden="true"></i> Subject: <strong>{discussion.subject}</strong>
                        </div>
                    )}
                </div>
            </div>

            <Divider style={{ margin: '10px 0', backgroundColor: '#e0e0e0' }} />

            {(discussion.answer1 || discussion.answer2 || discussion.answer3 || discussion.answer4) && (
                <div style={{ margin: '10px 0', display: 'flex', flexDirection: 'column' }}>
                    {[discussion.answer1, discussion.answer2, discussion.answer3, discussion.answer4].map((answer, index) =>
                        answer && (
                            <label
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9f9f9',
                                    transition: 'background-color 0.3s',
                                    cursor: 'pointer',
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e0e7ff')}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                            >
                                <input
                                    type="radio"
                                    value={`answer${index + 1}`}
                                    checked={selectedAnswer === `answer${index + 1}`}
                                    onChange={handleAnswerChange}
                                    style={{ marginRight: '10px', transform: 'scale(1.2)', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '16px', color: '#444' }}>{answer}</span>
                            </label>
                        )
                    )}
                </div>
            )}
            {selectedAnswer && (
                <div style={{ margin: '10px 0 30px 0', padding: '15px', border: '5px solid #67C7A8', borderRadius: '8px', backgroundColor: '#A7DECC' }}>
                    <span>Correct Answer:</span>
                    <span style={{ fontWeight: 'bold', color: '#007bff' }}> {discussion.correctAnswer}</span>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                {/* handleLikeToggle Button */}
                <button onClick={handleLikeToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <i
                        className={liked ? "fa fa-heart" : "fa fa-heart-o"}
                        style={{
                            color: liked ? "red" : "black",
                            cursor: "pointer",
                            fontSize: '18px',
                            transition: 'color 0.3s',
                            marginRight: '10px'
                        }}
                        aria-hidden="true"
                    ></i>
                    <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>{likes} {likes === 1 ? 'Like' : 'Likes'}</p>
                </button>

                {user && user._id === posterId && (
                    <div style={{ marginLeft: 'auto' }}>
                        {/* Edit Button */}
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '20px',
                                marginRight: '10px',
                            }}>
                            <i
                                className="fa fa-pencil"
                                style={{
                                    color: 'blue',
                                    fontSize: '20px',
                                }}
                                aria-hidden="true"
                            ></i>
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={() => onDelete(discussion._id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '20px',
                            }}>
                            <i
                                className="fa fa-trash"
                                style={{
                                    color: '#e53935',
                                    fontSize: '20px',
                                }}
                                aria-hidden="true"
                            ></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionPostsList;

import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';

import { isAuthenticated } from '../auth';
import { list } from './apiUser';

const FriendsList = () => {
    // state for followingUsers
    const [followingUsers, setFollowingUsers] = useState([]);
    const history = useHistory();
    const authenticatedUser = useMemo(() => isAuthenticated(), []);

    useEffect(() => {
        if (authenticatedUser) {
            list()
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        const followingUsers = data.filter(user =>
                            user.followers.some(follower => follower._id === authenticatedUser.user._id)
                        );
                        // Limit to the first 5 users
                        setFollowingUsers(followingUsers.slice(0, 10));
                    }
                });
        }
    }, [authenticatedUser]);

    // handleUserClick
    const handleUserClick = (userId) => {
        history.push(`/user/${userId}`);  // Redirect to user profile
    };

    if (!authenticatedUser) {
        return (
            <div style={{
                padding: '20px',
                width: '100%',
                maxWidth: '300px',
                background: "#1f1f1f",
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <div>
                    {/* Title */}
                    <h4 style={{
                        marginBottom: '20px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white'
                    }}>
                        Friends
                    </h4>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '30vh',
                        textAlign: 'center',
                        color: 'white',
                        background: '#1f1f1f',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    }}>
                        <h4 style={{
                            marginBottom: '20px',
                            fontSize: '20px',
                            fontWeight: '600',
                            color: 'white'
                        }}>
                            Please sign in to view your friends.
                        </h4>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            padding: '20px',
            width: '100%',
            maxWidth: '300px',
            background: "#1f1f1f",
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
        }}>
            {/* Title */}
            <h4 style={{
                marginBottom: '20px',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white'
            }}>
                Friends
            </h4>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {followingUsers.length > 0 ? (
                    followingUsers.map(user => (
                        <div key={user._id}
                            style={{
                                cursor: "pointer",
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '15px',
                                margin: '5px 0',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                transition: 'background-color 0.3s, transform 0.3s',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                            onClick={() => handleUserClick(user._id)}
                        >
                            {/* USER PHOTO */}
                            <img
                                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                                onError={i => (i.target.src = DefaultProfile)}
                                alt={user.name}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    marginRight: '15px',
                                    border: '2px solid #ddd',
                                    objectFit: 'cover',
                                }}
                            />
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                {/* USER NAME */}
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    {user.name}
                                </span>

                                {/* USER UNIVERSITY */}
                                {user.university && (
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '400',
                                        color: '#888',
                                        // textAlign: 'center'
                                    }}>
                                        <div >
                                            <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                                            <span style={{ marginLeft: "4px" }}>{user.university}</span>
                                        </div>
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{
                        textAlign: 'center',
                        color: 'white'
                    }}>No friends found.</p>
                )}
            </div>
        </div>
    );
};

export default FriendsList;

import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';

import { isAuthenticated } from '../auth';
import { list, follow, findPeople } from './apiUser'; // Ensure the follow and findPeople functions are imported
import { Divider } from '@material-ui/core';

const FriendsList = () => {
    const [followingUsers, setFollowingUsers] = useState([]);
    const [users, setUsers] = useState([]); // For suggested users
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const history = useHistory();
    const authenticatedUser = useMemo(() => isAuthenticated(), []);

    // Fetch the following users
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
                        setFollowingUsers(followingUsers.slice(0, 10));
                    }
                });
        }
    }, [authenticatedUser]);

    // Fetch suggested users
    const fetchUsers = () => {
        setLoading(true);
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const { university, birthYear } = authenticatedUser.user; // Assuming these are available

        findPeople(userId, token, university || "", birthYear || "")
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setUsers([]);
                    setLoading(false);
                } else {
                    setUsers(data);
                    setLoading(false);
                }
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (authenticatedUser) {
            fetchUsers();
        }
    }, [authenticatedUser]);

    const handleUserClick = (userId) => {
        history.push(`/user/${userId}`);
    };

    const onFollow = (user, i) => {
        setLoading(true);
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id)
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    // Add the followed user to followingUsers
                    setFollowingUsers(prevFollowing => [
                        ...prevFollowing,
                        user
                    ]);
                    // Remove the followed user from users
                    let newUsers = [...users];
                    newUsers.splice(i, 1);
                    setUsers(newUsers);
                    setLoading(false);
                }
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
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
                <h4 style={{
                    marginBottom: '20px',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white'
                }}>Friends</h4>
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
        );
    }

    return (
        <>
            {/* FRIEND LIST */}
            <div style={{
                padding: '20px',
                width: '100%',
                maxWidth: '300px',
                background: "#1f1f1f",
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <h4
                    style={{
                        marginBottom: '20px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white'
                    }}
                >
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
                                }}
                                onClick={() => handleUserClick(user._id)}
                            >
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
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }}>{user.name}</span>
                                    {user.university && (
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: '400',
                                            color: '#888',
                                        }}>
                                            <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                                            <span style={{ marginLeft: "4px" }}>{user.university}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{
                            textAlign: 'center',
                            color: 'white'
                        }}
                        >
                            No friends found.
                        </p>
                    )}
                </div>
            </div>

            <Divider style={{
                borderTop: '1px solid white',
                margin: '10px 0',
            }} />

            {/* SUGGESTED USERS */}
            <div style={{
                padding: '20px',
                width: '100%',
                maxWidth: '300px',
                background: "#1f1f1f",
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <h4
                    style={{
                        marginBottom: '20px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white'
                    }}
                >
                    Suggested Users
                </h4>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    {users.length > 0 ? (
                        users.map((user, i) => (
                            <div key={i} className="suggested-user" style={{ marginBottom: '20px' }}>
                                <div
                                    className="user-card"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '10px',
                                        backgroundColor: '#2c2c2c',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <img
                                        className="user-img"
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                                        onError={i => (i.target.src = DefaultProfile)}
                                        alt={user.name}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            border: '2px solid #ddd',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <div style={{ marginLeft: '10px', color: '#fff' }}>
                                        <h6
                                            title={user.name}
                                            style={{
                                                cursor: 'pointer',
                                                margin: '0',
                                                fontSize: '14px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                width: '100px',
                                                transition: 'color 0.3s ease',
                                            }}
                                            onClick={() => handleUserClick(user._id)}
                                            onMouseEnter={(e) => e.target.style.color = '#4A90E2'}
                                            onMouseLeave={(e) => e.target.style.color = ''}
                                        >
                                            {user.name}
                                        </h6>
                                        <p
                                            title={`${user.email}`}
                                            style={{
                                                margin: '0',
                                                fontSize: '12px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                width: '100px',
                                            }}
                                        >
                                            {user.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onFollow(user, i)}
                                        style={{
                                            marginLeft: 'auto',
                                            background: 'none',
                                            border: 'none',
                                            color: '#4A90E2',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Follow
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{
                            textAlign: 'center',
                            color: 'white'
                        }}
                        >
                            No users found
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default FriendsList;

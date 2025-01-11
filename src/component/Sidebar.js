import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { read } from '../user/apiUser';
import { Typography } from '@material-ui/core';
import DefaultProfile from '../images/avatar.jpg';
import { isAuthenticated } from '../auth';
import './Sidebar.css';

const Sidebar = () => {
    // state for user
    const [user, setUser] = useState(null);
    // state for authenticated
    const [authenticated, setAuthenticated] = useState(false);

    const currentUser = isAuthenticated().user;

    // fetchUser
    useEffect(() => {
        const fetchUser = async () => {
            const token = isAuthenticated().token;
            const userId = isAuthenticated().user._id;
            try {
                const fetchedUser = await read(userId, token);
                if (fetchedUser.error) {
                    console.log(fetchedUser.error);
                } else {
                    setUser(fetchedUser);
                    setAuthenticated(true);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (isAuthenticated()) {
            fetchUser();
        } else {
            setAuthenticated(false);
        }
    }, []);

    return (
        <div className="sidebar">
            <div style={{ marginTop: "0px" }}>

                {/* HOME LINK */}
                <Link to="/" className="sidebar-link">
                    <i className="fas fa-home"></i>
                    <span>Home</span>
                </Link>

                {/* IF AUTHENTICATED */}
                {authenticated && (
                    <>
                        {/* CREATE POST */}
                        <Link to="/post/create" className="sidebar-link">
                            <i className="fas fa-plus"></i>
                            <span>Create Post</span>
                        </Link>

                        {/* FIND FRIENDS */}
                        <Link to="/findpeople" className="sidebar-link">
                            <i className="fas fa-users"></i>
                            <span>Find Friends</span>
                        </Link>

                        {/* MESSAGE */}
                        <Link to={`/chats/${user._id}`} className="sidebar-link">
                            <i className="fas fa-envelope"></i>
                            <span>Message</span>
                        </Link>

                        {/* PROFILE */}
                        {currentUser && (
                            <Link to={`/user/${user._id}`} className="sidebar-link">
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${currentUser._id}`}
                                    alt={currentUser.name}
                                    onError={i => (i.target.src = DefaultProfile)}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        marginRight: '15px',
                                        cursor: 'pointer',
                                        objectFit: 'contain',
                                        border: '3px solid white'
                                    }}
                                />
                                <span>Profile</span>
                            </Link>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { read } from '../user/apiUser';
import { Typography } from '@material-ui/core';

import { isAuthenticated } from '../auth';
import './Sidebar.css';

const Sidebar = () => {
    // state for user
    const [user, setUser] = useState(null);
    // state for authenticated
    const [authenticated, setAuthenticated] = useState(false);

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
            <div style={{ marginTop: "50px" }}>
                {/* LOGO TITLE */}
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    style={{
                        fontFamily: 'Roboto, Arial, sans-serif',
                        color: '#1E88E5',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: "bold",
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                        fontSize: '2rem',
                        marginBottom: '2.5rem',
                        marginLeft: '25px'
                    }}
                >
                    <span>Social World</span>
                </Typography>

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
                        <Link to={`/user/${user._id}`} className="sidebar-link">
                            <i className="far fa-user"></i>
                            <span>Profile</span>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;

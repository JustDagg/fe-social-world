import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';

import { signout, isAuthenticated } from "../auth";
import '../css/Menu.css';

const isActive = (history, path) => {
    return history.location.pathname === path
        ? { borderBottom: "2px solid #D19616", color: "#D19616" }
        : { color: "#ffffff" };
};

const Menu = (props) => (
    <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{
            background: "#1f1f1f",
            padding: "0px 20px",
            borderBottom: "1px solid #444"
        }}
    >
        <div className="container">
            {/* Brand */}
            <Link
                className="navbar-brand"
                to="/"
                style={{
                    color: "#ffffff",
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    display: "flex",
                    alignItems: "center"
                }}
            >
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
                        textShadow: '1px 3px 3px rgba(0, 0, 0, 0.2)',
                        fontWeight: "bold"
                    }}
                >
                    <i className="fa fa-globe" aria-hidden="true" style={{ fontSize: "1.5rem", marginRight: "20px" }}></i>
                    <span style={{ fontSize: "1.5rem" }}>Social World</span>
                </Typography>
            </Link>

            {/* Toggle Button */}
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Menu Links */}
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul
                    className="navbar-nav ml-auto"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 0,
                        margin: 0
                    }}
                >
                    {/* Home Link */}
                    <li className="nav-item" style={{ margin: '0 10px' }}>
                        <Link
                            className="nav-link"
                            style={{
                                ...isActive(props.history, "/"),
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                            to='/'
                            title="Home"
                        >
                            <i className="fas fa-home"></i>
                        </Link>
                    </li>

                    {!isAuthenticated() && (
                        <>
                            {/* Sign In Link */}
                            <li className="nav-item" style={{ margin: '0 10px' }}>
                                <Link
                                    className="nav-link"
                                    style={{
                                        ...isActive(props.history, "/signin"),
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold'
                                    }}
                                    to='/signin'
                                    title="Sign In"
                                >
                                    <i className="fas fa-sign-in-alt"></i>
                                </Link>
                            </li>
                            {/* Sign Up Link */}
                            <li className="nav-item" style={{ margin: '0 10px' }}>
                                <Link
                                    className="nav-link"
                                    style={{
                                        ...isActive(props.history, "/signup"),
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold'
                                    }}
                                    to='/signup'
                                    title="Sign Up"
                                >
                                    <i className="fas fa-user-plus"></i>
                                </Link>
                            </li>
                        </>
                    )}

                    {isAuthenticated() && (
                        <>
                        
                            {/* Create Post Link */}
                            <li className="nav-item" style={{ margin: '0 10px' }}>
                                <Link
                                    className="nav-link"
                                    to='/post/create'
                                    style={{
                                        ...isActive(props.history, '/post/create'),
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold'
                                    }}
                                    title="Create Post"
                                >
                                    <i className="fas fa-plus"></i>
                                </Link>
                            </li>

                            {/* Find People Link */}
                            <li className="nav-item" style={{ margin: '0 10px' }}>
                                <Link
                                    className="nav-link"
                                    to='/findpeople'
                                    style={{
                                        ...isActive(props.history, '/findpeople'),
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold'
                                    }}
                                    title="Find Friends"
                                >
                                    <i className="fas fa-users"></i>
                                </Link>
                            </li>

                            {/* Profile Dropdown */}
                            <li className="nav-item dropdown">
                                <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <i className="fas fa-user mr-2"></i>{`${isAuthenticated().user.name}`}
                                </button>
                                <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton"
                                    style={{ background: '#333', color: '#fff', width: "200px" }}
                                >
                                    {/* Your Profile */}
                                    <Link
                                        className="dropdown-item"
                                        to={`/user/${isAuthenticated().user._id}`}
                                        style={{ fontSize: '1rem', color: "white" }}
                                    >
                                        <i className="fas fa-user mr-2"></i>Your Profile
                                    </Link>

                                    {/* Message */}
                                    <Link
                                        className="dropdown-item"
                                        to={`/chats/${isAuthenticated().user._id}`}
                                        style={{ fontSize: '1rem', color: "white" }}
                                    >
                                        <i className="fas fa-comment-alt mr-2"></i>Message
                                    </Link>

                                    {/* Log Out */}
                                    <span
                                        className="dropdown-item"
                                        style={{ cursor: "pointer", fontSize: '1rem', color: "white" }}
                                        onClick={() => signout(() => props.history.push('/'))}
                                    >
                                        <i className="fas fa-sign-out-alt mr-2"></i>Log Out
                                    </span>
                                </div>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    </nav>
);

export default withRouter(Menu);

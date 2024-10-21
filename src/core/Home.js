import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Posts from '../post/Posts';
import Sidebar from '../component/Sidebar';

import DefaultProfile from '../images/avatar.jpg';
import FriendsList from '../user/FiendList';
import { isAuthenticated } from '../auth';
import CreatePostModal from '../post/CreatePostModal ';
import Footer from '../component/Footer';
import NotesList from '../user/NotesList';

const Home = () => {
    // state for isModalOpen
    const [isModalOpen, setModalOpen] = useState(false);

    // AUTH
    const currentUser = isAuthenticated().user;
    const isUserAuthenticated = !!currentUser;

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ width: '300px', backgroundColor: '#fafafa', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
                    <Sidebar />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f0f2f5' }}>

                    {/* NotesList */}
                    {isUserAuthenticated && (
                        <div style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }}>
                            <NotesList /> 
                        </div>
                    )}

                    {/* Avatar and Modal Button Container */}
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
                        {/* currentUser */}
                        {currentUser && (
                            <Link to={`/user/${currentUser._id}`} style={{ textDecoration: 'none' }}>
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${currentUser._id}`}
                                    alt={currentUser.name}
                                    onError={i => (i.target.src = DefaultProfile)}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        marginRight: '15px',
                                        border: '2px solid #ddd',
                                        cursor: 'pointer',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Link>
                        )}

                        {/* CreatePostModal */}
                        {isUserAuthenticated && (
                            <div
                                onClick={openModal}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    border: '1px solid #ccc',
                                    borderRadius: '25px',
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    color: '#65676b',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
                                    flex: 1,
                                }}
                            >
                                <i className="fas fa-pencil-alt" style={{ marginRight: '8px' }}></i>
                                <span>{currentUser.name}, What's on your mind?</span>
                            </div>
                        )}
                    </div>

                    {/* Posts Section */}
                    <div style={{ width: '100%', maxWidth: '600px' }}>
                        <Posts />
                    </div>
                </div>

                {/* FriendsList */}
                <div style={{ width: '300px', background: "#1f1f1f", boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
                    <FriendsList />
                </div>
            </div>

            {/* Footer */}
            <Footer />

            {/* CreatePostModal */}
            {isUserAuthenticated && <CreatePostModal isOpen={isModalOpen} onClose={closeModal} />}
        </div >
    );
};

export default Home;

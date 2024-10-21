import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../auth';
import { getNotes } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';

const Note = ({ note }) => {
    // posterId
    const posterId = note.postedBy ? note.postedBy._id : '';
    // posterName
    const posterName = note.postedBy ? note.postedBy.name : 'Unknown';

    return (
        <div style={{
            position: 'relative',
            margin: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {/* Note Content */}
            <p style={{
                color: 'white',
                backgroundColor: '#363636',
                borderRadius: '30px',
                padding: '10px',
                marginBottom: '0px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                textAlign: 'center',
                maxWidth: '150px',
            }}>
                {note.content}
            </p>

            {/* Avatar */}
            <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid transparent',
                backgroundColor: '#56ccf2',
                marginBottom: '5px',
            }}>
                <Link to={`/user/${posterId}`} style={{ textDecoration: 'none' }}>
                    <img
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                        alt={posterName}
                        onError={i => (i.target.src = DefaultProfile)}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%',
                        }}
                    />
                </Link>
            </div>
            {/* Note User Name */}
            <span style={{ color: '#333', fontWeight: 'bold', fontSize: '14px' }}>{posterName}</span>
        </div>
    );
};

const NotesList = () => {
    // state for notes
    const [notes, setNotes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // fetchNotes
    useEffect(() => {
        const fetchNotes = async () => {
            const token = isAuthenticated().token;
            try {
                const response = await getNotes(token);
                setNotes(response);
            } catch (err) {
                setError('Failed to load notes.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;

    return (
        <div style={{
            display: 'flex',
            overflowX: 'auto',
            padding: '0px 0px 20px 0px',
            whiteSpace: 'nowrap',
            alignItems: 'flex-start',
        }}>
            {notes.length === 0 ? (
                null
            ) : (
                notes.map(note => (
                    <Note key={note._id} note={note} />
                ))
            )}
        </div>
    );
};

export default NotesList;

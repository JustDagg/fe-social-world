import React, { useState } from 'react';
import {
    Button,
    TextField
} from '@material-ui/core';

import DefaultProfile from '../images/avatar.jpg';

const NoteModal = ({ user, isOpen, onClose, existingNote, onDelete, onSave, note, handleNoteChange }) => {

    const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;

    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 20) {
            handleNoteChange(e);
            setError('');
        } else {
            setError("Note cannot exceed 20 characters");
        }
    };

    // Validation function
    const isValid = () => {
        const text = note;
        if (text.length === 0) {
            setError("Note cannot be empty");
            return false;
        }
        if (text.length > 20) {
            setError("Note cannot exceed 20 characters");
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (isValid()) {
            onSave();
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#363636',
                    padding: '30px',
                    borderRadius: '15px',
                    width: '400px',
                    textAlign: 'center',
                    animation: 'fadeIn 0.3s ease',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ marginBottom: '20px', color: '#ffff', fontFamily: 'Arial, sans-serif' }}>
                    {existingNote ? 'Existing Note' : 'Create Note'}
                </h3>
                {existingNote ? (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p style={{
                            fontSize: '16px',
                            color: '#fff',
                            marginBottom: '20px',
                            padding: '10px',
                            backgroundColor: '#444',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}>
                            {existingNote.content}
                        </p>
                        <Button
                            onClick={onDelete}
                            variant="contained"
                            color="error"
                            style={{
                                color: "#ffff",
                                width: "100%",
                                marginTop: "20px",
                                borderRadius: "20px",
                                height: "3rem",
                                backgroundColor: "red"
                            }}
                        >
                            Delete Note
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                marginBottom: "20px"
                            }}
                            src={photoUrl}
                            alt={user.name}
                            onError={(i) => (i.target.src = DefaultProfile)}
                            className="avatar img-circle"
                        />

                        <TextField
                            value={note}
                            onChange={handleChange}
                            error={Boolean(error)}
                            helperText={error}
                            variant="outlined"
                            placeholder="Share your thoughts..."
                            fullWidth
                            inputProps={{
                                maxLength: 20,
                                style: { color: 'white' },
                            }}
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                            sx={{
                                backgroundColor: '#444',
                                borderRadius: '5px',
                            }}
                        />

                        <Button
                            onClick={handleSave}
                            variant="contained"
                            color="success"
                            style={{
                                color: "#ffff",
                                width: "100%",
                                marginTop: "20px",
                                borderRadius: "20px",
                                height: "3rem",
                                backgroundColor: "green"
                            }}
                        >
                            Share
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteModal;

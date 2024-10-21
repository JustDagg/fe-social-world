import React, { useState } from 'react';
import DefaultProfile from '../images/avatar.jpg';
import { Button, TextField } from '@material-ui/core'; // Adjusted import

const NoteModal = ({ user, isOpen, onClose, existingNote, onDelete, onSave, note, handleNoteChange }) => {
    // photoUrl
    const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;

    // State for error
    const [error, setError] = useState('');

    // Return null if the modal is not open
    if (!isOpen) return null;

    const handleChange = (e) => {
        const value = e.target.value; // Get the value from the TextField
        if (value.length <= 10) {
            handleNoteChange(e); // Update the note if not exceeding 10 characters
            setError(''); // Clear any error message
        } else {
            setError("Note cannot exceed 10 characters"); // Show error if exceeds 10 characters
        }
    };

    // Validation function
    const isValid = () => {
        const text = note;
        if (text.length === 0) {
            setError("Note cannot be empty");
            return false;
        }
        if (text.length > 10) {
            setError("Note cannot exceed 10 characters");
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (isValid()) {
            onSave(); // Call onSave if note is valid
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
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark background
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
                    borderRadius: '15px', // Rounded corners
                    width: '400px',
                    textAlign: 'center',
                    animation: 'fadeIn 0.3s ease', // Fade-in effect
                }}
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing on content click
            >
                <h3 style={{ marginBottom: '20px', color: '#ffff', fontFamily: 'Arial, sans-serif' }}>
                    {existingNote ? 'Existing Note' : 'Create Note'}
                </h3>
                {existingNote ? (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p style={{
                            fontSize: '16px',
                            color: '#fff', // White text color
                            marginBottom: '20px',
                            padding: '10px', // Add padding for better spacing
                            backgroundColor: '#444', // Background color for the note
                            borderRadius: '8px', // Rounded corners for the note display
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow effect
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
                                maxLength: 10,
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

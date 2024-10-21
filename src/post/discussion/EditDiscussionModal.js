import React from 'react';
import { Button, Modal, TextField } from '@material-ui/core';

const EditDiscussionModal = ({ open, onClose, updatedPost, setUpdatedPost, handleEditSubmit }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '1000px',
                    maxHeight: '100vh',
                    padding: '20px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    zIndex: 1000,
                    transition: 'all 0.3s ease',
                    animation: 'fadeIn 0.3s',
                    overflowY: 'auto',
                }}
            >
                {/* Edit Discussion Post Title */}
                <h2
                    style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '20px',
                        textAlign: 'center',
                        color: '#4A4A4A',
                        letterSpacing: '0.5px',
                    }}
                >
                    Edit Discussion Post
                </h2>

                {/* Question Field */}
                <TextField
                    value={updatedPost.question}
                    onChange={(e) => setUpdatedPost({ ...updatedPost, question: e.target.value })}
                    label="Question"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    InputLabelProps={{ style: { color: '#888' } }}
                    InputProps={{
                        style: { borderRadius: '8px' },
                    }}
                    style={{ marginBottom: '10px' }}
                />

                {/* Subject Field */}
                <TextField
                    value={updatedPost.subject}
                    onChange={(e) => setUpdatedPost({ ...updatedPost, subject: e.target.value })}
                    label="Subject"
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    InputLabelProps={{ style: { color: '#888' } }}
                    InputProps={{
                        style: { borderRadius: '8px' },
                    }}
                    style={{ marginBottom: '10px' }}
                />

                {/* Correct Answer Field */}
                <TextField
                    value={updatedPost.correctAnswer}
                    onChange={(e) => setUpdatedPost({ ...updatedPost, correctAnswer: e.target.value })}
                    label="Correct Answer"
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    InputLabelProps={{ style: { color: '#888' } }}
                    InputProps={{
                        style: { borderRadius: '8px' },
                    }}
                    style={{ marginBottom: '10px' }}
                />

                {/* Answers Field */}
                {['answer1', 'answer2', 'answer3', 'answer4'].map((answerField, index) => (
                    <TextField
                        key={index}
                        value={updatedPost[answerField]}
                        onChange={(e) => setUpdatedPost({ ...updatedPost, [answerField]: e.target.value })}
                        label={`Answer ${index + 1}`}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        InputLabelProps={{ style: { color: '#888' } }}
                        InputProps={{
                            style: { borderRadius: '8px' },
                        }}
                        style={{ marginBottom: '10px' }}
                    />
                ))}

                {/* handleEditSubmit Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Save Button */}
                    <Button
                        onClick={handleEditSubmit}
                        color="primary"
                        variant="contained"
                        style={{
                            flex: 1,
                            marginRight: '10px',
                            borderRadius: '8px',
                            textTransform: 'none',
                            backgroundColor: '#6200ea',
                            color: '#fff',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3700b3')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6200ea')}
                    >
                        Save
                    </Button>

                    {/* Cancel Button */}
                    <Button
                        onClick={onClose}
                        color="secondary"
                        variant="outlined"
                        style={{
                            flex: 1,
                            borderRadius: '8px',
                            textTransform: 'none',
                            borderColor: '#6200ea',
                            color: '#6200ea',
                            transition: 'border-color 0.3s, color 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#3700b3';
                            e.currentTarget.style.color = '#3700b3';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#6200ea';
                            e.currentTarget.style.color = '#6200ea';
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditDiscussionModal;

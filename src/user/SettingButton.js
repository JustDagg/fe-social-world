import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    TextField,
    Typography,
    IconButton
} from '@material-ui/core';

import { updateRestrictedPhrases, getRestrictedPhrases } from "../post/apiPost";
import { isAuthenticated } from "../auth";

export const SettingButton = () => {

    const [showMenu, setShowMenu] = useState(false);
    const [restrictedPhrases, setRestrictedPhrases] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newRestrictedPhrases, setNewRestrictedPhrases] = useState("");
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (isAuthenticated()) {
            setToken(isAuthenticated().token);
            setUserId(isAuthenticated().user._id);
            getRestrictedPhrases(isAuthenticated().token, isAuthenticated().user._id)
                .then(data => {
                    if (data.restrictedPhrases) {
                        setRestrictedPhrases(data.restrictedPhrases);
                        setNewRestrictedPhrases(data.restrictedPhrases.join(', '));
                    }
                })
                .catch(err => console.log(err));
        }
    }, []);

    const handleRestrictedPhrasesUpdate = () => {
        const phrasesArray = newRestrictedPhrases.split(',').map(phrase => phrase.trim());

        updateRestrictedPhrases(token, userId, phrasesArray)
            .then(data => {
                if (data.error) {
                    alert("Có lỗi xảy ra khi cập nhật từ hạn chế.");
                } else {
                    alert("Danh sách từ hạn chế đã được cập nhật thành công!");

                    getRestrictedPhrases(token, userId)
                        .then(updatedData => {
                            if (updatedData.restrictedPhrases) {
                                const updatedPhrases = updatedData.restrictedPhrases.join(', ');
                                setNewRestrictedPhrases(updatedPhrases);
                                setRestrictedPhrases(updatedData.restrictedPhrases);
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            alert("Có lỗi khi lấy lại danh sách từ hạn chế.");
                        });

                    setShowModal(false);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Có lỗi khi cập nhật từ hạn chế.");
            });
    };

    const handleInputChange = (e) => {
        setNewRestrictedPhrases(e.target.value);
    };

    return (
        <div style={{ position: 'relative', fontFamily: 'Arial, sans-serif' }}>
            {/* Button Settings */}
            <button
                className="btn btn-sm btn-raised btn-dark"
                style={{
                    padding: '12px 24px',
                    backgroundColor: "#1e2a3a",
                    borderRadius: "30px",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#fff",
                    border: 'none',
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    transition: "background-color 0.3s ease, transform 0.3s ease",
                    width: '100%',
                }}
                onClick={() => setShowMenu(!showMenu)}
            >
                <i className="fa fa-cog" style={{ fontSize: "18px" }} aria-hidden="true"></i>
            </button>

            {/* Menu */}
            {showMenu && (
                <div style={{
                    position: 'absolute',
                    top: '60px',
                    left: '0',
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                    width: '280px',
                    zIndex: 1000,
                    border: '1px solid #ddd'
                }}>
                    <button
                        style={{
                            padding: '12px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            width: '100%',
                            border: 'none',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            fontSize: '15px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onClick={() => setShowModal(true)}
                    >
                        <i style={{ marginRight: '5px' }} className="fa fa-ban" aria-hidden="true"></i> Manage Restricted Words
                    </button>
                </div>
            )}

            {/* Modal using Material-UI */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 1000,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        borderRadius: "8px",
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#D19616',
                            p: 2,
                            boxShadow: 3,
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="h2"
                            style={{
                                fontWeight: 'bold',
                                color: 'white',
                                borderRadius: '8px',
                                textAlign: 'center',
                            }}
                        >
                            Restricted Words
                        </Typography>

                        <IconButton onClick={() => setShowModal(false)} sx={{ color: 'white' }}>
                            <i style={{ color: 'white' }} class="fa fa-times" aria-hidden="true"></i>
                        </IconButton>
                    </Box>
                    
                    <div style={{ padding: '30px' }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Restricted words:
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={newRestrictedPhrases}
                            onChange={handleInputChange}
                            placeholder="Enter words, separated by commas"
                            sx={{
                                marginTop: '8px',
                            }}
                        />

                        <button
                            style={{
                                width: "100%",
                                marginTop: "20px",
                                borderRadius: "20px",
                                height: "3rem",
                                backgroundColor: "#D19616"
                            }}
                            onClick={handleRestrictedPhrasesUpdate}
                            className="btn btn-raised btn-primary">
                            Update
                        </button>
                    </div>
                </Box>
            </Modal>
        </div >
    );
};

import React, { useState } from "react";
import {
    Box,
    IconButton,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@material-ui/core";

import { DisplayDateTime12Hour } from "../post/timeDifference";

export const ProfileShowButton = (user) => {

    const userInfo = user.user;
    const [openInformationModal, setOpenInformationModal] = useState(false);
    const [onClose, setOnClose] = useState(false);

    const handleOpenInformationModal = () => {
        setOpenInformationModal(true);
        setOnClose(false);
    };

    const handleCloseInformationModal = () => {
        setOpenInformationModal(false);
        setOnClose(true);
    };

    const handleClose = () => {
        if (onClose) {
            console.log("Modal is already closed.");
        } else {
            handleCloseInformationModal();
        }
    };

    return (
        <>
            <button
                onClick={handleOpenInformationModal}
                className="btn btn-sm btn-raised btn-dark"
                style={{
                    padding: '10px 20px',
                    backgroundColor: "#343a40",
                    borderRadius: "25px",
                    width: '100%',
                    fontSize: "14px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
            >
                <i style={{ marginRight: "15px" }} class="fa fa-exclamation-circle" aria-hidden="true"></i> User Details
            </button>

            {/* Modal */}
            <Modal
                open={openInformationModal}
                onClose={handleCloseInformationModal}
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
                            User Details
                        </Typography>

                        {/* Close Icon */}
                        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                            <i style={{ color: 'white' }} class="fa fa-times" aria-hidden="true"></i>
                        </IconButton>
                    </Box>

                    <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
                        <Table>
                            <TableBody>
                                {/* Nickname */}
                                {userInfo.nickname && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Nickname</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {userInfo.nickname}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Province/City */}
                                {userInfo.city && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Province/City</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {userInfo.city}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* hometown */}
                                {userInfo.hometown && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Hometown</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {userInfo.hometown}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* User Birth Year */}
                                {userInfo.birthYear && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Birth Year</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {userInfo.birthYear}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Sex */}
                                {userInfo.sex && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Sex</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {userInfo.sex}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* University */}
                                {userInfo.university && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">University</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {userInfo.university}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Major */}
                                {userInfo.major && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Major</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {userInfo.major}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Specialization */}
                                {userInfo.specialization && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Specialization</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {userInfo.specialization}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Hobby */}
                                {userInfo.hobby && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Hobby</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {userInfo.hobby}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* socialNetworkLink */}
                                {userInfo.socialNetworkLink && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Social Network Link</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            <a href={userInfo.socialNetworkLink} target="_blank" rel="noopener noreferrer">
                                                {userInfo.socialNetworkLink}
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Created Date */}
                                {userInfo.created && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Join SocialWorld</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {DisplayDateTime12Hour(new Date(userInfo.created))}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Updated Date */}
                                {userInfo.updated && (
                                    <TableRow>
                                        <TableCell align="left" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body1" color="textSecondary">Updated Date</Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ borderBottom: '1px solid #ddd', fontSize: '16px', color: '#333' }}>
                                            {DisplayDateTime12Hour(new Date(userInfo.updated))}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
        </>
    );
};
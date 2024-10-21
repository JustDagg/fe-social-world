import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { isAuthenticated } from '../auth/index';
import { signout } from '../auth/index';
import { remove } from './apiUser';
import '../css/DeleteUser.css';

class DeleteUser extends Component {
    state = {
        redirect: false
    }

    // deleteAccount
    deleteAccount = () => {
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        remove(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    signout(() => console.log("User is deleted"));
                    this.setState({ redirect: true });
                }
            });
    };

    // deleteConfirmed
    deleteConfirmed = () => {
        const username = this.props.username
        confirmAlert({
            customUI: ({ onClose }) => (
                <div className="custom-confirm-alert">
                    <div className="custom-confirm-alert-header">
                        <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>Confirm Delete Account</h1>
                    </div>
                    <div className="custom-confirm-alert-body">
                        <p>Are you sure you want to delete this account with name <b>{username}</b>?</p>
                        <div className="custom-confirm-alert-buttons">
                            <button
                                onClick={() => {
                                    this.deleteAccount();
                                    onClose();
                                }}
                                className="custom-confirm-alert-button custom-confirm-alert-button-yes"
                                style={{ borderRadius: "20px" }}
                            >
                                Yes
                            </button>
                            <button
                                onClick={onClose}
                                className="custom-confirm-alert-button custom-confirm-alert-button-no"
                                style={{ borderRadius: "20px" }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/'></Redirect>
        }
        return (
            <button
                onClick={this.deleteConfirmed}
                className="btn btn-sm btn-raised btn-dark"
                style={{
                    backgroundColor: "#343a40",
                    borderRadius: "25px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
            >
                <i style={{ marginRight: "5px" }} class="fa fa-minus-square" aria-hidden="true"></i> Delete Profile
            </button>
        );
    }
}

export default DeleteUser;
import React, { Component } from "react";
import { Box } from "../../node_modules/@material-ui/core/index";

import { resetPassword } from "../auth";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            message: "",
            error: ""
        };
    }

    // resetPassword
    resetPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });

        resetPassword({
            newPassword: this.state.newPassword,
            resetPasswordLink: this.props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message, newPassword: "" });
            }
        });
    };

    render() {
        const { message, error } = this.state;
        return (
            <div className="container" style={{ maxWidth: "100%", minHeight: '100vh' }}>
                {/* RETURN TO SIGNIN PAGE BUTTON */}
                <button
                    style={{
                        width: "300px",
                        marginTop: "20px",
                        borderRadius: "20px",
                        height: "3rem",
                        backgroundColor: "#e0e0e0",
                        border: "1px solid #ccc",
                        color: "#333",
                        fontSize: "16px"
                    }}
                    onClick={() => this.props.history.push('/signin')}
                    className="btn btn-raised btn-secondary">
                    <i className="fas fa-arrow-left" style={{ marginRight: "15px" }}></i>
                    <span style={{ fontWeight: "bold" }}>Return to Sign In</span>
                </button>

                <Box sx={{ mx: 10 }}>
                    <h2 style={{ fontWeight: "bold" }} className="mb-5 text-center">
                        Reset Your Password
                        <i style={{ marginLeft: "15px" }} className="fa fa-key" aria-hidden="true"></i>
                    </h2>

                    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                        {error}
                    </div>
                    <div className="alert alert-danger" style={{ display: message ? "" : "none" }}>
                        {message}
                    </div>
                    <form>
                        <div className="form-group mt-5">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Your new password"
                                value={this.state.newPassword}
                                name="newPassword"
                                onChange={e =>
                                    this.setState({
                                        newPassword: e.target.value,
                                        message: "",
                                        error: ""
                                    })
                                }
                                autoFocus
                                style={{
                                    padding: '20px',
                                    border: '1px solid #dadce0',
                                    borderRadius: '30px',
                                    boxShadow: 'none',
                                    transition: 'border 0.3s ease',
                                    width: '100%',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.border = '1px solid #1a73e8'}
                                onBlur={(e) => e.target.style.border = '1px solid #dadce0'}
                            />
                        </div>
                        <button
                            onClick={this.resetPassword}
                            className="btn btn-raised btn-primary"
                            style={{
                                width: "100%",
                                marginTop: "20px",
                                borderRadius: "20px",
                                height: "3rem",
                                backgroundColor: "#D19616",
                                fontWeight: "bold"
                            }}
                        >
                            Reset Password
                        </button>
                    </form>
                </Box>
            </div>
        );
    }
}

export default ResetPassword;
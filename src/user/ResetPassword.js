import React, { Component } from "react";

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
            <div className="container">
                <h2 style={{ fontWeight: "bold" }} className="mt-5 mb-5 text-center">
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
            </div>
        );
    }
}

export default ResetPassword;
import React, { Component } from "react";

import { forgotPassword } from "../auth";

class ForgotPassword extends Component {
    state = {
        email: "",
        message: "",
        error: ""
    };

    // forgotPasswordFunction
    forgotPasswordFunction = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        forgotPassword(this.state.email).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message });
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

                <h2 style={{ fontWeight: "bold" }} className="mb-5 text-center">
                    Forgot Password
                    <i style={{ marginLeft: "15px" }} className="fa fa-key" aria-hidden="true"></i>
                </h2>

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                <div className="alert alert-danger" style={{ display: message ? "" : "none" }}>
                    {message}
                </div>

                <form style={{ padding: "0px 30px", marginBottom: "20px" }}>
                    {/* EMAIL */}
                    <div className="form-group mt-5">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Your email address"
                            value={this.state.email}
                            name="email"
                            onChange={e =>
                                this.setState({
                                    email: e.target.value,
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

                    {/* ForgotPassword Button */}
                    <button
                        onClick={this.forgotPasswordFunction}
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
                        Send Password Reset Link
                    </button>
                </form>
            </div>
        );
    }
}

export default ForgotPassword;
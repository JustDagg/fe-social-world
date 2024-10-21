import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import SocialLogin from "./SocialLogin";
import Loading from '../loading/Loading';
import { Typography, TextField, Button, Container, Paper, Divider, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import { signin, authenticate } from "../auth";

class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false,
            selectedDay: "",
            correctDay: new Date().toLocaleString('en-US', { weekday: 'long' })
        };
    }

    // handleDayChange
    handleDayChange = event => {
        this.setState({ selectedDay: event.target.value });
    };

    // handleChange
    handleChange = e => {
        this.setState({
            error: "",
            [e.target.name]: e.target.value
        });
    };

    // clickSubmit
    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true });
        const { email, password, selectedDay, correctDay } = this.state;
        const user = { email, password };

        if (selectedDay === correctDay) {
            signin(user)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        // authenticate
                        authenticate(data, () => {
                            this.setState({ redirectToReferer: true })
                        });
                    }
                });
        } else {
            this.setState({
                loading: false,
                error: "Please select the correct day of the week!"
            });
        }
    };

    signinForm = (email, password, loading) => (
        <form style={{ display: loading ? "none" : "" }}>

            {/* EMAIL FIELD */}
            <TextField
                label="Email"
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={this.handleChange}
                name="email"
                value={email}
                type="email"
                required
            />

            {/* PASSWORD FIELD */}
            <TextField
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={this.handleChange}
                name="password"
                value={password}
                type="password"
                required
            />

            {/* CAPCHA SELECT FIELD */}
            <div style={{ margin: '10px' }}>
                {/* Verify Captcha Title */}
                <Typography
                    style={{
                        marginBottom: '0px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <i className="fa fa-share" aria-hidden="true" style={{ marginRight: '8px' }}></i>
                    Verify Captcha
                </Typography>

                <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel id="day-select-label">Captcha: What day's today?</InputLabel>
                    <Select
                        labelId="day-select-label"
                        value={this.state.selectedDay}
                        onChange={this.handleDayChange}
                        label="Captcha: What day's today?"
                        required
                        style={{ fontSize: '16px' }}
                    >
                        <MenuItem value="Sunday">Sunday</MenuItem>
                        <MenuItem value="Monday">Monday</MenuItem>
                        <MenuItem value="Tuesday">Tuesday</MenuItem>
                        <MenuItem value="Wednesday">Wednesday</MenuItem>
                        <MenuItem value="Thursday">Thursday</MenuItem>
                        <MenuItem value="Friday">Friday</MenuItem>
                        <MenuItem value="Saturday">Saturday</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* Sign In Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={this.clickSubmit}
                fullWidth
                style={{ marginTop: '16px', padding: "0.8rem", borderRadius: "20px", fontWeight: "bold" }}
            >
                Sign In
            </Button>
        </form>
    );

    render() {
        const { email, password, error, redirectToReferer, loading } = this.state;
        if (redirectToReferer) {
            return <Redirect to="/" />;
        }
        return (
            <Container component="main" maxWidth="100%">
                <Paper elevation={3} style={{ padding: '20px', marginTop: '40px' }}>
                    {/* Title */}
                    <Typography
                        style={{
                            fontWeight: 700,
                            fontSize: '2rem',
                            color: '#333',
                            textShadow: '2px 2px 2px rgba(0, 0, 0, 0.1)',
                            margin: '20px 0',
                            letterSpacing: '1px',
                        }}
                        variant="h4"
                        align="center"
                        gutterBottom
                    >
                        Sign In
                    </Typography>

                    {/* SocialLogin */}
                    <SocialLogin />

                    <Divider style={{ margin: '20px 0' }} />

                    {error && (
                        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}
                    {this.signinForm(email, password, loading)}
                    {loading && <Loading />}

                    {/* Forgot Password Button */}
                    <Button
                        component={Link}
                        to="/forgot-password"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        style={{ marginTop: '10px', backgroundColor: "red", color: "white", borderRadius: "20px", fontWeight: "bold", fontSize: "12px" }}
                    >
                        Forgot Password
                    </Button>
                </Paper>
            </Container>
        );
    }
}

export default Signin;

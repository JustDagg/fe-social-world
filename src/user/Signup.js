import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SocialLogin from "./SocialLogin";
import Loading from '../loading/Loading';
import { Typography, TextField, Button, Container, Paper, Divider, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import { signup } from "../auth";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            university: "",
            birthYear: "",
            error: "",
            open: false,
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
            open: false,
            [e.target.name]: e.target.value
        });
    };

    // recaptchaHandler
    recaptchaHandler = e => {
        this.setState({ error: "" });
        let userDay = e.target.value.toLowerCase();
        let dayCount;

        if (userDay === "sunday") {
            dayCount = 0;
        } else if (userDay === "monday") {
            dayCount = 1;
        } else if (userDay === "tuesday") {
            dayCount = 2;
        } else if (userDay === "wednesday") {
            dayCount = 3;
        } else if (userDay === "thursday") {
            dayCount = 4;
        } else if (userDay === "friday") {
            dayCount = 5;
        } else if (userDay === "saturday") {
            dayCount = 6;
        }

        if (dayCount === new Date().getDay()) {
            this.setState({ recaptcha: true });
            return true;
        } else {
            this.setState({
                recaptcha: false
            });
            return false;
        }
    };

    // clickSubmit
    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true });
        const { name, email, password, university, birthYear, selectedDay, correctDay } = this.state;
        const user = { name, email, password, university, birthYear };

        if (selectedDay === correctDay) {
            signup(user)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        this.setState({
                            name: "",
                            email: "",
                            password: "",
                            university: "",
                            birthYear: "",
                            error: "",
                            open: true,
                            loading: false
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

    signupForm = (name, email, password, university, birthYear, loading, recaptcha) => (
        <form style={{ display: loading ? "none" : "" }}>

            {/* NAME FIELD */}
            <TextField
                label="Name"
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={this.handleChange}
                name="name"
                value={name}
                type="text"
                required
            />

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

            {/* UNIVERSITY FIELD */}
            <TextField
                label="University"
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={this.handleChange}
                name="university"
                value={university}
                type="text"
                required
            />

            {/* BIRTH YEAR FIELD */}
            <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="birthyear-select-label">Birth Year</InputLabel>
                <Select
                    labelId="birthyear-select-label"
                    value={birthYear}
                    onChange={this.handleChange}
                    name="birthYear"
                    label="Birth Year"
                    required
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200,
                                width: 150,
                            },
                        },
                    }}
                >
                    {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (v, i) => 1900 + i).map(year => (
                        <MenuItem key={year} value={year} style={{ fontSize: '14px' }}>
                            {year}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>


            {/* CAPCHA SELECT FIELD */}
            <div style={{ margin: '10px' }}>
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
            <Button
                variant="contained"
                color="primary"
                onClick={this.clickSubmit}
                fullWidth
                style={{ marginTop: '16px', padding: "0.8rem", borderRadius: "20px", fontWeight: "bold" }}
            >
                Sign Up
            </Button>
        </form>
    );

    render() {
        const { name, email, password, university, birthYear, error, open, loading, recaptcha } = this.state;
        return (
            <Container component="main" maxWidth="100%">
                <Paper elevation={3} style={{ padding: '20px', marginTop: '40px' }}>
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
                        Sign Up
                    </Typography>

                    <SocialLogin for="signup" />

                    <Divider style={{ margin: '20px 0' }} />

                    {error && (
                        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}
                    {open && (
                        <div className="alert alert-info" style={{ marginBottom: '20px' }}>
                            New account is successfully created. Please <Link to='/signin'>Sign In</Link>.
                        </div>
                    )}
                    {this.signupForm(name, email, password, university, birthYear, loading, recaptcha)}
                    {loading && <Loading />}
                </Paper>
            </Container>
        );
    }
}

export default Signup;

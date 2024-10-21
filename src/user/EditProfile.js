import React, { Component } from 'react';
import Loading from '../loading/Loading';
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';

import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";
import Footer from '../component/Footer';

class EditProfle extends Component {

    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            about: "",
            password: "",
            university: "",
            birthYear: "",
            loading: false,
            redirectToProfile: false,
            error: "",
            fileSize: 0
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                console.log("data", data)
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        university: data.university,
                        birthYear: data.birthYear,
                        error: "",
                        about: data.about,
                    });
                }
            })
    }

    componentDidMount() {
        this.userData = new FormData()
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    // isValid
    isValid = () => {
        const { name, email, password, fileSize } = this.state;
        const userId = this.props.match.params.userId;
        if (userId !== isAuthenticated().user._id) {
            this.setState({ error: "You are not authorized to do this !!", loading: false });
            return false;
        }

        if (fileSize > 1000000) {
            this.setState({ error: "File size should be less than 1 MB", loading: false });
            return false;
        }

        if (name.length === 0) {
            this.setState({ error: "Name is required", loading: false });
            return false;
        }
        //test regular expression with 'test' keyword
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({ error: "Please enter a valid email address.", loading: false });
            return false;
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({ error: "Password must be at least 6 characters long", loading: false });
            return false;
        }
        return true;
    }

    // handleChange
    handleChange = e => {
        const value = e.target.name === 'photo' ? e.target.files[0] : e.target.value;
        const fileSize = e.target.name === 'photo' ? e.target.files[0].size : 0;

        this.userData.set(e.target.name, value);

        this.setState({
            error: "",
            [e.target.name]: value,
            fileSize,
            previewUrl: e.target.name === 'photo' ? URL.createObjectURL(e.target.files[0]) : this.state.previewUrl
        });
    };

    // clickSubmit
    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true })
        if (this.isValid()) {
            //const { name, email, password } = this.state;
            //const user = { name, email, password: password || undefined };
            // console.log(user);
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, this.userData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        updateUser(data, () => {
                            this.setState({
                                redirectToProfile: true
                            });
                        })
                    }
                });
        }

    };

    signupForm = (name, email, university, birthYear, password, loading, about) => (
        <form style={{ padding: "0px 30px", marginBottom: "30px" }}>

            {/* PROFILE PHOTO FIELD */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    Profile Photo
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label
                        htmlFor="photo"
                        style={{
                            display: 'inline-block',
                            padding: '20px 40px',
                            backgroundColor: '#1a73e8',
                            color: '#fff',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginRight: '10px',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#185abc')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#1a73e8')}
                    >
                        <i className="fa fa-upload" style={{ marginRight: '8px' }}></i>
                        Upload Image
                    </label>
                    <input
                        id="photo"
                        onChange={this.handleChange}
                        name="photo"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    {this.state.previewUrl && (
                        <div style={{ marginLeft: '10px' }}>
                            <img
                                src={this.state.previewUrl}
                                alt="Preview"
                                style={{ height: '40px', width: 'auto', borderRadius: '4px' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* NAME FIELD */}
            <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    Name
                </label>
                <input
                    onChange={this.handleChange}
                    name="name"
                    type="text"
                    value={name}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        boxShadow: 'none',
                        transition: 'border 0.3s ease',
                        width: '100%',
                        outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #1a73e8'}
                    onBlur={(e) => e.target.style.border = '1px solid #dadce0'}
                />
            </div>

            {/* EMAIL FIELD */}
            <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    Email
                </label>
                <input
                    onChange={this.handleChange}
                    name="email"
                    type="email"
                    value={email}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        boxShadow: 'none',
                        transition: 'border 0.3s ease',
                        width: '100%',
                        outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #1a73e8'}
                    onBlur={(e) => e.target.style.border = '1px solid #dadce0'}
                />
            </div>

            {/* UNIVERSITY FIELD */}
            <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    University
                </label>
                <input
                    onChange={this.handleChange}
                    name="university"
                    type="text"
                    value={university}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        boxShadow: 'none',
                        transition: 'border 0.3s ease',
                        width: '100%',
                        outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #1a73e8'}
                    onBlur={(e) => e.target.style.border = '1px solid #dadce0'}
                />
            </div>

            {/* BIRTH YEAR FIELD */}
            <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    Birth Year
                </label>
                <select
                    onChange={this.handleChange}
                    name="birthYear"
                    value={birthYear}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        boxShadow: 'none',
                        transition: 'border 0.3s ease',
                        width: '100%',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #1a73e8'}
                    onBlur={(e) => e.target.style.border = '1px solid #dadce0'}
                >
                    {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, index) => 1900 + index).map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* ABOUT FIELD */}
            <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    About
                </label>
                <textarea
                    onChange={this.handleChange}
                    name="about"
                    value={about}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        boxShadow: 'none',
                        transition: 'border 0.3s ease',
                        width: '100%',
                        outline: 'none',
                        minHeight: '100px'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #1a73e8'}
                    onBlur={(e) => e.target.style.border = '1px solid #dadce0'}
                />
            </div>

            {/* PASSWORD FIELD */}
            <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    Password
                </label>
                <input
                    onChange={this.handleChange}
                    name="password"
                    type="password"
                    value={password}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        boxShadow: 'none',
                        transition: 'border 0.3s ease',
                        width: '100%',
                        outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #1a73e8'}
                    onBlur={(e) => e.target.style.border = '1px solid #dadce0'}
                />
            </div>

            {/* EDIT PROFILE POST BUTTON */}
            <button
                style={{
                    width: "100%",
                    marginTop: "20px",
                    borderRadius: "20px",
                    height: "3rem",
                    backgroundColor: "#D19616"
                }}
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary">
                Update Profile
            </button>

        </form>
    );

    render() {

        const { id, name, email, university, birthYear, password, loading, redirectToProfile, error, about } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`}></Redirect>
        }
        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <>
                <div className="container" style={{ maxWidth: "100%", minHeight: '100vh' }}>
                    {/* RETURN TO PROFILE */}
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
                        onClick={() => this.props.history.push(`/user/${id}`)}
                        className="btn btn-raised btn-secondary">
                        <i className="fas fa-arrow-left" style={{ marginRight: "15px" }}></i>
                        <span style={{ fontWeight: "bold" }}>Return to Profile</span>
                    </button>

                    {/* EDIT PROFILE TITLE */}
                    <h2
                        style={{ fontWeight: "bold" }}
                        className="mb-5 text-center">
                        Edit Profile
                        <i style={{ marginLeft: "15px" }} class="fa fa-user" aria-hidden="true"></i>
                    </h2>

                    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                        {error}
                    </div>

                    {/* Preview Image */}
                    <div style={{ padding: "0px 30px", marginBottom: "30px" }}>
                        <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block' }}>
                            Preview Image
                        </label>
                        <img
                            style={{ display: loading ? "none" : "", height: "200px", width: "auto" }}
                            className="img-thumbnail"
                            src={photoUrl}
                            onError={i => (i.target.src = DefaultProfile)}
                            alt={name}
                        />
                    </div>

                    {loading ? (
                        <Loading />
                    ) : (
                        this.signupForm(name, email, university, birthYear, password, loading, about)
                    )}

                </div>

                {/* Footer Field */}
                <Footer />
            </>
        );
    }
}

export default EditProfle;
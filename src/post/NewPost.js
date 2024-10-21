import React, { Component } from 'react';
import Loading from '../loading/Loading';
import { Redirect } from 'react-router-dom';
import Footer from '../component/Footer';

import { isAuthenticated } from "../auth";
import { create } from "./apiPost";
import NewDiscussionPost from './discussion/NewDiscussionPost';

class NewPost extends Component {

    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false,
            activeTab: 'post'
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
    }

    // isValid
    isValid = () => {
        const { title, body, fileSize, photo } = this.state;
        if (fileSize > 1000000) {
            this.setState({ error: "File size should be less than 1 MB", loading: false });
            return false;
        }
        // if (photo.length === 0) {
        //     this.setState({ error: "Photo is required", loading: false });
        //     return false;
        // }
        if (title.length === 0) {
            this.setState({ error: "Title is required", loading: false });
            return false;
        }
        if (body.length === 0) {
            this.setState({ error: "Body is required", loading: false });
            return false;
        }
        return true;
    }

    // handleChange
    handleChange = e => {
        const value = e.target.name === 'photo' ? e.target.files[0] : e.target.value;
        const fileSize = e.target.name === 'photo' ? e.target.files[0].size : 0;
        //Form Data method set
        this.postData.set(e.target.name, value);
        this.setState({
            error: "",
            [e.target.name]: value,
            fileSize
        });
    };

    // Method to handle tab change
    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    // clickSubmit
    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true })
        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            create(userId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        this.setState({
                            title: "",
                            body: "",
                            photo: "",
                            loading: false,
                            redirectToProfile: true
                        });
                        //console.log("NEW POST ",data);
                    }
                });
        }
    };

    // copyToClipboard
    copyToClipboard = () => {
        navigator.clipboard.writeText(this.state.body)
            .then(() => {
                this.setState({ tooltipVisible: true });
                setTimeout(() => {
                    this.setState({ tooltipVisible: false });
                }, 2000);
            })
            .catch(err => {
                console.error('Có lỗi xảy ra khi sao chép: ', err);
            });
    };

    newPostForm = (title, body, tooltipVisible) => (
        <form
            style={{
                maxWidth: '100%',
                margin: '10px auto',
                padding: '20px',
                backgroundColor: '#ffffff',
            }}
        >

            {/* PHOTO FIELD */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    Photo
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
                    {this.state.photo && (
                        <div style={{ marginLeft: '10px' }}>
                            <img
                                src={URL.createObjectURL(this.state.photo)}
                                alt="Preview"
                                style={{ height: '40px', width: 'auto', borderRadius: '4px' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* TITLE FIELD */}
            <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    Title
                </label>
                <input
                    onChange={this.handleChange}
                    name="title"
                    type="text"
                    className="form-control"
                    value={title}
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

            {/* DESCRIPTION FIELD */}
            <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    Description
                </label>
                <textarea
                    onChange={this.handleChange}
                    name="body"
                    className="form-control"
                    value={body}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        boxShadow: 'none',
                        transition: 'border 0.3s ease',
                        width: '100%',
                        outline: 'none',
                        minHeight: '100px',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #1a73e8'}
                    onBlur={(e) => e.target.style.border = '1px solid #dadce0'}
                />

                {/* body */}
                <div style={{ position: 'relative', marginTop: '20px' }}>
                    <div
                        style={{
                            padding: '25px',
                            border: '1px solid #dadce0',
                            borderRadius: '4px',
                            backgroundColor: '#f9f9f9',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            maxHeight: '500px',
                            overflowY: 'auto',
                            paddingRight: '50px'
                        }}
                    >
                        {body}
                    </div>

                    {/* Copy Button */}
                    <button
                        onClick={this.copyToClipboard}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '10px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <i className="fa fa-copy" style={{ fontSize: '20px', color: '#3897f0' }} />
                    </button>

                    {/* Tooltip */}
                    {tooltipVisible && (
                        <div style={{
                            position: 'absolute',
                            top: '35px',
                            right: '10px',
                            backgroundColor: '#333',
                            color: '#fff',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            zIndex: 1000,
                            whiteSpace: 'nowrap'
                        }}>
                            Copied!
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE POST BUTTON */}
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
                Create Post
            </button>

        </form>
    );

    render() {
        const { user, loading, error, redirectToProfile, activeTab } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />;
        }

        return (
            <>
                <div className="container" style={{ maxWidth: "100%", minHeight: '100vh' }}>
                    {/* RETURN TO HOME PAGE BUTTON */}
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
                        onClick={() => this.props.history.push('/')}
                        className="btn btn-raised btn-secondary">
                        <i className="fas fa-arrow-left" style={{ marginRight: "15px" }}></i>
                        <span style={{ fontWeight: "bold" }}>Return to Home Page</span>
                    </button>

                    {/* CREATE POST TITLE */}
                    <h2 style={{ fontWeight: "bold" }} className="mb-5 text-center">
                        Create a new post
                        <i style={{ marginLeft: "15px" }} className="fa fa-picture-o" aria-hidden="true"></i>
                    </h2>

                    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                        {error}
                    </div>

                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <button
                                onClick={() => this.handleTabChange('post')}
                                style={{
                                    flex: 1,
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    background: activeTab === 'post' ? '#D19616' : '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '25px 25px 0 0',
                                    boxShadow: activeTab === 'post' ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                                    color: activeTab === 'post' ? '#fff' : '#333',
                                    fontSize: '16px',
                                    transition: 'background 0.3s ease, transform 0.2s ease',
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                New Post
                                {activeTab === 'post' && <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '3px', background: '#fff' }} />}
                            </button>
                            <button
                                onClick={() => this.handleTabChange('discussion')}
                                style={{
                                    flex: 1,
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    background: activeTab === 'discussion' ? '#D19616' : '#f0f0f0',
                                    border: 'none',
                                    borderRadius: '25px 25px 0 0',
                                    boxShadow: activeTab === 'discussion' ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                                    color: activeTab === 'discussion' ? '#fff' : '#333',
                                    fontSize: '16px',
                                    transition: 'background 0.3s ease, transform 0.2s ease',
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                New Discussion Post
                                {activeTab === 'discussion' && <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '3px', background: '#fff' }} />}
                            </button>
                        </div>

                        {/* Active Tab Content Wrapper */}
                        <div style={{
                            border: '5px solid #D19616',
                            borderRadius: '0 0 15px 15px',
                            padding: '20px',
                            height: '1000px',
                            width: '100%',
                            marginTop: '-1px', 
                            background: '#fff'
                        }}>
                            {loading ? (
                                <Loading />
                            ) : (
                                activeTab === 'post' ? this.newPostForm(this.state.title, this.state.body) : <NewDiscussionPost />
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Field */}
                <Footer />
            </>
        );
    }
}

export default NewPost;
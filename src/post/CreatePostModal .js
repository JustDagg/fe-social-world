import React, { Component, createRef } from 'react';
import ReactDOM from 'react-dom';
import Loading from '../loading/Loading';
import { Divider } from '@material-ui/core';

import { isAuthenticated } from "../auth";
import { create } from "./apiPost";

class CreatePostModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            body: "",
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            loading: false
        };
        this.modalRef = createRef();
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    // handleClickOutside
    handleClickOutside = (e) => {
        if (this.modalRef.current && !this.modalRef.current.contains(e.target)) {
            this.props.onClose();
        }
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
        this.postData.set(e.target.name, value);
        this.setState({
            error: "",
            [e.target.name]: value,
            fileSize
        });
    };

    // clickSubmit
    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true });
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
                            loading: false
                        });
                        this.props.onClose();
                    }
                });
        }
    };

    newPostForm = (title, body) => (
        <form>
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
                        minHeight: '100px'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #1a73e8'}
                    onBlur={(e) => e.target.style.border = '1px solid #dadce0'}
                />
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
        const { title, body, loading, error } = this.state;
        const { isOpen, onClose } = this.props;

        if (!isOpen) return null;

        return ReactDOM.createPortal(
            <div style={styles.overlay}>
                <div ref={this.modalRef} style={styles.modal}>
                    {/* CloseButton */}
                    <button onClick={onClose} style={styles.closeButton}>X</button>
                    {/* Title */}
                    <h2 style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>Create a New Post</h2>
                    <Divider style={{ marginBottom: "20px" }} />
                    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                        {error}
                    </div>
                    {loading ? (
                        <Loading />
                    ) : (
                        // Render Form
                        this.newPostForm(title, body)
                    )}
                </div>
            </div>,
            document.body
        );
    }
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '700px',
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
    },
};

export default CreatePostModal;

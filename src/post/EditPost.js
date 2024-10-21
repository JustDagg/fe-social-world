import React, { Component } from 'react';
import Loading from '../loading/Loading';
import { Redirect } from 'react-router-dom';

import { isAuthenticated } from "../auth";
import { singlePost, update } from './apiPost';
import Footer from '../component/Footer';

class EditProfle extends Component {

    constructor() {
        super();
        this.state = {
            id: '',
            title: '',
            body: '',
            photo: '',
            postedBy: '',
            redirectToPost: false,
            error: '',
            loading: false,
            fileSize: 0
        }
    }

    init = (postId) => {
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToPost: true })
                } else {
                    this.setState({
                        id: data._id,
                        title: data.title,
                        body: data.body,
                        photo: data.photo,
                        postedBy: data.postedBy._id,
                        error: ""
                    });
                }
            })
    }

    componentDidMount() {
        this.postData = new FormData()
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    // isValid
    isValid = () => {
        const { title, body, fileSize, photo, postedBy } = this.state;
        if (postedBy !== isAuthenticated().user._id) {
            this.setState({ error: "You are not authorized to do this !!", loading: false });
            return false;
        }

        if (fileSize > 200000) {
            this.setState({ error: "File size should be less than 200 KB", loading: false });
            return false;
        }
        if (photo.length === 0) {
            this.setState({ error: "Photo is required", loading: false });
            return false;
        }
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
            fileSize,
            previewUrl: e.target.name === 'photo' ? URL.createObjectURL(e.target.files[0]) : this.state.previewUrl
        });
    };

    // clickSubmit
    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true })
        if (this.isValid()) {
            const postId = this.state.id;
            const token = isAuthenticated().token;
            update(postId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        this.setState({
                            title: "",
                            body: "",
                            photo: "",
                            loading: false,
                            redirectToPost: true
                        });
                    }
                });
        }
    };

    editPostForm = (title, body) => (
        <form style={{ padding: "0px 30px", marginBottom: "30px" }}>

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
                    onFocus={(e) => (e.target.style.border = '1px solid #1a73e8')}
                    onBlur={(e) => (e.target.style.border = '1px solid #dadce0')}
                />
            </div>

            {/* DESCRIPTION FIELD */}
            <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                    Description
                </label>
                <textarea
                    onChange={this.handleChange}
                    type="text"
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
                    onFocus={(e) => (e.target.style.border = '1px solid #1a73e8')}
                    onBlur={(e) => (e.target.style.border = '1px solid #dadce0')}
                />
            </div>

            {/* EDIT POST BUTTON */}
            <button
                style={{
                    width: "100%",
                    marginTop: "20px",
                    borderRadius: "20px",
                    height: "3rem",
                    backgroundColor: "#D19616",
                    color: "white"
                }}
                onClick={this.clickSubmit}
                className="btn btn-raised">
                Edit Post
            </button>

        </form>
    );

    render() {
        const { id, title, body, loading, redirectToPost, error } = this.state;
        if (redirectToPost) {
            return <Redirect to={`/post/${id}`}></Redirect>
        }
        const photoUrl = `${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`;

        return (
            <>
                <div className="container" style={{ maxWidth: "100%", minHeight: '100vh' }}>
                    {/* RETURN TO POST {id} PAGE BUTTON */}
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
                        onClick={() => this.props.history.push(`/post/${id}`)}
                        className="btn btn-raised btn-secondary">
                        <i className="fas fa-arrow-left" style={{ marginRight: "15px" }}></i>
                        <span style={{ fontWeight: "bold" }}>Return to Post Page</span>
                    </button>

                    {/* EDIT POST TITLE */}
                    <h2
                        style={{ fontWeight: "bold" }}
                        className="mb-5 text-center">
                        Edit Post
                        <i style={{ marginLeft: "15px" }} class="fa fa-picture-o" aria-hidden="true"></i>
                    </h2>

                    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                        {error}
                    </div>

                    {/* Preview Image */}
                    <div style={{ padding: "0px 30px", marginBottom: "30px" }}>
                        <label style={{ fontWeight: '500', fontSize: '14px', color: '#5f6368', display: 'block', marginBottom: '8px' }}>
                            Preview Image
                        </label>
                        <img
                            style={{ display: loading ? "none" : "", height: "200px", width: "auto" }}
                            className="img-thumbnail"
                            src={photoUrl}
                            alt={title}
                        />
                    </div>
                    {loading ? (
                        <Loading />
                    ) : (
                        this.editPostForm(title, body)
                    )}
                </div>

                {/* Footer Field */}
                <Footer />
            </>
        )
    }
}

export default EditProfle;
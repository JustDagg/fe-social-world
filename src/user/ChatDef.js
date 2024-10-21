import React, { Component } from 'react';
import DefaultProfile from '../images/avatar.jpg';
import Loading from '../loading/Loading';
import { Link } from 'react-router-dom';
import Footer from '../component/Footer';
import { isAuthenticated } from "../auth";
import { read, getChatList } from './apiUser';
import '../css/ChatDef.css';

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            sender: {},
            chatList: [],
            loading: false,
            searchTerm: '',
        };
    }

    init = async (userId) => {
        const token = isAuthenticated().token;
        const user = await read(userId, token);
        if (user.error) {
            console.log(user.error);
        } else {
            return user;
        }
    };

    async componentDidMount() {
        this.setState({ loading: true });
        const senderId = this.props.match.params.userId;
        const chatList = await getChatList(senderId);
        console.log("Chat List", chatList);
        if (chatList.error) {
            console.log(chatList.error);
        } else {
            this.setState({ loading: false, chatList: chatList });
        }

        const sender = await this.init(senderId);
        this.setState({ sender });
    }

    // Function to handle search input change
    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    render() {
        const { chatList, sender, loading, searchTerm } = this.state;

        // Filtered chat list based on search term
        const filteredChatList = chatList.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

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
                        className="btn btn-raised btn-secondary"
                    >
                        <i className="fas fa-arrow-left" style={{ marginRight: "15px" }}></i>
                        <span style={{ fontWeight: "bold" }}>
                            Return to Home Page
                        </span>
                    </button>

                    {/* TITLE */}
                    <h2
                        style={{ fontWeight: "bold" }}
                        className="mb-5 text-center"
                    >
                        <span>Message</span>
                        <i style={{ marginLeft: "15px" }} className="fas fa-comment-alt"></i>
                    </h2>

                    {loading ? <Loading /> : null}

                    {/* SEARCH USER BAR */}
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <input
                            type="text"
                            placeholder="Search users by name"
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                            style={{
                                width: '1000px',
                                padding: "15px 26px",
                                borderRadius: "20px",
                                border: "1px solid black",
                                background: "#f9f9f9",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out",
                                outline: "none"
                            }}
                        />
                    </div>

                    {/* CHAT LIST */}
                    <div className="chat-content1" style={{ display: loading ? "none" : "", padding: "0px 30px", marginBottom: "30px" }}>
                        <div className="users-container1">
                            <ul className="users1">
                                {filteredChatList.length === 0 ? (
                                    <p className="text-center no-chats1">
                                        <strong>No chats found.</strong>
                                        <br />
                                        Go to someone's profile from
                                        <Link to="/findpeople"> Find Friends </Link>
                                        tab or from your
                                        <Link to={`/user/${isAuthenticated().user._id}`}> Followers / Following </Link>
                                        tab and click message button to start chatting.
                                    </p>
                                ) : null}
                                {filteredChatList.map((user, i) => (
                                    <a
                                        style={{ textDecoration: 'none' }}
                                        key={i}
                                        href={`/chat/${sender._id}/${user._id}`}
                                        className="chat-item1"
                                    >
                                        <div className="chat-avatar1">
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                                                alt={user.name}
                                                onError={i => (i.target.src = DefaultProfile)}
                                            />
                                        </div>
                                        <div className="chat-info1" style={{ display: 'flex' }}>
                                            <span className="chat-name1" style={{ fontWeight: 'bold' }}>
                                                @{user.name}
                                            </span>
                                            <span className="chat-university1" style={{ color: '#555', fontSize: '14px', marginLeft: '10px' }}>
                                                {user.university}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Field */}
                <Footer />
            </>
        );
    }
}

export default Chat;

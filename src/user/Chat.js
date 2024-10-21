import React, { Component } from 'react';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';
import Loading from '../loading/Loading';
import DefaultProfile from '../images/avatar.jpg';
import { DisplayDateTime12Hour } from '../post/timeDifference';
import { Link } from 'react-router-dom';

import { isAuthenticated } from '../auth/index';
import { read, getChats, getChatList } from './apiUser';
import '../css/Chat.css';

const socketUrl = `${process.env.REACT_APP_API_URL}`;
let socket;

class Chat extends Component {
    constructor() {
        super();
        this.messagesEndRef = React.createRef();
        this.state = {
            message: "",
            messages: [],
            sender: {},
            receiver: {},
            loading: false,
            showPicker: false,
            currentUser: {}, // Added state for the current user
            chatList: [], // Initialize as an empty array
            selectedIcon: '❤️',
            showEmojiSettings: false,
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
        const senderId = this.props.match.params.user1Id;
        const receiverId = this.props.match.params.user2Id;

        const data = await getChats(senderId, receiverId);
        const chatList = await getChatList(senderId);

        if (data.error || chatList.error) {
            console.log(data.error || chatList.error);
        } else {
            const sender = await this.init(senderId);
            const receiver = await this.init(receiverId);
            const currentUser = isAuthenticated().user; // Get the logged-in user

            this.setState({
                messages: data,
                sender,
                receiver,
                currentUser, // Set the current user in state
                chatList: chatList, // Set chatList in state
                loading: false
            });
            this.initSocket();
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    initSocket = () => {
        socket = io(socketUrl);
        socket.on('connect', () => {
            socket.emit('userInfo', this.state.sender);
        });
        socket.on('message', (newChat) => {
            if (newChat.sender._id === this.state.receiver._id || newChat.sender._id === this.state.sender._id) {
                this.setState({ messages: [...this.state.messages, newChat] });
            }
        });
    }

    // sendMessage
    sendMessage = (e) => {
        e.preventDefault();
        if (this.state.message) {
            socket.emit('sendMessage', this.state.message, this.state.sender, this.state.receiver, () => {
                this.setState({ message: '', showPicker: false });
            });
        }
    }

    // onEmojiClick
    onEmojiClick = (event, emojiObject) => {
        this.setState(prevState => ({
            message: prevState.message + emojiObject.emoji,
            showPicker: false
        }));
    }

    // changeIcon
    changeIcon = (emoji) => {
        this.setState({ selectedIcon: emoji, showEmojiSettings: false });
    }

    // renderChat
    renderChat = (chat, i) => {
        const isSender = chat.sender._id === isAuthenticated().user._id;

        return (
            <li key={i} className={`chat-message ${isSender ? "right" : "left"}`}>
                {!isSender && (
                    <div className="chat-avatar">
                        <img
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${chat.sender._id}`}
                            alt={chat.sender.name || "Sender"}
                            onError={i => (i.target.src = DefaultProfile)}
                        />
                        <div className="chat-time">{DisplayDateTime12Hour(new Date(chat.time))}</div>
                    </div>
                )}
                <div className="chat-content">
                    {!isSender && (
                        <div className="chat-info">
                            <span className="chat-name">{chat.sender.name || "Unknown Sender"}</span>
                        </div>
                    )}
                    <div className="chat-text">{chat.message}</div>
                    <div className="chat-time">{DisplayDateTime12Hour(new Date(chat.time))}</div>
                </div>
            </li>
        );
    };

    render() {
        const { messages, receiver, sender, showPicker, loading, currentUser, chatList, showEmojiSettings, selectedIcon } = this.state;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                {loading && <Loading />}
                <div style={{ display: loading ? "none" : "flex", flex: 1 }}>
                    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                        <div style={{
                            width: '250px',
                            borderRight: '1px solid #ddd',
                            padding: '30px',
                            overflowY: 'auto',
                            backgroundColor: 'white'
                        }}>
                            <div style={{ marginBottom: '20px' }}>
                                {currentUser && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${currentUser._id}`}
                                            alt={currentUser.name}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px', objectFit: "contain" }}
                                        />
                                        <div>
                                            <span style={{ fontWeight: 'bold' }}>{currentUser.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <h6 style={{ margin: '20px 0 5px', fontSize: '16px', color: '#007bff' }}>Chat</h6>

                            <div>
                                {chatList.map((user, i) => (
                                    <a key={i} href={`/chat/${sender._id}/${user._id}`} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        color: '#000',
                                        padding: '10px 0'
                                    }}>
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                                            alt={user.name}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', objectFit: 'contain' }}
                                        />
                                        <div>
                                            <span style={{ fontWeight: 'bold' }}>{user.name}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px',
                            backgroundColor: 'white'
                        }}>
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #ddd' }}>
                                {receiver && (
                                    <Link to={`/user/${receiver._id}`} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        color: '#000',
                                        padding: '10px 0'
                                    }}>
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${receiver._id}`}
                                            alt={receiver.name}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', objectFit: 'contain' }}
                                        />
                                        <div>
                                            <span
                                                style={{
                                                    fontWeight: 'bold',
                                                    transition: 'color 0.3s ease',
                                                }}
                                                className="receiver-name"
                                            >
                                                {receiver.name}
                                            </span>
                                        </div>
                                    </Link>
                                )}

                                {/* Change Icon Setting */}
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onMouseEnter={() => this.setState({ showTooltip: true })}
                                        onMouseLeave={() => this.setState({ showTooltip: false })}
                                        onClick={() => this.setState({ showEmojiSettings: !showEmojiSettings })}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '20px',
                                            color: 'black',
                                            marginRight: '10px'
                                        }}
                                    >
                                        <i className="fas fa-cog"></i>
                                    </button>
                                    {this.state.showTooltip && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '40px',
                                            right: '0',
                                            backgroundColor: '#fff',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '8px 12px',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                            zIndex: 1000,
                                            fontSize: '12px',
                                            color: '#333',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            Change Emoji
                                        </div>
                                    )}
                                </div>

                                {/* Emoji Settings Dropdown */}
                                {showEmojiSettings && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '50px',
                                        right: '0px',
                                        backgroundColor: '#fff',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        padding: '10px',
                                        zIndex: 1000,
                                    }}>
                                        <h6
                                            style={{
                                                marginBottom: '15px',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                borderBottom: '2px solid black',
                                                textAlign: 'center',
                                                padding: '5px'
                                            }}
                                        >
                                            Change Emoji
                                        </h6>
                                        <div style={{ display: 'flex' }}>
                                            {['😊', '😂', '❤️', '👍', '😢'].map((emoji, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => this.changeIcon(emoji)}
                                                    style={{
                                                        fontSize: '24px',
                                                        cursor: 'pointer',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        marginRight: '10px',
                                                    }}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* <ScrollToBottom style={{
                                flex: 1,
                                overflowY: 'auto',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                padding: '10px',
                                marginBottom: '10px'
                            }}>
                                <ul style={{
                                    listStyleType: 'none',
                                    padding: 0,
                                    margin: 0,
                                    overflow: 'hidden'
                                }}>
                                    {messages.map(this.renderChat)}
                                    <div ref={this.messagesEndRef} />
                                </ul>
                            </ScrollToBottom> */}

                            {/* Chat Window */}
                            <div
                                style={{
                                    flex: 1,
                                    overflowY: 'auto',  // Allows scrolling manually
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    maxHeight: '450px', // Limit the height to create a scrollable window effect
                                }}
                            >
                                <ul
                                    style={{
                                        listStyleType: 'none',
                                        padding: 0,
                                        margin: 0,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {messages.map(this.renderChat)}
                                    <div ref={this.messagesEndRef} />
                                </ul>
                            </div>

                            {/* FORM INPUT TEXT MESSAGE AND EMOJI */}
                            <div style={{ maxWidth: "100%", marginLeft: "30px", marginRight: "30px" }} className="chat-input">
                                <form onSubmit={this.sendMessage} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: "10px" }}>
                                        {/* Chat Input */}
                                        <input
                                            type="text"
                                            style={{
                                                flex: 1,
                                                padding: "12px 16px",
                                                border: "1px solid #ddd",
                                                borderRadius: "25px",
                                                fontSize: "16px",
                                                outline: "none",
                                                boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
                                                transition: "border-color 0.3s",
                                            }}
                                            placeholder="Your message..."
                                            value={this.state.message}
                                            name="message"
                                            onChange={e => this.setState({ message: e.target.value })}
                                            onFocus={(e) => e.target.style.borderColor = "#007bff"}
                                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                                        />

                                        {/* Emoji Button */}
                                        <button
                                            type="button"
                                            onClick={() => this.setState({ showPicker: !showPicker })}
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "20px",
                                                color: "#007bff",
                                                marginLeft: "10px",
                                                transition: "color 0.3s",
                                            }}
                                        >
                                            <i className="far fa-smile"></i>
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', width: '100%' }}>
                                        {/* Send Button */}
                                        <button
                                            type="submit"
                                            style={{
                                                width: "95%",
                                                padding: "10px 20px",
                                                border: "none",
                                                borderRadius: "25px",
                                                backgroundColor: "#007bff",
                                                color: "#fff",
                                                fontSize: "16px",
                                                cursor: "pointer",
                                                transition: "background-color 0.3s",
                                                flexShrink: 0,
                                            }}
                                        >
                                            Send
                                        </button>

                                        {/* Heart Emoji Reaction Icon (Right of Send Button) */}
                                        <button
                                            type="button"
                                            onClick={() => this.setState(prevState => ({ message: prevState.message + selectedIcon }))}
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "24px",
                                                marginLeft: '10px',
                                                color: '#007bff',
                                            }}
                                        >
                                            {selectedIcon}
                                        </button>
                                    </div>
                                </form>
                                {showPicker && <Picker onEmojiClick={this.onEmojiClick} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Chat;

import React, { Component } from 'react';
import {
    Box,
    Button,
    Divider,
    Modal,
    Tooltip,
    Typography
} from '../../node_modules/@material-ui/core/index';
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
            currentUser: {},
            chatList: [],
            selectedIcon: '❤️',
            showEmojiSettings: false,
            isDarkMode: false,
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
            const currentUser = isAuthenticated().user;

            this.setState({
                messages: data,
                sender,
                receiver,
                currentUser,
                chatList: chatList,
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

    toggleEmojiSettings = () => {
        this.setState({ showEmojiSettings: !this.state.showEmojiSettings });
    };

    changeIcon = (emoji) => {
        this.setState({ selectedIcon: emoji, showEmojiSettings: false });
    };

    toggleDarkMode = () => {
        this.setState({ isDarkMode: !this.state.isDarkMode });
    };

    toggleTheme = () => {
        this.setState((prevState) => ({
            isDarkMode: !prevState.isDarkMode,
        }));
    };

    render() {
        const { messages, receiver, sender, showPicker, loading, currentUser, chatList, showEmojiSettings, selectedIcon, isDarkMode } = this.state;

        const containerStyle = {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '0px',
            backgroundColor: isDarkMode ? '#333' : 'white',
            color: isDarkMode ? 'white' : '#333',
        };

        const buttonStyle = {
            marginTop: '20px',
            padding: '10px 20px',
            color: isDarkMode ? 'black' : 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            background: isDarkMode ? 'white' : 'black',
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                {loading && <Loading />}
                <div style={{ display: loading ? "none" : "flex", flex: 1 }}>
                    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                        <div style={{
                            width: '250px',
                            borderRight: '1px solid #ddd',
                            padding: '10px',
                            overflowY: 'auto',
                            backgroundColor: isDarkMode ? '#333' : 'white',
                        }}>
                            <div style={{ padding: '20px', marginBottom: '10px' }}>
                                {currentUser && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${currentUser._id}`}
                                            alt={currentUser.name}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', objectFit: 'contain' }}
                                        />
                                        <div>
                                            <span style={{ fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>{currentUser.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <h6 style={{ margin: '5px 10px 10px', fontSize: '16px', color: '#007bff', fontWeight: 'bold' }}>Chat</h6>

                            <div>
                                {chatList.map((user, i) => (
                                    <a
                                        key={i}
                                        href={`/chat/${sender._id}/${user._id}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textDecoration: 'none',
                                            color: '#000',
                                            padding: '10px 10px',
                                            borderRadius: '8px',
                                            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#f0f0f0';
                                            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '';
                                            e.target.style.boxShadow = '';
                                        }}
                                    >
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                                            alt={user.name}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                                objectFit: 'contain'
                                            }}
                                        />
                                        <div>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: isDarkMode ? 'white' : 'black'
                                            }}>
                                                {user.name}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div style={containerStyle}>
                            <Box
                                sx={{
                                    mx: 2,
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
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
                                                    color: isDarkMode ? 'white' : 'black'
                                                }}
                                                className="receiver-name"
                                            >
                                                {receiver.name}
                                            </span>
                                        </div>
                                    </Link>
                                )}

                                {/* Change Icon Setting */}
                                <Box sx={{ position: 'relative', gap: 5, display: 'flex', p: 2 }}>
                                    <Tooltip title="Change Emoji" arrow placement={"top"}>
                                        <button
                                            onClick={() => this.setState({ showEmojiSettings: !showEmojiSettings })}
                                            style={buttonStyle}
                                        >
                                            <i className="fas fa-cog"
                                                style={{
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '20px',
                                                }}
                                            ></i>
                                        </button>
                                    </Tooltip>

                                    {/* Change theme button */}
                                    <Tooltip title="Dark Mode" arrow placement={"top"}>
                                        <button
                                            style={buttonStyle}
                                            onClick={this.toggleTheme}
                                        >
                                            <i className={`fa ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}
                                                style={{
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '20px',
                                                }}
                                            />
                                        </button>
                                    </Tooltip>
                                </Box>

                                {/* Emoji Settings Dropdown */}
                                <Modal
                                    open={this.state.showEmojiSettings}
                                    onClose={this.toggleEmojiSettings}
                                    aria-labelledby="emoji-settings-modal"
                                    aria-describedby="modal-to-change-emoji"
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            width: 500,
                                            bgcolor: "background.paper",
                                            boxShadow: 24,
                                            borderRadius: "15px",
                                            maxHeight: '80vh',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                backgroundColor: '#D19616',
                                                p: 2,
                                                boxShadow: 3,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                component="h2"
                                                style={{
                                                    fontWeight: 'bold',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Change Emoji
                                            </Typography>
                                        </Box>

                                        <div
                                            style={{
                                                padding: '20px',
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(5, 1fr)',
                                                gap: '20px',
                                                background: 'linear-gradient(145deg, #f4f7fc, #e2e8f0)',
                                                borderRadius: '16px',
                                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                                maxWidth: '600px',
                                                margin: 'auto',
                                            }}
                                        >
                                            {[
                                                { emoji: '😊', label: 'Happy' },
                                                { emoji: '😂', label: 'Laughing' },
                                                { emoji: '❤️', label: 'Love' },
                                                { emoji: '👍', label: 'Like' },
                                                { emoji: '😢', label: 'Sad' },
                                                { emoji: '😎', label: 'Cool' },
                                                { emoji: '😍', label: 'In Love' },
                                                { emoji: '😜', label: 'Playful' },
                                                { emoji: '😇', label: 'Innocent' },
                                                { emoji: '🤩', label: 'Starstruck' },
                                                { emoji: '😏', label: 'Smirk' },
                                                { emoji: '🤔', label: 'Thinking' },
                                                { emoji: '🙃', label: 'Upside' },
                                                { emoji: '🤗', label: 'Hugging' },
                                                { emoji: '😋', label: 'Yummy' },
                                                { emoji: '🥺', label: 'Pleading' },
                                                { emoji: '🥳', label: 'Partying' },
                                                { emoji: '💪', label: 'Strong' },
                                                { emoji: '😱', label: 'Shocked' },
                                                { emoji: '🤤', label: 'Drooling' },
                                            ].map((item, index) => (
                                                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Button
                                                        onClick={() => this.changeIcon(item.emoji)}
                                                        style={{
                                                            fontSize: '20px',
                                                            cursor: 'pointer',
                                                            background: '#fff',
                                                            border: '2px solid #ddd',
                                                            borderRadius: '50%',
                                                            padding: '10px',
                                                            transition: 'all 0.3s ease-in-out',
                                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                            '&:hover': {
                                                                backgroundColor: '#007bff',
                                                                color: '#fff',
                                                                borderColor: '#0056b3',
                                                                transform: 'scale(1.1)',
                                                                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                                                            },
                                                        }}
                                                    >
                                                        {item.emoji}
                                                    </Button>
                                                    <div
                                                        style={{
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            color: '#333',
                                                            transition: 'color 0.3s ease',
                                                            textTransform: 'capitalize',
                                                            marginTop: '8px',
                                                        }}
                                                    >
                                                        {item.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Box>
                                </Modal>

                            </Box>

                            <Divider />

                            {/* Chat Window */}
                            <div
                                style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    backgroundColor: '#fff',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    maxHeight: '450px',
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
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#D19616'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
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

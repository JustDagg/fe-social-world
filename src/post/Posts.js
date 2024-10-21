import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';
import DefaultProfile from '../images/avatar.jpg';
import { timeDifference } from './timeDifference';
import InfiniteScroll from 'react-infinite-scroll-component';
import { list, countTotalPosts, fetchDiscussionPosts } from './apiPost';
import { isAuthenticated } from '../auth';
import DiscussionPostsList from './discussion/DiscussionPostsList';

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            skip: 0,
            hasMore: true,
            count: 0,
            discussion: [],
            activeTab: 'posts', // Track the active tab
        };
    }

    fetchData = async () => {
        if (this.state.posts.length >= this.state.count) {
            this.setState({ hasMore: false });
            return;
        }
        const data = await list(this.state.skip);

        if (data.error) {
            console.log(data.error);
        } else {
            const joinedArray = this.state.posts.concat(data);
            this.setState({ posts: joinedArray }, this.updateSkip);
        }
    };

    async componentDidMount() {
        const count = await countTotalPosts();
        this.setState({ count: count.data });
        this.fetchData();

        // Fetch discussion posts here
        const discussionData = await fetchDiscussionPosts();
        this.setState({ discussion: discussionData });
    }

    updateSkip = () => {
        this.setState({ skip: this.state.posts.length });
    };

    renderPosts = (posts) => {
        const { user } = isAuthenticated();

        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <InfiniteScroll
                    dataLength={posts.length}
                    next={this.fetchData}
                    hasMore={this.state.hasMore}
                    loader={<Loading />}
                    style={{ width: '100%' }}
                >
                    {posts.map((post, i) => {
                        const posterId = post.postedBy ? post.postedBy._id : '';
                        const posterName = post.postedBy ? post.postedBy.name : 'Unknown';
                        return (
                            <div key={i} style={{
                                borderRadius: '8px',
                                border: '1px solid #dbdbdb',
                                marginBottom: '30px',
                                width: '100%',
                                maxWidth: '600px',
                                backgroundColor: 'white',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '16px',
                                }}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                                        onError={i => (i.target.src = DefaultProfile)}
                                        alt={posterName}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            marginRight: '10px',
                                            objectFit: 'contain',
                                        }}
                                    />
                                    <Link
                                        to={user ? `/user/${posterId}` : '/signin'}
                                        style={{
                                            color: '#262626',
                                            textDecoration: 'none',
                                        }}>
                                        <h5 style={{ alignItems: 'center' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{posterName}</span>
                                            <i
                                                style={{
                                                    marginLeft: '5px',
                                                    fontSize: '10px',
                                                    color: '#3897f0',
                                                    verticalAlign: 'top',
                                                }}
                                                className="fa fa-check-circle"
                                                aria-hidden="true">
                                            </i>
                                        </h5>
                                    </Link>
                                    <p style={{ marginLeft: 'auto', color: '#8e8e8e', fontSize: '15px' }}>
                                        <i style={{ marginRight: '5px' }} className="far fa-clock"></i>
                                        {timeDifference(new Date(), new Date(post.created))}
                                    </p>
                                </div>

                                {post.photo && post.photo.data ? (
                                    <Link
                                        to={user ? `/post/${post._id}` : '/signin'}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                            alt={post.title}
                                            style={{
                                                width: '100%',
                                                maxHeight: '700px',
                                                objectFit: 'cover',
                                                backgroundColor: '#fafafa',
                                            }}
                                            onError={i => (i.target.src = DefaultProfile)}
                                        />
                                    </Link>
                                ) : null}

                                <div style={{ padding: '16px' }}>
                                    <Link to={`/user/${posterId}`} style={{
                                        color: '#262626',
                                        textDecoration: 'none',
                                    }}>
                                        <h5 style={{ alignItems: 'center' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '23px' }}>{posterName}</span>
                                            <i
                                                style={{
                                                    marginLeft: '5px',
                                                    fontSize: '14px',
                                                    color: '#3897f0',
                                                    verticalAlign: 'top',
                                                }}
                                                className="fa fa-check-circle"
                                                aria-hidden="true">
                                            </i>
                                        </h5>
                                    </Link>

                                    <h5 style={{ fontWeight: 'bold' }}>{post.title}</h5>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                        <Link
                                            to={user ? `/post/${post._id}` : '/signin'}
                                            style={{
                                                color: '#3897f0',
                                                textDecoration: 'none',
                                                fontWeight: 'bold',
                                            }}>
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </InfiniteScroll>
            </div>
        );
    };

    // Method to toggle the active tab
    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    render() {
        const { posts, discussion, activeTab } = this.state;
        const { user } = isAuthenticated();

        return (
            <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    {/* BUTTON HANDLE TAB CHANGE */}
                    {/* Posts Tab */}
                    <button
                        onClick={() => this.handleTabChange('posts')}
                        style={{
                            padding: '10px 100px',
                            border: activeTab === 'posts' ? '2px solid #3897f0' : '2px solid transparent',
                            backgroundColor: activeTab === 'posts' ? '#f0f8ff' : 'white',
                            color: activeTab === 'posts' ? '#3897f0' : '#262626',
                            cursor: 'pointer',
                            fontWeight: activeTab === 'posts' ? 'bold' : 'normal',
                            borderRadius: '20px',
                            transition: 'background-color 0.3s, color 0.3s',
                        }}
                    >
                        Posts
                    </button>

                    {/* Conditionally discussion tab if user is authenticated */}
                    {user && (
                        <button
                            onClick={() => this.handleTabChange('discussion')}
                            style={{
                                padding: '10px 100px',
                                border: activeTab === 'discussion' ? '2px solid #3897f0' : '2px solid transparent',
                                backgroundColor: activeTab === 'discussion' ? '#f0f8ff' : 'white',
                                color: activeTab === 'discussion' ? '#3897f0' : '#262626',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'discussion' ? 'bold' : 'normal',
                                borderRadius: '20px',
                                transition: 'background-color 0.3s, color 0.3s',
                                marginLeft: '10px',
                            }}
                        >
                            Discussion
                        </button>
                    )}
                </div>

                {!posts.length && !discussion.length ? (
                    <Loading />
                ) : (
                    <>
                        {activeTab === 'posts' && this.renderPosts(posts)}
                        {activeTab === 'discussion' && <DiscussionPostsList posts={discussion} />}
                    </>
                )}
            </div>
        );
    }
}

export default Posts;


// POSTS
// create (/post/new/${userId})
export const create = (userId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// update (/post/${postId})
export const update = (postId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// list (/posts?skip=${skip})
export const list = (skip) => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts?skip=${skip}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// countTotalPosts (/count/posts)
export const countTotalPosts = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/count/posts`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
}

// singlePost (/post/${postId})
export const singlePost = (postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// listByUser (/post/by/${userId})
export const listByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/by/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// remove (/post/${postId})
export const remove = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// like (/post/like)
export const like = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// unlike (/post/unlike)
export const unlike = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// comment (/post/comment)
export const comment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// uncomment (/post/uncomment)
export const uncomment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, postId, comment })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// DISCUSSION
// fetchDiscussionPosts
export const fetchDiscussionPosts = async (subject, startDate, endDate) => {
    try {
        const url = new URL(`${process.env.REACT_APP_API_URL}/discussion`);

        // Append query parameters
        if (subject) {
            url.searchParams.append('subject', subject);
        }
        if (startDate) {
            url.searchParams.append('startDate', startDate);
        }
        if (endDate) {
            url.searchParams.append('endDate', endDate);
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error fetching discussion posts');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching discussion posts:', error.message);
        throw new Error(error.message);
    }
};

// fetchSubjects
export const fetchSubjects = async () => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/discussion/subjects`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error fetching subjects');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        // Log or handle the error here
        console.error('Error fetching subjects:', error.message);
        throw new Error(error.message);
    }
};

// createDiscussionPost (/discussion/new/${userId})
export const createDiscussionPost = async (userId, token, postData) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/discussion/new/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token here
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error creating discussion post');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'Error creating discussion post');
    }
};

// updateDiscussionPost (/discussion/${postId})
export const updateDiscussionPost = async (discussionId, token, discussionData) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/discussion/${discussionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token here
            },
            body: JSON.stringify(discussionData), // Changed from postData to discussionData
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error updating discussion post');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

// deleteDiscussionPost (/discussion/${postId})
export const deleteDiscussionPost = async (discussionId, token) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/discussion/${discussionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error deleting discussion post');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

// likeDiscussionPost
export const likeDiscussionPost = async (userId, token, discussionId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/discussion/like/${discussionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, discussionId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error liking discussion post');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

// unlikeDiscussionPost
export const unlikeDiscussionPost = async (userId, token, discussionId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/discussion/unlike/${discussionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, discussionId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error unliking discussion post');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

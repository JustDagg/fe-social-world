
// read (/user/${userId})
export const read = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
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

// update (/user/${userId})
export const update = (userId, token, user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: user
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// remove (/user/${userId})
export const remove = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
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

// list (/users)
export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// updateUser
export const updateUser = (user, next) => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('jwt')) {
            let auth = JSON.parse(localStorage.getItem('jwt'));
            auth.user = user;
            localStorage.setItem('jwt', JSON.stringify(auth));
            next();
        }
    }
};

// follow (/user/follow)
export const follow = (userId, token, followId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/follow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, followId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// unfollow (/user/unfollow)
export const unfollow = (userId, token, unfollowId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/unfollow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, unfollowId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

// findPeople (/user/findpeople/${userId})
export const findPeople = (userId, token, university = '', birthYear = '') => {
    const queryParams = new URLSearchParams();
    if (university) queryParams.append('university', university);
    if (birthYear) queryParams.append('birthYear', birthYear);

    return fetch(`${process.env.REACT_APP_API_URL}/user/findpeople/${userId}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .catch(err => console.log(err));
};

// Fetch universities
export const fetchUniversities = (token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/universities`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .catch(err => console.log(err));
};

// getChats (/chats/${senderId}/${recieverId})
export const getChats = (senderId, recieverId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/chats/${senderId}/${recieverId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
}

// getChatList (/chatlist/${senderId})
export const getChatList = (senderId, name) => {
    const url = new URL(`${process.env.REACT_APP_API_URL}/chatlist/${senderId}`);

    if (name) {
        url.searchParams.append('name', name);
    }

    return fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching chat list');
            }
            return response.json();
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
}


// searchUserByName (/user/search/${encodeURIComponent(query)})
export const searchUserByName = async (query, token) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/search/${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Something went wrong');
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error searching users:', err.message);
        throw err;
    }
};

// getNotesByUser (/notes/user/:userId)
export const getNotesByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/notes/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

// getNotes (/notes)
export const getNotes = (token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/notes`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

// Create a new note (/note/new/:userId)
export const createNote = (userId, token, content) => {
    return fetch(`${process.env.REACT_APP_API_URL}/note/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

// deleteNote (/note/:noteId/:userId)
export const deleteNote = (noteId, userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/note/${noteId}/${userId}`, {
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
        .catch(err => console.log(err));
};
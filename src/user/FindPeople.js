import React, { Component } from 'react';
import DefaultProfile from '../images/avatar.jpg';
import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';
import Footer from '../component/Footer';

import { isAuthenticated } from '../auth/index';
import { fetchUniversities, findPeople, follow, searchUserByName } from './apiUser';
import '../css/FindPeople.css';

class FindPeople extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            universities: [],
            error: "",
            open: false,
            followMessage: "",
            searchQuery: "",
            loading: false,
            university: "",
            birthYear: ""
        }
    }

    componentDidMount() {
        this.fetchUniversities();
        this.fetchUsers();
    }

    fetchUniversities = () => {
        const token = isAuthenticated().token;

        fetchUniversities(token)
            .then(data => {
                console.log("uni", data)
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ universities: data }); // Update to reflect the correct data structure
                }
            })
            .catch(err => {
                console.error("Error fetching universities:", err);
                this.setState({ error: err.message });
            });
    };

    fetchUsers = () => {
        this.setState({ loading: true });
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const { university, birthYear } = this.state;

        findPeople(userId, token, university || "", birthYear || "")
            .then(data => {
                console.log("Fetched users data:", data); // Log the data
                if (data && data.error) {
                    console.log(data.error);
                    this.setState({ users: [], loading: false }); // Set users to empty if there's an error
                } else {
                    this.setState({ users: data || [], loading: false });
                }
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                this.setState({ loading: false, error: err.message });
            });
    };

    handleUniversityChange = (event) => {
        this.setState({ university: event.target.value }, this.fetchUsers);
    };

    handleBirthYearChange = (event) => {
        this.setState({ birthYear: event.target.value }, this.fetchUsers);
    };

    // handleSearchChange
    handleSearchChange = (event) => {
        const searchQuery = event.target.value;
        this.setState({ searchQuery, loading: true });

        const token = isAuthenticated().token;

        if (searchQuery.trim() === "") {
            // If the search query is empty, fetch all users
            this.fetchUsers();
        } else {
            searchUserByName(searchQuery, token)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else if (data.length === 0) {
                        // No users found
                        this.setState({ users: [], error: "No users found", loading: false });
                    } else {
                        // Users found
                        this.setState({ users: data, error: "", loading: false });
                    }
                })
                .catch(err => {
                    this.setState({ error: err.message, loading: false });
                });
        }
    };

    // clickFollow
    clickFollow = (user, i) => {
        this.setState({ loading: true })
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    let toFollow = this.state.users;
                    toFollow.splice(i, 1);
                    this.setState({
                        users: toFollow,
                        open: true,
                        followMessage: `Following ${user.name}`,
                        loading: false
                    })
                }
            })
    };

    renderUsers = (users) => (
        <div className="row" style={{ padding: "0 30px", marginBottom: "30px" }}>
            {users.map((user, i) => (
                <div key={i} className="col-md-4 mb-4">
                    <div className="card find-friend-card">
                        <div className="profile-img-container">
                            <img
                                className="profile-img"
                                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                                onError={i => (i.target.src = DefaultProfile)}
                                alt={user.name}
                            />
                        </div>
                        <div className="card-body text-center">
                            {/* User Name */}
                            <h5 style={{ fontWeight: "bold" }} className="card-title find-friend-name">{user.name}</h5>

                            {/* User Email */}
                            <p style={{ fontSize: "15px" }} className="card-title find-friend-name">{user.email}</p>

                            {/* User Information */}
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {/* User Birth Year */}
                                {user.birthYear && (
                                    <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
                                        <i
                                            style={{ fontSize: "20px" }}
                                            className="fa fa-birthday-cake"
                                            aria-hidden="true"
                                        ></i>
                                        <span style={{ marginLeft: "8px", fontSize: "20px" }}>{user.birthYear}</span>
                                    </div>
                                )}


                                {/* University */}
                                {user.university && (
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <i
                                            style={{ fontSize: "20px" }}
                                            className="fa fa-graduation-cap"
                                            aria-hidden="true"
                                        ></i>
                                        <span style={{ marginLeft: "8px", fontSize: "20px" }}>{user.university}</span>
                                    </div>
                                )}
                            </div>

                            {/* View Profile */}
                            <Link to={`/user/${user._id}`} className="btn btn-view-profile">
                                View Profile
                            </Link>

                            {/* Follow Button */}
                            <button
                                onClick={() => this.clickFollow(user, i)}
                                className="btn btn-follow"
                                style={{ marginLeft: "5px" }}
                            >
                                Follow
                            </button>

                        </div>
                    </div>
                </div>
            ))
            }
        </div >
    );

    render() {
        const { users, open, followMessage, loading, searchQuery, university, birthYear, universities } = this.state;
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: currentYear - 1980 + 1 }, (v, i) => 1980 + i);

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

                    {/* TITLE */}
                    <h2
                        style={{ fontWeight: "bold" }}
                        className="mb-5 text-center">
                        Find friends
                        <i style={{ marginLeft: "15px" }} class="fa fa-users" aria-hidden="true"></i>
                    </h2>

                    {/* Filter Inputs */}
                    <div className="form-group" style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "2rem",
                        gap: "20px",
                        padding: "0 150px"
                    }}>
                        {/* Select University */}
                        <div style={{ display: "flex", alignItems: "center", width: "70%" }}>
                            <i
                                style={{ fontSize: "20px", marginRight: "10px" }}
                                className="fa fa-graduation-cap"
                                aria-hidden="true"
                            ></i>
                            <select
                                className="form-control"
                                value={university}
                                onChange={this.handleUniversityChange}
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    borderRadius: "20px",
                                    border: "1px solid #007bff",
                                    boxShadow: "0 4px 8px rgba(0, 123, 255, 0.1)",
                                    backgroundColor: "#f8f9fa",
                                    transition: "border-color 0.3s, box-shadow 0.3s",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#0056b3";
                                    e.target.style.boxShadow = "0 0 8px rgba(0, 86, 179, 0.5)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#007bff";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                <option value="">Select University</option>
                                {universities.map(univ => (
                                    <option key={univ} value={univ}>{univ}</option>
                                ))}
                            </select>
                        </div>

                        {/* Select Birth Year */}
                        <div style={{ display: "flex", alignItems: "center", width: "30%" }}>
                            <i
                                style={{ fontSize: "20px", marginRight: "10px" }}
                                className="fa fa-birthday-cake"
                                aria-hidden="true"
                            ></i>
                            <select
                                className="form-control"
                                value={birthYear}
                                onChange={this.handleBirthYearChange}
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    borderRadius: "20px",
                                    border: "1px solid #007bff",
                                    boxShadow: "0 4px 8px rgba(0, 123, 255, 0.1)",
                                    backgroundColor: "#f8f9fa",
                                    transition: "border-color 0.3s, box-shadow 0.3s",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#0056b3";
                                    e.target.style.boxShadow = "0 0 8px rgba(0, 86, 179, 0.5)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#007bff";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                <option value="">Select Birth Year</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* SEARCH USER */}
                    <div className="form-group" style={{ display: "flex", justifyContent: "center", marginBottom: "3rem", padding: "0 150px" }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search users by name"
                            value={searchQuery}
                            onChange={this.handleSearchChange}
                            style={{
                                width: "100%",
                                padding: "15px 26px",
                                borderRadius: "20px",
                                border: "1px solid black",
                                background: "#f9f9f9",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out",
                                outline: "none"
                            }}
                            onFocus={(e) => e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)"}
                            onBlur={(e) => e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"}
                        />
                    </div>

                    {open && (
                        <div className="alert alert-success text-center mb-2" style={{ padding: "0 30px" }}>
                            {followMessage}
                        </div>
                    )}
                    {loading ? (
                        <Loading />
                    ) : (
                        users.length > 0 ? (
                            this.renderUsers(users)
                        ) : (
                            <div className="alert alert-warning text-center">No data to display!</div>
                        )
                    )}
                </div>

                {/* Footer Field */}
                <Footer />
            </>
        );
    }
}

export default FindPeople;

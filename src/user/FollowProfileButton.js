import React, { Component } from 'react';

import { follow, unfollow } from './apiUser';

class FollowProfileButton extends Component {

    followClick = () => {
        this.props.onButtonClick(follow);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render() {
        return (
            <>
                {!this.props.following ?
                    (
                        // FOLLOW BUTTON
                        <button
                            onClick={this.followClick}
                            className="btn btn-sm btn-info btn-raised"
                            style={{ borderRadius: "20px", padding: "10px 50px" }}
                        >
                            <i style={{ marginRight: "5px" }} class="fa fa-smile-o" aria-hidden="true"></i>
                            Follow
                        </button>
                    ) : (
                        // UNFOLLOW BUTTON
                        <button
                            onClick={this.unfollowClick}
                            className="btn btn-sm btn-raised btn-danger"
                            style={{ borderRadius: "20px", padding: "10px 50px" }}
                        >
                            <i style={{ marginRight: "5px" }} class="fa fa-frown-o" aria-hidden="true"></i>
                            UnFollow
                        </button>
                    )
                }
            </>
        );
    }
}

export default FollowProfileButton;
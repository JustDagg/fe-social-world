import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './core/Home';
import Menu from './core/Menu';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import FindPeople from './user/FindPeople';
import PrivateRoute from './auth/PrivateRoute';
import NewPost from './post/NewPost';
import SinglePost from './post/SinglePost';
import EditPost from './post/EditPost';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Chat from "./user/Chat";
import ChatDef from "./user/ChatDef";
import NewDiscussionPost from './post/discussion/NewDiscussionPost';


const MainRouter = () => (
    <div>
        <Menu />
        <Switch>

            {/* Home (/) */}
            <Route exact path="/" component={Home} />

            {/* ForgotPassword (/forgot-password) */}
            <Route exact path="/forgot-password" component={ForgotPassword} />

            {/* ResetPassword (/reset-password/:resetPasswordToken) */}
            <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />

            {/* NewPost (/post/create) */}
            <PrivateRoute exact path="/post/create" component={NewPost} />

            <PrivateRoute exact path="/post/createDiscussion" component={NewDiscussionPost} />

            {/* SinglePost (/post/:postId) */}
            <Route exact path="/post/:postId" component={SinglePost} />

            {/* EditPost (/post/edit/:postId) */}
            <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />

            {/* Users (/users) */}
            <Route exact path="/users" component={Users} />

            {/* Signup (/signup) */}
            <Route exact path="/signup" component={Signup} />

            {/* Signin (/signin) */}
            <Route exact path="/signin" component={Signin} />

            {/* Profile (/user/:userId) */}
            <PrivateRoute exact path="/user/:userId" component={Profile} />

            {/* FindPeople (/findpeople) */}
            <PrivateRoute exact path="/findpeople" component={FindPeople} />

            {/* EditProfile (/user/edit/:userId) */}
            <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />

            {/* Chat (/chat/:user1Id/:user2Id) */}
            <PrivateRoute exact path="/chat/:user1Id/:user2Id" component={Chat} />

            {/* ChatDef (/chats/:userId) */}
            <PrivateRoute exact path="/chats/:userId" component={ChatDef} />

        </Switch>
    </div>
);

export default MainRouter;
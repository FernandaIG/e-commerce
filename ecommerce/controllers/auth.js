'use strict';
require('dotenv').config();
import User from '../models/user';
import { errorHandler } from '../helpers/dbErrorHandler';
import jwt from 'jsonwebtoken';// to generate token
// import expressJwt from 'express-jwt';// for authorization check
const expressJwt = require("express-jwt");

//Methods
exports.signup = (req, res) => {
    console.log('req.body', req.body);
    const user = new User(req.body);

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        // It works for hide de password and salt in Postman
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
}

exports.signin = (req, res) => {
    // find the user based on email 
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email doesn't exist. Please signup"
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password don't match"
            })
        }
        // generate a signed token  with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });
        // return the response  with user and token to frontend client
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role }
        });


    });
}

exports.signout = (req, res) => {
    // clear the cookie
    res.clearCookie('t');
    res.json({
        massage: 'Signout success!'
    });
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

// this is a middleware
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;

    if (!user) {
        return res.status(403).json({
            error: 'Access denied!'
        });
    }

    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
}
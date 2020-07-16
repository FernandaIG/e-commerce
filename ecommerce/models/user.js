'use strict';
import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
import uuidv1 from 'uuid/v1';

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        trim: true,
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }
}, { timestamps: true });

//Virtual field
userSchema.virtual('password')
    .set(function (password) {
        this._passsword = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._passsword;
    });

userSchema.methods = {

    authenticate: function (plainText) { // plainText = password
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (error) {
            return error;
        }
    }
}

module.exports = mongoose.model("User", userSchema);
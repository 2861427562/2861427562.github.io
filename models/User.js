const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        name: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: './images/default-avatar.jpg'
        }
    },
    works: [{
        title: String,
        description: String,
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    bookmarks: [{
        title: String,
        url: String,
        description: String,
        image: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema); 
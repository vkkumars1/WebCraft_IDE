const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // createdAt & updatedAt

const User = mongoose.model("User", userSchema);

module.exports = { User };

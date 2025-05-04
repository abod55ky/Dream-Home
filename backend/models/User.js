const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date },
    gender: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    role: { type: String, default: 'user' },
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


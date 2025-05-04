const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Property = require('../models/Property');


require('dotenv').config();



exports.addAdmin = async (req, res, next) => {
    try {
        const { username, name, email, password, phoneNumber } = req.body;

        if (!email ) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        if (!password) {
            return res.status(400).json({ message: 'no Passwords.' });
        }

        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({
            username,
            name,
            email,
            password: hashedPassword,
            phoneNumber
            
        });

        await admin.save();
        res.status(201).json({ message: 'admin registered successfully.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: error.message });
    }
};





// User Login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ message: 'Login successful.', token:token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



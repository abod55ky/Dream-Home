const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();



exports.register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, confirmPassword ,birthday,gender,address,phoneNumber} = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            birthday,
            gender,
            address,
            phoneNumber

        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: error.message });
    }
};




exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET,
        { expiresIn: '30d' });
        res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }

}


exports.getprofile=async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


exports.getusers=async (req, res) => {
  try {
    const user = await User.find().select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

 exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, birthday, gender, address } = req.body;

    const updatedFields = {};
    if (firstName !== undefined) updatedFields.firstName = firstName;
    if (lastName !== undefined) updatedFields.lastName = lastName;
    if (email !== undefined) updatedFields.email = email;
    if (birthday !== undefined) updatedFields.birthday = birthday;
    if (gender !== undefined) updatedFields.gender = gender;
    if (address !== undefined) updatedFields.address = address;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields }, 
      { new: true }
    ).select('-password'); 

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



 exports.deleteuser=async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
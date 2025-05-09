const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({

  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  role: { type: String, default: 'admin' },
},{timestamps:true});

module.exports  = mongoose.model('Admin', adminSchema);


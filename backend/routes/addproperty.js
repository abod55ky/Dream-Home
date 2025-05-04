const express = require('express');
const router = express.Router();
const House = require('../models/Property'); 

// Endpoint لإضافة منزل جديد
router.post('/propertes', async (req, res) => {
  try {
    const newHouse = new House(req.body); // استلام البيانات من الطلب
    await newHouse.save(); // حفظ البيانات في MongoDB
    res.status(201).json({ message: 'House added successfully', house: newHouse });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add house', error });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

router.get('/', async (req, res) => {
  try {
    const cities = await Property.aggregate([
      { $match: { city: { $ne: null, $ne: "" } } },
      { $group: { _id: "$city" } }
    ]);

    const cityData = await Promise.all(
      cities.map(async (city) => {
        const properties = await Property.find({ city: city._id });
        return {
          name: city._id || 'Unknown City',
          id: city._id ? city._id.toLowerCase().replace(/\s+/g, '-') : 'unknown-id',
          properties: properties.map((property) => ({
            id: property._id.toString(),
            Address: property.Address,
            Price: property.Price,
            imageUrl: property.imageUrl || null,
          })),
        };
      })
    );

    res.json(cityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
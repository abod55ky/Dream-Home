const express = require('express');

const router = express.Router();

const authenticate = require('../middleware/auth');
const propertyController = require('../controllers/propertyController');

require('dotenv').config();

const usercontroller = require('../controllers/UserConstrol');


router.post('/register', usercontroller.register);

// User Login
router.post('/login', usercontroller.login);

router.get('/getprofile', authenticate, usercontroller.getprofile)

router.get('/getusers', usercontroller.getusers)

router.put('/updateprofile', authenticate,usercontroller.updateProfile);

// Filter and Sort properties
router.get('/properties/filter',authenticate, propertyController.filterAndSortProperties);


module.exports = router;
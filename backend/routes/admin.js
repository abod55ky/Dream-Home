const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/auth');

const admincontroller = require('../controllers/admin');
const usercontroller = require('../controllers/UserConstrol');

const propertyController = require('../controllers/propertyController');

router.post('/addadmin', admincontroller.addAdmin);

router.post('/login', admincontroller.login);

router.delete('/deleteuser/:id', authenticate, usercontroller.deleteuser);


// Accept/Reject request
router.post('/statusproperty/:id/status',authenticate, propertyController.updatePropertyStatus);

// Filter and Sort properties
router.get('/properties/filter', propertyController.filterAndSortProperties);

module.exports = router;
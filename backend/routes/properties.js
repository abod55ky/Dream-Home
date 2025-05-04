
const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/propertyController');

const auth = require('../middleware/auth');
const upload = require('../middleware/multer'); // استيراد إعدادات Multer



router.get('/getPropertis', propertiesController.getPropertis);

router.get('/getProperty/:id', propertiesController.getProperty);

router.post('/createProperty', auth,upload.array('images'), propertiesController.createProperty);

router.put('/updateProperty/:id', auth, propertiesController.updateProperty);

router.delete('/deleteProperty/:id', auth, propertiesController.deleteProperty);

module.exports = router;
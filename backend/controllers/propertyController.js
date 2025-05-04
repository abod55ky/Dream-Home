const Property  = require('../models/Property');


const path = require('path');
const fs = require('fs');





exports.createProperty = async (req, res, next) => {
  
    const { City, region, Address, propType, operation, Price, Bedrooms, Bathrooms, squaremeter, Description } = req.body;

    let imageUrls = []; 

  
    if (req.files) {
        req.files.forEach(file => {
            imageUrls.push('/images/' + file.filename); // إضافة أسماء الصور إلى المصفوفة
        });
    }

    const property = new Property({
        OwnerID:req.user.id, 
        City,
        region,
        Address,
        propType,
        operation,
        Price,
        Bedrooms,
        Bathrooms,
        squaremeter,
        Description,
        imageUrl: imageUrls, 
    });

    try {
        const savedProperty = await property.save(); // حفظ العقار في قاعدة البيانات
        res.status(201).json({ message: 'Property added successfully', property: savedProperty });
    } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.getPropertis = async (req, res,next) => {
  try {
    const operation = req.headers.operation;
    const properties = await Property.find({ operation:operation });
   
    res.json({properties:properties});
  } catch (err) {
    res.status(500).json({ messageS: err.message });
  }
};




exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ property });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch property', error: error.message });
  }
};




exports.updateProperty = async (req, res, next) => {
  
    const { propertyId, City, region, Address, propType, operation, Price, Bedrooms, Bathrooms, squaremeter, Description } = req.body;

    let imageUrls = []; 

    if (req.files) {
        req.files.forEach(file => {
            imageUrls.push('/images/' + file.filename); // إضافة أسماء الصور إلى المصفوفة
        });
    }

    try {
       
        const property = await Property.findById(propertyId);
        if (!property) {
            const error = new Error('Could not find property.');
            error.statusCode = 404;
            throw error;
        }

       
        if (property.OwnerID.toString() !== req.userid) {
            const error = new Error('Not authorized to update this property.');
            error.statusCode = 403;
            throw error;
        }

       
        if (imageUrls.length > 0) {
            property.imageUrl.forEach(oldImage => {
                clearImage(oldImage);
            });
            property.imageUrl = imageUrls; 
        }

      
        if (City) property.City = City;
        if (region) property.region = region;
        if (Address) property.Address = Address;
        if (propType) property.propType = propType;
        if (operation) property.operation = operation;
        if (Price) property.Price = Price;
        if (Bedrooms) property.Bedrooms = Bedrooms;
        if (Bathrooms) property.Bathrooms = Bathrooms;
        if (squaremeter) property.squaremeter = squaremeter;
        if (Description) property.Description = Description;
        if (statusReq) property.statusReq = statusReq;

     
        const result = await property.save();
        res.status(200).json({ message: 'Property updated successfully.', property: result });
    } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.deleteProperty = async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete property', error: error.message });
  }
};







exports.updatePropertyStatus = async (req, res) => {
  const { statusReq } = req.body; 

  if (req.user.role !== "admin") {
   return res.status(400).json({ message: 'Invalid auth' });
}

  if (!['accepted', 'rejected'].includes(statusReq)) {
    return res.status(400).json({ message: 'Invalid status. It must be "accepted" or "rejected".' });
  }

  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { statusReq },
      { new: true }
    );
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ message: 'Property status updated successfully', updatedProperty });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update property status', error: error.message });
  }
};

exports.filterAndSortProperties = async (req, res) => {
  const { statusReq, propType } = req.query; // استخدم req.query بدلاً من req.body
  const filter = {};
 
  const statusArray = ['accepted', 'rejected', 'pending'];
const propTypeArray =  ['flat', 'house', 'villa'];

  
  if (req.user && req.user.id) {
    filter.OwnerID = req.user.id;
  }


if (propType && propTypeArray.includes(propType)) {
  filter.propType = propType;
}

if (statusReq && statusArray.includes(statusReq)) {
  filter.statusReq = statusReq;
}


  console.log(filter);
  
  try {
    const properties = await Property.find(filter).sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
};











const clearImage = filePath =>
{
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, (err => { if (err) { console.log(err) } }));
};
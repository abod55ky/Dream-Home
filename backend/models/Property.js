const mongoose =require('mongoose');

const propertySchema = new mongoose.Schema({
  OwnerID: { type: mongoose.Schema.Types.ObjectId, required: true },
  City: { type: String, required: true },
  region: { type: String, required: true },
  Address: { type: String, required: true },
  propType: { type: String, required: true },
  operation: { type: String, required: true },
  Price: { type: Number, required: true },
  Bedrooms: { type: Number ,required:true},
  Bathrooms: { type: Number ,required:true},
  squaremeter: { type: Number,required:true },
  Description: { type: String ,required:true},
  statusReq: { type: String, required: true,default:'pending' },
  imageUrl: [{ type: String,required:true}],

},{timestamps:true});

 module.exports = mongoose.model('Property', propertySchema);
 


 
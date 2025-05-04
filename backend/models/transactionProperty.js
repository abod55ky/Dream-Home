const mongoose = require('mongoose');

const transactionPropertySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  transactionType: { 
    type: String, 
    enum: ['rent', 'sale'], 
    required: true 
  }, // نوع العملية: بيع أو إيجار
  
  // للإيجار فقط
  rentalPrice: { type: Number, min: 1, 
    required: function () {
      return this.transactionType === 'rent';
    }  },
  leaseTerm: { type: String , 
    required: function () {
      return this.transactionType === 'rent';
    } }, // مدة الإيجار (اختياري للإيجار)
  leaseStartDate: { type: Date, 
    required: function () {
      return this.transactionType === 'rent';
    }  },
  leaseEndDate: { type: Date, 
    required: function () {
      return this.transactionType === 'rent';
    }  },
  
  // للبيع فقط
  salePrice: { type: Number, min: 1, 
    required: function () {
      return this.transactionType === 'sale';
    }  }, // سعر البيع

}, { timestamps: true });

const RentProperty = mongoose.model('tranProperty', transactionPropertySchema);

module.exports = RentProperty;

var mongoose = require('mongoose');

var vendorSchema = new mongoose.Schema({
   name: {
       type:String,
       required: true
   },
   email: {
       type: String,
       required:true
   },
   type: {
       type: String,
       enum: {
           values: ['Home & Office', 'Kitchen', 'Electronics'],
           message: "Must belong to specific category..."
       },
       required:true
   }
});

module.exports = mongoose.model('Vendor', vendorSchema);
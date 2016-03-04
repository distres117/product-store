var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
   name: {
       type: String,
       required: true
   },
   quantity: {
       type: Number,
       required: true
   },
   description: {
       type: String,
       required: true
   },
   vendor: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Vendor'
   }
});

module.exports = mongoose.model('Product', productSchema);


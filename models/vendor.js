var mongoose = require('mongoose'),
    Promise = require('bluebird');

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
   },
   description: String,
   products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
   }]
});

vendorSchema.pre('remove', function(next){
  Promise.map(this.products, function(id){
    return mongoose.model('Product').findByIdAndRemove(id);
  })
  .then(function(){
    next();
  });
});

module.exports = mongoose.model('Vendor', vendorSchema);

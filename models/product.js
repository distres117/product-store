var mongoose = require('mongoose'),
    Promise = require('bluebird');

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

//If vendor is added to product, vendor is
//updated aswell
productSchema.methods.update = function(obj){
  for (var key in obj){
    if(key != 'vendor')
      this[key] = obj[key];
  }
  var instance = this;
  return new Promise(function(resolve,reject){
    if (Object.keys(obj).indexOf('vendor') > -1){
        mongoose.model('Vendor').findById(obj.vendor).populate('products')
        .then(function(vendor){
          vendor.products.push(instance._id);
          instance.vendor = vendor._id;
          Promise.all([instance.save(), vendor.save()])
          .spread(function(product, vendor){
            resolve(product);
          });
        })
        .catch(function(err){
          console.log(err);
        });
      }
      else
        resolve(instance);
  });
};

module.exports = mongoose.model('Product', productSchema);

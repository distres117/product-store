var mongoose = require('mongoose'),
    Promise = require('bluebird');

var productSchema = new mongoose.Schema({
   name: {
       type: String,
       required: true
   },
   quantity: {
     type: Number,
     default: 0,
     set: function(value){
       return Number(value);
     }
   },
   description: {
       type: String,
       required: true
   },
   vendor: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Vendor'
   },
   status: {
     type:String,
     enum: {
       values: ['active', 'discontinued'],
       message: 'Must be active or discontinued'
     },
     default: 'active'
   }
});

productSchema.methods.sync = function(){
    var Vendor = mongoose.model('Vendor');
    var instance = this;
    Vendor.findById(instance.vendor)
    .then(function(vendor){
      vendor.products.push(instance._id);
      return vendor.save();
    });
};

productSchema.pre('remove', function(next){
  var instance = this;
  var Vendor = mongoose.model('Vendor');
  Vendor.findById(this.vendor)
  .then(function(vendor){
    vendor.products.remove(instance._id);
    vendor.save();
  })
  .then(function(){
    next();
  });
});

productSchema.methods.update = function(obj){
  for (var key in obj){
    if(obj[key])
      this[key] = obj[key];
  }
  return this.save();
};
//If vendor is added to product, vendor is
//updated aswell
// productSchema.methods.update = function(obj){
//   for (var key in obj){
//     if(obj[key] && key != 'vendor')
//       this[key] = obj[key];
//   }
//   var instance = this;
//   return new Promise(function(resolve,reject){
//     instance.save()
//     .then(function(instance){
//       if (Object.keys(obj).indexOf('vendor') > -1){
//           mongoose.model('Vendor').findById(obj.vendor).populate('products')
//           .then(function(vendor){
//             vendor.products.push(instance._id);
//             instance.vendor = vendor._id;
//             return Promise.all([instance.save(), vendor.save()]);
//           })
//           .spread(function(product, vendor){
//             resolve(product);
//           })
//           .catch(function(err){
//             reject(err);
//           });
//         }
//         else
//           resolve(instance);
//         });
//   });
// };

module.exports = mongoose.model('Product', productSchema);

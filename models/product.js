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


productSchema.post('save', function(doc, next){
    var instance = doc;
    var Vendor = mongoose.model('Vendor')
    Vendor.findOne({_id: instance.vendor, products: {$ne: instance._id}})
    .then(function(vendor){
        if (!vendor)
            return next();
        vendor.products.push(instance._id);
        return vendor.save()
    })
    .then(function(vendor){
       next();
    });
     
});

productSchema.pre('remove', function(next){
    var Vendor = mongoose.model('Vendor')
    var instance = this;
    Vendor.findById(instance.vendor)
    .then(function(vendor){
        vendor.products.remove(instance._id);
        vendor.save();
    })
    .then(function(){
        next();
    }, next);
});

productSchema.methods.update = function(obj){
  //for future reference.. security issue?
  for (var key in obj){
    if(obj[key])
      this[key] = obj[key];
  }
  return this.save();
};


module.exports = mongoose.model('Product', productSchema);

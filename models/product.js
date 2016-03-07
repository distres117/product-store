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


function getVendor(instance){
    var Vendor = mongoose.model('Vendor');
    return Vendor.findById(instance.vendor);
}

productSchema.post('save', function(doc, next){
    var instance = doc;
    getVendor(instance)
    .then(function(vendor){
        if (vendor.products.indexOf(instance._id) === -1){
            vendor.products.push(instance._id);
            vendor.save()
            .then(function(vendor){;
               next(); 
            })
            .catch(function(err){
               console.log(err); 
            });
        } 
        else
            next();
    })
    
});

productSchema.pre('remove', function(next){
  var instance = this;
  getVendor(instance)
  .then(function(vendor){
    vendor.products.remove(instance._id);
    vendor.save();
  })
  .then(function(){
    next();
  })
  .catch(function(err){
     console.log(err);
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


module.exports = mongoose.model('Product', productSchema);

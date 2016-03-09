var expect = require('chai').expect,
    Product = require('../models/product'),
    Vendor = require('../models/vendor'),
    seed = require('../db/seed');

xdescribe('basic db operations', function(){
   it('Connects to db',function(){
       return seed.dbconnect()
      .then(function(){
          return Product.find();
      })
      .then(function(products){
         expect(products.length).to.equal(0);
      })
      .catch(function(err){
          console.error(err);
      });

   });
});
describe('Model operations', function(){
   before(function(){
       return seed.dbconnect()
       .then(function(){
          return seed.destroy();
       })
       .then(function(){
          return seed.seed();
       });
   });

   it('Gets all products', function() {
        return Product.find()
      .then(function(products){
          expect(products.length).to.equal(4);
      })
      .catch(function(err){
         console.error(err);
      });
   });

   it('Products associated with vendor', function() {
       return Product.findOne({name: 'Sink'}).populate('vendor')
       .then(function(product){
           expect(product.vendor.name).to.equal('GougeCo');
       });
   });
   it('Vendor associated with products', function(){
      return Vendor.findOne({name: 'DNS Electronics'}).populate('products')
      .then(function(vendor){
         expect(vendor.products.length).to.equal(2);
      });
   });
   it('Product validations', function(done){
      var product = new Product({});
      product.validate()
      .catch(function(err){
         expect(err.message).to.equal('Product validation failed');
         done();
      });
   });
   it('All vendors have at least one product', function(){
      return Vendor.find()
     .then(function(vendors){
       expect(vendors.every(it=>it.products.length)).to.equal(true);
     });
   });
   it('Removing product also removes product from vendor collection', function(){
     return Product.findOne({name: 'Sink'})
     .then(function(product){
       return product.remove();
     })
     .then(function(){
       return Vendor.findOne({name: 'GougeCo'});
     })
     .then(function(vendor){
         expect(vendor.products.length).to.equal(0);
       });
     });
     it('Adding product with vendor updates the vendors collection', function(){
       return Vendor.create({name: 'Test vendor', email: 'testy@test.com', type: 'Kitchen'})
          .then(function(vendor){
           return Product.create({name: 'Test product', description: "tesy", vendor: vendor._id});
         })
         .then(function(){
            return Vendor.findOne({name:'Test vendor'});
         })
         .then(function(vendor){
            expect(vendor.products.length).to.equal(1);
         });
      });
      it('Does not add duplicate products', function() {
         return Product.findOne({name:'Test product'}).populate('vendor')
         .then(function(product){
            product.name = 'Updated test product';
            return product.save();
         })
         .then(function(product){
            return Vendor.findOne({name: 'Test vendor'});
         })
         .then(function(vendor){
            expect(vendor.products.length).to.equal(1);
         })
         
         
      });
      it('Removes all vendor products when vendor is removed', function(){
         return Vendor.findOne({name:'Test vendor'})
         .then(function(vendor){
            return vendor.remove();
         })
         .then(function(){
            return Product.find();
         })
         .then(function(products){
            expect(products.length).to.equal(3);
         });
      });
   

});

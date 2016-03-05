var expect = require('chai').expect,
    Product = require('../models/product'),
    Vendor = require('../models/vendor'),
    seed = require('../db/seed');

describe('basic db operations', function(){
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
           seed.seed();
       });
   });

   after(function(){
      return seed.destroy();
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
   it('Product validations', function(){
      var product = new Product({});
      product.validate()
      .catch(function(err){
         expect(err.message).to.equal('Product validation failed');
      });
   });
});

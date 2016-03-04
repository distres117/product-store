var expect = require('chai').expect,
    dbconnect = require('../db/db'),
    Product = require('../models/product'),
    Vendor = require('../models/vendor'),
    seed = require('../db/seed');

describe('basic db operations', function(){
   it('Connects to db',function(){
       return dbconnect()
      .then(function(){
          return Product.find() 
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
       return dbconnect()
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
   
   it('Shows proper associations', function() {
       return Product.findOne({name: 'Sink'}).populate('vendor')
       .then(function(product){
           expect(product.vendor.name).to.equal('GougeCo');
       });
   });
});
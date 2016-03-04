var expect = require('chai').expect,
    dbconnect = require('../db/db'),
    Product = require('../models/product'),
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
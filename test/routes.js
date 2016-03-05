var expect = require('chai').expect,
    request = require('supertest-as-promised')(require('../app')),
    seed = require('../db/seed');

describe('Routes', function(){
  var newProduct;
  var newVendor;
  before(function(){
      return seed.dbconnect()
      .then(function(){
          seed.seed();
      });
  });

  after(function(){
     return seed.destroy();
  });
   it('/products', function(){
       return request.get('/products')
       .expect(200)
       .then(function(res){
         expect(res.body.length).to.equal(4);
       });
   });

   it('post /products then get by id', function(){
     return request
     .post('/products')
     .send({
       name: 'Test product',
       quantity: 1,
       description: 'Awesome test product'
     }).
     expect(302)
     .then(function(res){
       newProduct = res.body;
       expect(newProduct.name).to.equal('Test product');
       return request
        .get('/products/' + newProduct._id)
        .expect(200);
     })
     .then(function(res){
       expect(res.body.name).to.equal('Test product');
     });
   });

   it('Updates products', function(){
     return request.put('/products/' + newProduct._id)
      .send({name: 'Updated test product'})
      .expect(302)
      .then(function(res){
        expect(res.body.name).to.equal('Updated test product');
     });
   });

   it('Gets all vendors', function(){
     return request.get('/vendors')
      .expect(200)
      .then(function(res){
        expect(res.body.length).to.equal(3);
      });
   });
   it('Creates new vendor and adds a product', function(){
     return request
      .post('/vendors')
      .send({
        name:'Test vendor',
        email: 'test@vendor.com',
        type: 'Home & Office'
      })
      .expect(302)
      .then(function(res){
        newVendor = res.body;
        expect(res.body.name).to.equal('Test vendor');
        return request.put('/products/' + newProduct._id )
          .send({vendor: newVendor._id});
        })
        .then(function(res){
          return request.get('/products/' + newProduct._id);
        })
        .then(function(res){
          expect(res.body.vendor.name).to.equal(newVendor.name);
        });
      });
    it('vendor should have product added', function(){
      return request
        .get('/vendors/' + newVendor._id)
        .then(function(res){
          expect(res.body.products.length).to.equal(1);
        });
    });

   it('Deleting vendors should remove vendor products', function(){
     return request
      .del('/vendors/' + newVendor._id)
      .then(function(res){
        return request.get('/products');
      })
      .then(function(res){
        expect(res.body.length).to.equal(4);
      });
   });
});

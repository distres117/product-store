var Product = require("../models/product"),
    Vendor = require("../models/vendor"),
    router = require('express').Router(),
    Promise = require('bluebird');

require('../db/db')();

router.param('id', function(req,res,next,id){
  Product.findById(id).populate('vendor')
  .then(function(product){
    req.product = product;
    next();
  })
  .catch(function(err){
    next(err);
  });
});

router.route('/')
    .get(function(req,res,next){
      var noshow = req.query.filter || '';
       Promise.all([Product.find(), Vendor.find()])
       .spread(function(products, vendors){
         products = products.filter(it=>it.status != noshow);
         res.status(200).render('products/index', {products: products, noshow:noshow, vendors: vendors});
       })
       .catch(function(err){
         next(err);
       });
    })
    .post(function(req,res,next){
      Product.create(req.body)
      .then(function(product){
        //res.status(302).json(product);
        res.redirect('/products');
      });
    });

router.route('/:id')
  .get(function(req,res){
    res.status(200).json(req.product);
  })
  .put(function(req,res, next){
    req.product.update(req.body)
    .then(function(product){
      //res.status(302).json(product);
      res.redirect('/products');
    })
    .catch(function(err){
      next(err);
    });
  })
  .delete(function(req,res,next){
    req.product.remove()
    .then(function(){
      res.redirect('/products');
    })
    .catch(function(err){
      next(err);
    });
  });

module.exports = router;

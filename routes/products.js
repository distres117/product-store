var Product = require("../models/product"),
    Vendor = require("../models/vendor"),
    router = require('express').Router();

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
       Product.find()
       .then(function(products){
         products = products.filter(it=>it.status != noshow);
         res.render('products/index', {products: products, noshow:noshow});
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
    console.log(req.body);
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
    Product.remove({_id: req.product._id})
    .then(function(){
      res.redirect('/products');
    })
    .catch(function(err){
      next(err);
    });
  });

module.exports = router;

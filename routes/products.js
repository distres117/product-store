var Product = require("../models/product"),
    Vendor = require("../models/vendor"),
    router = require('express').Router(),
    Promise = require('bluebird');


router.param('id', function(req,res,next,id){
  Product.findById(id).populate('vendor')
  .then(function(product){
    req.product = product;
    next();
  }, next);
});

router.route('/')
    .get(function(req,res,next){
      var noshow = req.query.filter || '';
       Promise.all([Product.find(), Vendor.find()])
       .spread(function(products, vendors){
         products = products.filter(it=>it.status != noshow);
         res.render('products/index', {products: products, noshow:noshow, vendors: vendors});
       }, next);
    })
    .post(function(req,res,next){
      Product.create(req.body)
      .then(function(product){
        res.redirect('/products');
      }, next);
    });

router.route('/:id')
  .get(function(req, res){
    res.send(req.product);
  })
  .put(function(req,res, next){
    req.product.update(req.body)
    .then(function(product){
      //res.status(302).json(product);
      res.redirect('/products');
    }, next);
  })
  .delete(function(req,res,next){
    req.product.remove()
    .then(function(){
      res.redirect('/products');
    }, next);
  });

module.exports = router;

var Product = require("../models/product"),
    Vendor = require("../models/vendor"),
    router = require('express').Router();

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
       Product.find()
       .then(function(products){
         res.status(200).json(products);
       })
       .catch(function(err){
         next(err);
       });
    })
    .post(function(req,res,next){
      Product.create(req.body)
      .then(function(product){
        res.status(302).json(product);
      });
    });

router.route('/:id')
  .get(function(req,res){
    res.status(200).json(req.product);
  })
  .put(function(req,res, next){
    req.product.update(req.body)
    .then(function(product){
      res.status(302).json(product);
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

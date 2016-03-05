var Vendor = require('../models/vendor'),
  router = require('express').Router();

router.param('id', function(req,res,next,id){
  Vendor.findById(id).populate('products')
  .then(function(vendor){
    req.vendor = vendor;
    next();
  })
  .catch(function(err){
    next(err);
  });
});

router.route('/')
  .get(function(req, res){
    Vendor.find()
    .then(function(vendors){
      res.status(200).json(vendors);
    });
  })
  .post(function(req,res,next){
    Vendor.create(req.body)
    .then(function(vendor){
      res.status(302).json(vendor);
    })
    .catch(function(err){
      next(err);
    });
  });
router.route('/:id')
  .get(function(req,res){
    res.json(req.vendor);
  })
  .delete(function(req,res,next){
    req.vendor.remove()
    .then(function(){
      res.sendStatus(200);
    });
  });


module.exports = router;

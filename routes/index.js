var Product = require("../models/products"),
    router = require('express').Router();

router.route('/')
    .get(function(req,res,next){
       res.statusCode(200); 
    });

module.exports = router;
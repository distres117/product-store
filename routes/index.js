var Product = require("../models/product"),
    router = require('express').Router();

router.route('/')
    .get(function(req,res,next){
       res.sendStatus(200); 
    });

module.exports = router;
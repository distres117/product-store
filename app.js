var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    productRoutes = require('./routes/products'),
    vendorRoutes = require('./routes/vendors'),
    app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('node_modules'));
app.use(express.static('public'));

app.use(function(req,res,next){ //method override
    if (req.query.method)
        req.method = req.query.method;
    if (req.query.status)
      req.body = {status: req.query.status};
    next();
});

app.use(function(err,req,res,next){ //error-handling
    if (err)
        res.statusCode(500);
    next();
});
app.get('/',function(req,res){
    res.redirect('/products');
})
app.use('/products',productRoutes);
app.use('/vendors', vendorRoutes);

module.exports = app;

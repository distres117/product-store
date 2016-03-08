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
app.use(bodyParser.json());//are you doing json parsing?
app.use(express.static('node_modules'));
app.use(express.static('public'));

//if you're going to do your own override-- why not put it in another file to keep this cleaner..
app.use(function(req,res,next){ //method override
    if (req.query.method)
        req.method = req.query.method;
    if (req.query.status)
      req.body = {status: req.query.status};
    next();
});


app.get('/',function(req,res){
    res.redirect('/products');
});

app.use('/products',productRoutes);

app.use('/vendors', vendorRoutes);

app.use(function(err,req,res,next){ //error-handling
    if (err)
        res.render('error', {error: err});
    else
        next();
});

module.exports = app;

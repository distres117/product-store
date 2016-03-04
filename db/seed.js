var RefArray = require('../utils/ref-array'),
    Promise = require('bluebird'),
    Product = require('../models/product'),
    Vendor = require('../models/vendor');

var products = [
        {
            name: 'Sink', 
            quantity: 3, 
            description: 'Ivory white, Perfect for kitchens', 
            vendor: 1
        },
        {
            name: '8K Televison', 
            quantity: 5, 
            description: 'Get on the bleeding edge of entertainmemt', 
            vendor: 2
        },
        {
            name: 'Super-computer',
            quantity: 1,
            description: 'Now conveniently sits on your desk',
            vendor: 2
        },
        {
            name: 'Cross-cut paper shredder',
            quantity: 8,
            description: 'The best way to dispose of incriminating documents',
            vendor: 3
        }
    
    ];

var vendors = [
        {
            _id: 1,
            name: 'GougeCo',
            email: 'gougeco@gouged.com',
            type: 'Kitchen',
            description: 'Here, the customer is our chum...'
        },
        {
            _id : 2,
            name: 'DNS Electronics',
            email: 'service@dnselectronics.com',
            type: 'Electronics',
            description: 'Definitely Not Shoddy electronics was founded with the simple...'
        },
        {
            _id: 3,
            name: 'Paperclips',
            email: 'customers@paperclips.com',
            type: 'Home & Office',
            description: 'Let us supply your home office...'
        }
    ];

function seed(){
    var _products = new RefArray('Product', ['vendor'], products);
    var _vendors = new RefArray('Vendor',[], vendors);
    return Promise.all([Product.insertMany(_products.build()), Vendor.insertMany(_vendors.build())]);
}

function destroy(){
    return Promise.all([Product.remove({}), Vendor.remove({}) ]);
}

module.exports = { seed, destroy };
'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.connect('mongodb://localhost:27017/curso_mean', (err, res)=> {
    if(err){
        throw err;        
    }else{
        console.log('Connection with database is ok ...');
        app.listen(port, function(){
            console.log('API Rest Server listening ... ' + port);
        });
    }    
});
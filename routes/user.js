'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_autho = require('../middlewares/authenticated');

var api = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/probando-controlador', md_autho.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saverUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_autho.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_autho.ensureAuth, md_upload], UserController.uploadImage);

module.exports = api;
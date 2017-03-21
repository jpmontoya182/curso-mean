'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_autho = require('../middlewares/authenticated');

var api = express.Router();

api.get('/probando-controlador', md_autho.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saverUser);
api.post('/login', UserController.loginUser);

module.exports = api;
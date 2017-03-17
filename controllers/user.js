'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({message :  'probando una accion del controlador de usuarios'  });
}

function saverUser(req, res){
    var user = new User();
    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if(params.password){
        // encriptar contraseña y guardar datos
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                // guardar usuario
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({message : 'Error al guardar el usuario !!'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message : 'No se ha registrado el usuario !!'});
                        }else{
                            // podemos ver el contenido de lo almacenado
                            // res.status(200).send({user : userStored});
                        }
                    }
                })
            }else{
                res.status(200).send({message : 'Ingresa todos los campos !!'});
            }
        });
    }else{
        res.status(200).send({message : 'Ingresa la contraseña !!'});
    }
}

function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email : email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message : 'Error en la petición'});
        }else{
            if(!user){
                re.status(404).send({message : 'El usuario no existe'});
            }else{
                // comprobar la contraseña
                bcrypt.compare(password, user.password, (err, check)=>{
                    if(check){
                        // devolver los datos del  usuario logueado
                        if(params.gethash){
                            // devolver un token de JWT
                            res.status(200).send({
                                token : jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message : 'el usuario no ha podido ingresar'});
                    }
                });
            }
        }
    });
}

module.exports = {
    pruebas, 
    saverUser,
    loginUser
};
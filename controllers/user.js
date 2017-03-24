'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({message :  'Accion en el controlador de usuarios ...'});
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
                            res.status(200).send({user : userStored});
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

// se usa el metodo PUT
function updateUser(req, res){
    var userId = req.params.id;    
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
        if(err)
        {  // error de server
            res.status(500).send({message : 'Error al actualizar el usuario ...'});
        } else {
            if(!userUpdated){
                res.status(404).send({ message : 'No se ha podido actualizar el usuario ...' });
            }else{
                res.status(200).send({ user : userUpdated });
            }
        }
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'Imagen no cargada';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        file_name = file_split[file_split.length - 1];
        var ext_split = file_name.split('\.');
        console.log(ext_split);
        var file_ext = ext_split[1];
        console.log(file_ext);
        
        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif')
        {
            User.findByIdAndUpdate(userId, {image : file_name}, (err, userUpdated)=>{
            if(!userUpdated){
                res.status(404).send({ message : 'No se ha podido actualizar el usuario ...' });
            }else{
                res.status(200).send({ user : userUpdated });
            }
            });
        } else{
            res.status(200).send({message : 'Extension del arcjivo no valida'});
        }

    }else{
        res.status(404).send({ message : 'No se ha cargado ninguna imagen ...' });
    }
}

module.exports = {
    pruebas, 
    saverUser,
    loginUser, 
    updateUser, 
    uploadImage
};
'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({message :  'Accion en el controlador de usuarios ...'});
}
// Guardar la informacion del usuario
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
// loguear al usuario
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
// cargar Imagenes
function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'Imagen no cargada';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        file_name = file_split[file_split.length - 1];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif')
        {
            User.findByIdAndUpdate(userId, {image : file_name}, (err, userUpdated)=>{
            if(!userUpdated){
                res.status(404).send({ message : 'No se ha podido actualizar el usuario ...' });
            }else{
                res.status(200).send({ image: file_name, user : userUpdated });
            }
            });
        } else{
            res.status(200).send({message : 'Extension del arcjivo no valida'});
        }
    }else{
        res.status(404).send({ message : 'No se ha cargado ninguna imagen ...' });
    }
}
// obtener las imagenes del servidor
function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_File = './uploads/users/' + imageFile;
    fs.exists(path_File, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_File));
        }else{
            res.status(200).send({message : 'No existe la imagen ...'});
        }
    });
}

// exportamos las funciones
module.exports = {
    pruebas, 
    saverUser,
    loginUser, 
    updateUser, 
    uploadImage,
    getImageFile
};
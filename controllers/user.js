'use strict'

function pruebas(req, res){
    res.status(200).send({
        message :  'probando una accion del controlador de usuarios'
    });
}

module.exports = {
    pruebas
};
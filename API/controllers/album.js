'use strict'

var path = require('path');
var fs = require('fs');
var mogoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// obtener solo un album
function getAlbum(req, res){
    var albumId = req.params.id;
    Album.findById(albumId).populate({path : 'artist'}).exec((err, album) => {
        if (err) {
            res.status(500).send({message : 'Error en el servidor'});
        } else {
            if (!album) {
                res.status(404).send({message : 'Album no encontrado/existe'});
            } else {
                res.status(200).send({album : album});
            }
        }
    });
}

// obtener los albumnes relacionados a un artista
function getAlbums(req, res){
    var artistId = req.params.artist;

    if (!artistId) {
       // mostramos todos 
       var find = Album.find().sort('title');
    } else {
       // relacionados con el artista 
       var find = Album.find({artist : artistId}).sort('year');
    }

    find.populate({path : 'artist'}).exec((err, album) => {
        if (err) {
            res.status(500).send({message : 'Error en el servidor'});
        } else {
            if (!album) {
                res.status(404).send({message : 'No existen albums'});
            } else {
                res.status(200).send({album : album});
            }
        }
    });
}

// guardar un album
function saveAlbum(req, res){
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({message : 'Error en el servidor'});
        } else {      
            if (!albumStored) {               
                res.status(404).send({message : 'No se almaceno el album'});
            } else {
                res.status(200).send({album : albumStored});
            }
        }
    });
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
        if (err) {
            res.status(500).send({message : 'Error en el servidor'});            
        } else {
            if (!albumUpdated) {               
                res.status(404).send({message : 'No se almaceno el album'});
            } else {
                res.status(200).send({album : albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

     Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
        if (err) {
            res.status(500).send({message : 'Error al eliminar el Album ...'})
        } else {
            if (!albumRemoved) {
                res.status(404).send({message : 'El album no ha sido eliminado ...'});
            } else {
                Song.find({album : albumRemoved._id}).remove((err, songRemoved)=>{
                    if (err) {
                        res.status(500).send({message : 'Error al eliminar las canciones ...'})
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({message : 'Las canciones no han sido Eliminadas ...'});
                        } else {
                            return res.status(200).send({album : albumRemoved}); 
                        }
                    }
                });
            }
        }
    });
}

// cargar Imagenes
function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name = 'Imagen no cargada';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        file_name = file_split[file_split.length - 1];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif')
        {
            Album.findByIdAndUpdate(albumId, {image : file_name}, (err, albumUpdated)=>{
                if (err) {
                    res.status(500).send({ message : 'Error en el servidor ...' });
                } else {
                    if(!albumUpdated){
                        res.status(404).send({ message : 'No se ha podido actualizar el album ...' });
                    }else{
                        res.status(200).send({ artist : albumUpdated });
                    }                
                }   
            }); 

            
        } else{
            res.status(200).send({message : 'Extension del archivo no valida'});
        }
    }else{
        res.status(404).send({ message : 'No se ha cargado ninguna imagen ...' });
    }
}
// obtener las imagenes del servidor
function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_File = './uploads/album/' + imageFile;
    fs.exists(path_File, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_File));
        }else{
            res.status(200).send({message : 'No existe la imagen ...'});
        }
    });
}

// exportamos los metodos
module.exports = {
    getAlbum,
    getAlbums, 
    saveAlbum,
    updateAlbum, 
    deleteAlbum,
    uploadImage, 
    getImageFile
}
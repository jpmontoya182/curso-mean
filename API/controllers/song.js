'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
    var songId = req.params.id;

    Song.findById(songId).populate({path : 'album'}).exec((err, song)=>{
        if (err) {
             res.status(500).send({message : 'Error en el Servidor .. '});
        } else {
            if (!song) {
                 res.status(404).send({message : 'No existe esa cancion'});
            } else {
                res.status(200).send({song : song});
            }
        }
    });
}

function getSongs(req, res){
    var albumId = req.params.album;

    if (!albumId) {
        var find = Song.find().sort('number');
    } else {
        var find = Song.find({album : albumId}).sort('number');
    }

    find.populate({
        path : 'album', 
        populate : {
            path : 'artist', 
            model : 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
             res.status(500).send({message : 'Error en el Servidor .. '});
        } else {
            if (!songs) {
                res.status(404).send({message : 'No existen canciones'});
            } else {
                res.status(200).send({songs : songs});
            }
        }
    })
}

function saveSong(req, res){
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;  
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({message : 'Error en el Servidor .. '});
        } else {
            if (!songStored) {
                res.status(404).send({message : 'No se pudo almacenar la cancion'});
            } else {
                res.status(200).send({song : songStored});
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
        if (err) {
             res.status(500).send({message : 'Error en el Servidor .. '});
        } else {
            if (!songUpdated) {
                res.status(404).send({message : 'No se pudo actualizar la cancion'});
            } else {
                res.status(200).send({song : songUpdated});  
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, songRemove)=>{
        if (err) {
             res.status(500).send({message : 'Error en el Servidor .. '});
        } else {
            if (!songRemove) {
                res.status(404).send({message : 'No se pudo borrar la cancion'});
            } else {
                res.status(200).send({song : songRemove});  
            }
        }
    });
}

// cargar Imagen
function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'Imagen no cargada';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        file_name = file_split[file_split.length - 1];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if( file_ext == 'mp3' || file_ext == 'ogg')
        {
            Song.findByIdAndUpdate(songId, {file : file_name}, (err, songUpdated)=>{
                if(!songUpdated){
                    res.status(404).send({ message : 'No se ha podido actualizar la imagen ...' });
                }else{
                    res.status(200).send({ song : songUpdated });
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
function getFileSong(req, res){    
    var songFile = req.params.file;
    var path_File = './uploads/songs/' + songFile;
    fs.exists(path_File, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_File));
        }else{
            res.status(200).send({message : 'No existe la cancion ...'});
        }
    });
}

module.exports =  {
    getSong,
    saveSong, 
    getSongs, 
    updateSong, 
    deleteSong, 
    uploadFile, 
    getFileSong
}
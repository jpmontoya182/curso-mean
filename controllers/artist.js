'use strict'

var path = require('path');
var fs = require('fs');
var mogoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// obtener el artista por medio del id
function getArtist(req, res){
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) =>{
        if(err){
            res.status(500).send({message : 'Error en la peticion ...'});
        }else{
            if (!artist) {
                res.status(404).send({message : 'El artista no existe'});
            }else{
                res.status(200).send({artist});
            }
        }
    });
}
// Guardar Artista
function saveArtist(req, res){
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStore) => {
        if(err){
            res.status(500).send({message : 'Error al almacenar el artista'});            
        }else{
            if(!artistStore)
            {
                res.status(404).send({message : 'El artista no se guardo'});
            }else{
                res.status(200).send({artist : artistStore});
            }
        }
    })
}
// Obtenemos todos los artitas 
function getAllArtists(req, res){
    var page = req.params.page || 1;
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total)=>{
        if (err) {
            res.status(500).send({message : 'Error en la  petición ...'})
        } else {
            if (!artists) {
                res.status(404).send({message : 'No  hay artistas ..'});
            } else {
                return res.status(200).send({
                    total_items : total, 
                    artists : artists
                });
            }
        }
    })
}

function updateArtist(req, res){
    var artistId = req.params.id;    
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated)=>{
        if (err) {
            res.status(500).send({message : 'Error en la  petición ...'})
        } else {
            if (!artistUpdated) {
                res.status(404).send({message : 'No existe el artista ...'});
            } else {
                return res.status(200).send({artist : artistUpdated});
            }
        }
    })
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({message : 'Error en la  petición ...'})
        } else {
            if (!artistRemoved) {
                res.status(404).send({message : 'No existe el artista ...'});
            } else {
                Album.find({artist : artistRemoved._id}).remove((err, albumRemoved)=>{
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
                                        return res.status(200).send({artist : artistRemoved}); 
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}


// Exportamos las funciones
module.exports = {
    getArtist,
    saveArtist, 
    getAllArtists,
    updateArtist,
    deleteArtist
};
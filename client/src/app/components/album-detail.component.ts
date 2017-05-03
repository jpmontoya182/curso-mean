import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';

@Component({
    selector: 'album-detail', 
    templateUrl : '../views/album-detail.html',
    providers : [UserService, AlbumService,SongService]
})

export class AlbumDetailComponent implements OnInit{
    public album : Album;
    public songs : Song[];
    public identity;
    public token;
    public url: string;
    public alertMessage : string;
    public confirmado: string;

    constructor(
        private _route: ActivatedRoute, 
        private _router : Router,
        private _userService : UserService,
        private _albumService : AlbumService,
        private _songService : SongService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = this._userService.url;
      }

    ngOnInit(){
       // consultar album de la DB
       this.getAlbum();
    }

    getAlbum(){        
        this._route.params.forEach((params : Params) =>{
            let id = params['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {  
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {                        
                        this.album = response.album;  

                        this._songService.getSongs(this.token, response.album._id).subscribe(
                            response => {
                               if (!response.songs) {
                                   this.alertMessage = 'Este album no tiene canciones';
                               } else {
                                   this.songs = response.songs;
                               } 
                            },
                            error => {  
                                var errorMensaje = <any>error;
                                if (errorMensaje != null) {
                                    let body = JSON.parse(error._body);
                                    // this.alertMessage = body.message;
                                    console.log(error);
                                }
                            }
                        );
                    }
                }, 
                error => {
                    var errorMensaje = <any>error;
                    if (errorMensaje != null) {
                        let body = JSON.parse(error._body);
                        this.alertMessage = body.message;
                        console.log(error);
                    }
                }
            );
        }); 
    } 
    onDeleteConfirm(id: string)   {
        this.confirmado = id;
    }
    onCancelSong(){
        this.confirmado = null;
    }
    onDeleteSong(id){
        this._songService.deleteSong(this.token, id).subscribe(
            response => {
                if (!response.song) {
                    this.alertMessage = 'Error en el servidor';
                } else {
                   this.confirmado = null; 
                   this.getAlbum();
                }
            }, 
            error => {
                var errorMensaje = <any>error;
                if (errorMensaje != null) {
                    let body = JSON.parse(error._body);
                    this.alertMessage = body.message;
                    console.log(error);
                } 
            }
        );
    }
}
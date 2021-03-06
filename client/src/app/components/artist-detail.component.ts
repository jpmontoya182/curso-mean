import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail', 
    templateUrl : '../views/artist-detail.html',
    providers : [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit{
    public artist : Artist;
    public albums : Album[];
    public identity;
    public token;
    public url: string;
    public alertMessage : string;
    public confirmado: string;

    constructor(
        private _route: ActivatedRoute, 
        private _router : Router,
        private _userService : UserService,
        private _artistService : ArtistService, 
        private _albumService : AlbumService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = this._userService.url;
      }

    ngOnInit(){
       this.getArtist();
    }

    getArtist(){
        this._route.params.forEach((params : Params) =>{
            let id = params['id'];
            this._artistService.getArtist(this.token, id).subscribe(
                response => {  
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {                        
                        this.artist = response.artist;  
                        // mostrar los albumes relacionados
                        this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                            response => {                           
                                if (!response.album) {
                                    this.alertMessage = 'Este artista no tiene albums';
                                } else {
                                    this.alertMessage = '';
                                    this.albums = response.album;
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


    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onCancelAlbum(){
       this.confirmado = null; 
    }

    onDeleteAlbum(id){
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                if (!response.album) {
                    console.log('Error en el servidor !!')
                } else {
                   this.getArtist(); 
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
        )
    }

}
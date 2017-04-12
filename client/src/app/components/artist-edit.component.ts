import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-edit', 
    templateUrl : '../views/artist-add.html',
    providers : [UserService, ArtistService]
})

export class ArtistEditComponent implements OnInit{
    public titulo : string ;
    public artists : Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage : string;
    public is_edit : boolean;

    constructor(
        private _route: ActivatedRoute, 
        private _router : Router,
        private _userService : UserService,
        private _artistService : ArtistService
    ){
        this.titulo = 'Crear Nuevo Artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = this._userService.url;
        this.artists = new Artist('', '', '');
        this.is_edit = true;
      }

    ngOnInit(){
       // llamar el metodo del api para obtener el artista(getArtist)
       
    }

    onSubmit(){
        this._artistService.addArtist(this.token, this.artists).subscribe(
            response => {                
                if (!response.artist) {
                    this.alertMessage = 'Error en el servidor'
                } else {
                    this.artists = response.artist;
                    this._router.navigate(['/editar-artista'], response.artist._id);
                }
            }, 
            error => {
                var errorMensaje = <any>error;
                if (errorMensaje != null) {
                    let body = JSON.parse(error._body);
                    this.alertMessage = body.message;
                } 
            });
    }
}
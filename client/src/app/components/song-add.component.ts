import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';

import { Song } from '../models/song';


@Component({
    selector: 'song-add', 
    templateUrl : '../views/song-add.html',
    providers : [UserService, SongService]
})

export class SongAddComponent implements OnInit{
    public titulo : string ;
    public song : Song;
    public identity;
    public token;
    public url: string;
    public alertMessage : string;
    public is_edit : boolean;

    constructor(
        private _route: ActivatedRoute, 
        private _router : Router,
        private _userService : UserService,
        private _songService : SongService

    ){
        this.titulo = 'Crear nueva cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = this._userService.url;
        this.song = new Song(1,'', '','','');
        this.is_edit = true;
      }

    ngOnInit(){
       
    }

    onSubmit(){
            this._route.params.forEach((params : Params) =>{
            let album_id = params['album'];
            this.song.album = album_id;

            this._songService.addSong(this.token, this.song).subscribe(
                response => {
                    if (!response.song) {
                        this.alertMessage = 'Error en el servidor'; 
                    } else {
                        this.song = response.song;
                        console.log(response);
                        this._router.navigate(['/editar-cancion', response.song._id]);
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
}
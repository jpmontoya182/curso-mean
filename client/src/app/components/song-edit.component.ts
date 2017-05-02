import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { UploadService } from "../services/upload.service";

import { Song } from '../models/song';


@Component({
    selector: 'song-edit', 
    templateUrl : '../views/song-add.html',
    providers : [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit{
    public titulo : string ;
    public song : Song;
    public identity;
    public token;
    public url: string;
    public alertMessage : string;
    public is_edit : boolean;
    public filesToUpload : Array<File>;

    constructor(
        private _route: ActivatedRoute, 
        private _router : Router,
        private _userService : UserService,
        private _songService : SongService, 
        private _uploadService : UploadService

    ){
        this.titulo = 'Editar canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = this._userService.url;
        this.song = new Song(1,'', '','','');
        this.is_edit = true;
      }

    ngOnInit(){
        // obtener la informacion de la cancion a editar
        this.getSong();
    }

    onSubmit(){
            this._route.params.forEach((params : Params) =>{
            let id = params['id'];

            this._songService.editSong(this.token, id, this.song).subscribe(
                response => {
                    if (!response.song) {
                        this.alertMessage = 'Error en el servidor'; 
                    } else {
                        this.alertMessage = 'La canción se ha actaulizado correctamente';
                        if (!this.filesToUpload) {
                            this._router.navigate(['/album', response.song.album]);
                        } else {
                            // subir fichero de audio 
                            this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file')
                                .then(                                
                                        (result) => {                                    
                                            this._router.navigate(['/album', response.song.album]);                                     
                                        }, 
                                        (error) => {
                                            console.log(error);
                                        }
                                    ) 
                        }  
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

    // evento para cuando se carga la imagen desde el html
    fileChangeEvent(fileInput : any){        
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    getSong(){
        this._route.params.forEach((params : Params) =>{
            let id = params['id'];
            this._songService.getSong(this.token, id).subscribe(
                response =>{
                    if (!response.song) {
                        this._router.navigate(['/']);
                    } else {
                        this.song = response.song;
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
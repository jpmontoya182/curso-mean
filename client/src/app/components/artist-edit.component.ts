import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from "../services/upload.service";
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-edit', 
    templateUrl : '../views/artist-add.html',
    providers : [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
    public titulo : string ;
    public artist : Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage : string;
    public is_edit : boolean;

    constructor(
        private _route: ActivatedRoute, 
        private _router : Router,
        private _userService : UserService,
        private _artistService : ArtistService,
        private _uploadService : UploadService
    ){
        this.titulo = 'Editar Artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = this._userService.url;
        this.artist = new Artist('', '', '');
        this.is_edit = true;
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
        });
    }

    onSubmit(){
        this._route.params.forEach((params : Params) =>{
        let id = params['id'];

        this._artistService.editArtist(this.token,id, this.artist).subscribe(
                response => {                
                    if (!response.artist) {
                        this.alertMessage = 'Error en el servidor'
                    } else {
                        if (!this.filesToUpload) {
                            this._router.navigate(['/artistas', 1]);  
                        } else {
                        // subir la imagen del artista
                            this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image')
                                .then(                                
                                    (result) => {                                    
                                        // falta evaluar cuando viene un mensaje con un error
                                        this._router.navigate(['/artistas', 1]);                                     
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
                    } 
                });
        });
    }        


    public filesToUpload : Array<File>;
    fileChangeEvent(fileInput : any){        
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
        
    }
}
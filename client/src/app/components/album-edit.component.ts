import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from "../services/upload.service";
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'album-edit', 
    templateUrl : '../views/album-add.html',
    providers : [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit{
    public titulo : string ;
    public artist : Artist;
    public album : Album;
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
        private _albumService : AlbumService, 
        private _uploadService : UploadService
    ){
        this.titulo = 'Modificar Album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = this._userService.url;    
        this.album = new Album('','', 2017,'','');
        this.is_edit = true;
      }
    // metodo que se ejecuta cuando se carga  la clase  
    ngOnInit(){
        this.getAlbum();
    }
    // obtenemos los detalles del album por medio del id del Album
    getAlbum(){
       this._route.params.forEach((params : Params) => {
           let id = params['id'];
           this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;   
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
    // 
    onSubmit(){
        this._route.params.forEach((params : Params) => {
            let id = params['id'];

            this._albumService.editAlbum(this.token, id, this.album).subscribe(
                response => {
                    if (!response.album) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = 'El album se ha actualizado correctamente !';
                        if (!this.filesToUpload) {
                            this._router.navigate(['/artista', response.album.artist]);
                        } else {
                            // subir imagen del album
                            this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                                .then(                                
                                        (result) => {                                    
                                            this._router.navigate(['/artista', response.album.artist]);                                     
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
            )
        });
    }

    // evento para cuando se carga la imagen desde el html
    fileChangeEvent(fileInput : any){        
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
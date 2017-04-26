import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service'
import { User } from '../models/user';

@Component({
    selector : 'user-edit',
    templateUrl : '../views/user-edit.html',
    providers : [UserService, UploadService]
})

export class UserEditComponent implements OnInit{
    public titulo : string;
    public user : User;
    public identity;
    public token ;
    public alertMessage;
    public url : string ;

    constructor(
        private _userService : UserService,
        private _uploadService : UploadService
    ){
        this.titulo = 'Actualizar mis datos';        
        // localStorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user =  this.identity;
        this.url = this._userService.url;
    }

    ngOnInit(){

    }    

    onSubmit(){
        return this._userService.updateUser(this.user).subscribe(
            response => {                
                if (!response.user) {
                    this.alertMessage = 'El usuario no se ha actualizado';
                } else {  
                    // this.user = response.user;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById('identity_name').innerHTML = this.user.name; 

                    if (!this.filesToUpload) {
                        // redireccion
                    } else {
                        this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
                            .then((result: any)=>{
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));
                                let image_path = this.url + 'get-image-user/' + this.user.image;
                                document.getElementById('image-logged').setAttribute('src', image_path);
                            })
                    }

                    this.alertMessage = 'El usuario se ha actualizado correctamente';
                }
            },
            error => {
            
                var errorM = <any>error;
                if (errorM != null) {
                    let body = JSON.parse(error._body);
                    this.alertMessage = body.message;
                }
            });
    }

    public filesToUpload : Array<File>;

    fileChangeEvent(fileInput : any){
        this.filesToUpload = <Array<File>>fileInput.target.files;        
    }   
}

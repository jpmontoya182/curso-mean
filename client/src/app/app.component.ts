import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers : [UserService]
  
})
export class AppComponent implements OnInit{
  public title = 'musify';
  public user : User;
  public user_register : User;
  public identity;
  public token;
  public errorMensaje;
  public alertRegister;
  public url: string;

  constructor(
    private _userService: UserService
  ){
    this.url = this._userService.url;
    this.user =  new User('','','','','','ROLE_USER','null');
    this.user_register =  new User('','','','','','ROLE_USER','null');
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){
    // validamos en el servicio el email y pass.
    this._userService.singup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if (!this.identity._id) {
          alert('el usuario no esta correctamente identificado')
        } else {
          // Crear el locasstorage 
          localStorage.setItem('identity', JSON.stringify(identity));
          // Obtener el token
          this._userService.singup(this.user, true).subscribe(
            response => {
              let token = response.token;
              this.token = token;

              if (this.token.lenght <= 0) {
                alert('el token no se ha generado')
              }else{
                // crea elemento en el localStorage para tener el token
                localStorage.setItem('token', token);
              }
            }, 
            error => {
                var errorM = <any>error;
                if (errorM != null) {
                  var body = JSON.parse(error._body);
                  this.errorMensaje = body.message;
                }
            }
          );
        }
      }, 
      error =>{
        var errorM = <any>error;
        if (errorM != null) {
          var body = JSON.parse(error._body);
          this.errorMensaje = body.message;
        } 
      }
    );
  }

  onSubmitRegister(){
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;
        if (!user._id) {
          this.alertRegister = 'Error al registrarse';
        } else {
          this.alertRegister = 'El registro se realizado correctemante, identificate con  : ' + this.user_register.email;
          this.user_register = new User('','','','','','ROLE_USER','null');
        }
      }, 
      error => {
        var errorM = <any>error;
        if (errorM != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
        }
      }
    )
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('identity');   
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this.user =  new User('','','','','','ROLE_USER','null');
    this.errorMensaje = null;
  }

}

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
  public identity;
  public token;
  public errorMensaje;

  constructor(
    private _userService: UserService
  ){
    this.user =  new User('','','','','','ROLE_USER','null');
  }

  ngOnInit(){

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
          // Obtener el token
          this._userService.singup(this.user, true).subscribe(
            response => {
              let token = response.token;
              this.token = token;

              if (this.token.lenght <= 0) {
                alert('el token no se ha generado')
              }else{
                console.log(token);
                console.log(identity);
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
        console.log(response);
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
}

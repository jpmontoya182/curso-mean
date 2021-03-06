import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
// mapear objectos 
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import { transversales } from './GLOBAL';

@Injectable()
export class UserService{
    public url: string;
    public identity;
    public token;

    constructor(private _https: Http){
        this.url = transversales.url;
    }

    public singup(user_to_login, gethash = null){
        if (gethash != null) {
           user_to_login.gethash  =  gethash;
        } 
        let json = JSON.stringify(user_to_login);
        let params = json;
        let headers = new Headers({'Content-Type': 'application/json'});

        return this._https.post(this.url + 'login', params, {headers : headers})
                          .map(res => res.json());
    }

    public getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        if (identity != 'undefined') {
            this.identity = identity; 
        } else {
            this.identity = null;
        }
        return this.identity;
    }
    
    public getToken(){
        let token = localStorage.getItem('token');
        if (token != 'undefined') {
            this.token = token; 
        } else {
            this.token = null;
        }
        return this.token;
    }

    public register(user_to_register){
        // convertir a un string
        let params = JSON.stringify(user_to_register);
        let headers = new Headers({'Content-Type': 'application/json'});

        return this._https.post(this.url + 'register', params, {headers : headers})
                          .map(res => res.json());

    }

    public updateUser(user_to_update){
        let params = JSON.stringify(user_to_update);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization' : this.getToken()
        });
        return this._https.put(this.url+'update-user/'+user_to_update._id, params, {headers: headers})
                          .map(res => res.json());
    }
}
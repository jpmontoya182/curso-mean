import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
// mapear objectos 
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './GLOBAL';

@Injectable()
export class UserService{
    public url: string;

    constructor(private _https: Http){
        this.url = GLOBAL.url;
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

}

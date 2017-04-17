import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'; // -> mapear objectos 
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './GLOBAL';
import { Artist } from '../models/artist';

@Injectable()
export class UploadService{
    public url: string;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

     makeFileRequest(url : string, params : Array<string>, files : Array<File>, token : string, name : string){ 
        return new Promise((resolve, reject)=> {
            var formData : any = new FormData();
            var xhr = new XMLHttpRequest();

            for (var i =  0; i < files.length; i++) {
                formData.append(name, files[i], files[i].name);                
            }

            xhr.onreadystatechange = ()=>{
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response)
                    }
                } 
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}
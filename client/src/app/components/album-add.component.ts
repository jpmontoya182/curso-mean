import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'album-add', 
    templateUrl : '../views/album-add.html',
    providers : [UserService, ArtistService]
})

export class AlbumAddComponent implements OnInit{
    public titulo : string ;
    public artist : Artist;
    public album : Album;
    public identity;
    public token;
    public url: string;
    public alertMessage : string;


    constructor(
        private _route: ActivatedRoute, 
        private _router : Router,
        private _userService : UserService,
        private _artistService : ArtistService
    ){
        this.titulo = 'Crear nuevo Album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = this._userService.url;
        this.album = new Album('','', 2017,'','');
      }

    ngOnInit(){
       
    }

}
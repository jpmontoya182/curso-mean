import { Component, OnInit } from "@angular/core";
import { Song } from "../models/song";
import { transversales } from '../services/global'


@Component({
    selector : 'player', 
    template : `
        <div class="album-image">
            <span *ngIf="song.album">
                <img id="play-image-album" src="{{url + 'get-image-album/' + song.album.image}}" />
            </span>
            <span *ngIf="!song.album">
               <img id="play-image-album" src="assets/images/music.png" /> 
            </span>
        </div>
        <div class="audio-file">
            <p>Reproduciendo</p>
            <span id="play-song-title">
                {{song.name}}
            </span>
            |
            <span id="play-song-artist">
                <span *ngIf="song.artist">
                    {{song.album.artist.name}}
                </span>                
            </span>
            <audio controls id="player">
                <source id="mp3-source" src="{{url + 'get-song-file/' + song.file }}" type="audio/mpeg" >
                    Tu navegador no es compatible con el reproductor
            </audio>
        </div>
       `
})

export class PlayerComponent implements OnInit{
    public url : string;
    public song;

    constructor(){
       this.url = transversales.url;
       this.song = new Song(1,'', '', '', '');
    }

    ngOnInit(){

    }
}
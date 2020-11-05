import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})
export class WebcamComponent implements OnInit {

  image: any;

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.connect();
  }

  private myWebSocket: WebSocketSubject<any>;

  public connect(): void {
      this.myWebSocket = webSocket('ws://192.168.1.65:80');
      console.log("OPEN");
      this.myWebSocket.subscribe(
             msg => {
              // Convert to JSON
              var stringData: any = JSON.stringify(msg);
              // Parse JSON
              var data: any = JSON.parse(stringData);
              var type: any = data.type;
              console.log("type :" , type);
              if(type && type == 'image') {
                this.image = this.domSanitizer.bypassSecurityTrustUrl("data:image/jpg;base64, " + data.image);
                console.log("this.image :" , this.image);
              }
             },
             // Called whenever there is a message from the server
             err => console.log(err),
             // Called if WebSocket API signals some kind of error
             () => console.log('complete')
             // Called when connection is closed (for whatever reason)
          );
  }
}

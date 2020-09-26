import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError,Observable, of } from 'rxjs';
import {catchError, map, take} from 'rxjs/operators';
import * as io from 'socket.io-client';
let url = "http://localhost:3000/";

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  observable: Observable<string>;
  socket;

  constructor(private http: HttpClient) {
    this.socket = io(url);
  }
  public get(skip) {
    return this.http.get(url + `stocks?skip=${skip}`).pipe(map((data: any) => data.data ), 
    catchError(error => { return throwError(error)})
    );
  };
  public post(data): Observable<any> {
    return this.http.post(url + 'stocks', data,{}).pipe(map((data: any) => data.data ), 
    catchError(error => { return throwError(error)})
    );
  };
  public getGraphData(): Observable<any> {
    return this.http.get(url + 'stocks-analytics').pipe(map((data: any) => data.data ), 
    catchError(error => { return throwError(error)})
    );
  };

  public getData(): Observable<string> {
    return this.observable = new Observable((observer) => 
      this.socket.on('newStock', (data) => observer.next(data))
    );
  }
} 

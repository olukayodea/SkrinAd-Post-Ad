import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models/users';
import { Advert } from '../_models/advert';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.baseUrl;
  apiKey: string = environment.apiKey;

  constructor(
    private http: HttpClient,
  ) {}

  getToken() {
    return localStorage.getItem('token');
  }

  getUser(): Observable<User> {
    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'key': this.apiKey.toString(),
        'Authorization' : this.getToken()
      })
    }
    
    const responseData = this.get(this.baseUrl + 'user', httpOptions);

    return responseData;
  }

  advert(): Observable<Advert> {
    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'key': this.apiKey.toString(),
        'Authorization' : this.getToken()
      })
    }
    
    const responseData = this.get(this.baseUrl + 'advert', httpOptions);

    return responseData;
  }

  postAnswers( data ) {
    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'key': this.apiKey.toString(),
        'Authorization' : this.getToken()
      })
    }
    const responseData = this.post(this.baseUrl + 'answers', JSON.stringify(data), httpOptions);
    return responseData;
  }
 
  
  /**
   * POST Request
   * @param url API URL
   * @param jsonData JSON encoded Data
   * @param httpOptions HTTP Options
   */
  post(url, jsonData, httpOptions): Observable<any> {
    return this.http.post<any>(url, jsonData, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  /**
   * PUT Request
   * @param url API URL
   * @param jsonData JSON encoded Data
   * @param httpOptions HTTP Options
   */
  put(url, jsonData, httpOptions): Observable<any> {
    return this.http.put<any>(url, jsonData, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  
  /**
   * GET request
   * @param url API URL
   * @param httpOptions HTTP Options
   */
  get(url, httpOptions): Observable<any> {
    return this.http.get<any>(url, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  
  /**
   * DELETE request
   * @param url API URL
   * @param httpOptions HTTP Options
   */
  delete(url, httpOptions): Observable<any> {
    return this.http.delete<any>(url, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  errorHandl(error) {
    return throwError("Can not connect to service "+error);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { TokenStorageService } from './token-storage.service';

const AUTH_API = 'http://localhost:8080/api/auth/';
const ORDER_API = 'http://localhost:8080/api/order';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUserId: number;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
    ) { }

    private getOptions(user: User) {
      let base64UserAndPassword = window.btoa(user.username + ":" + user.password);
  
      let basicAccess = 'Basic ' + base64UserAndPassword;
  
      let options = {
        headers: {
          'Authorization': basicAccess,
          'Content-Type': 'application/json',
        }
      };
  
      return options;
    }

    private getHeader() 
    {
      let token = this.tokenStorageService.getToken();
      let bearerAccess = 'Bearer '+token;
      
      let options = {
        headers: {
          'Authorization': bearerAccess,
          'Content-Type': 'application/json',
        }
      };

      return options;
      }

  login(user: User): Observable<any> {
    return this.http.post(AUTH_API + 'signin', null, this.getOptions(user));
  }

  register(user, id:number): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password,
      name: user.name,
      lastName: user.lastName,
      id_address: id 
    }, httpOptions);
  }


  setCurrentUserId(id: number) {
    this.currentUserId = id;
  }

  getCurrentUserId(): number {
    return this.currentUserId;
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(AUTH_API + id, this.getHeader());
  }


  update(id: number ,user: User): Observable<any> {
    return this.http.put(AUTH_API + id, {

      username: user.username,
      email: user.email,
      name: user.name,
      lastName: user.lastName
    }, this.getHeader());
  }

  addOrder(order): Observable<any> {
    return this.http.post( ORDER_API, {
      total: order.total,
      status: order.status,
      id_user: order.id_user
    }, this.getHeader());
  }
  

  
          



  }


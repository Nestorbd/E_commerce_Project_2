import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Products } from '../models/product';
import { Address } from '../models/address';
import { User } from '../models/user';
import { Order } from '../models/order';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
    
  })
};
const apiUrlProducts = "http://localhost:8080/api/product"
const apiAddress = "http://localhost:8080/api/address"
const apiOrder = "http://localhost:8080/api/order"
const AUTH_API = 'http://localhost:8080/api/auth/';


@Injectable({
  providedIn: 'root'
})


export class EcommerceService {

  private cart = [];
  private cartItemCount = new BehaviorSubject(0);
  currentProductId: number;
  currentOrderId: number;
  currentAddressId: number;
  currentUserId: number;


  constructor(private httpClient: HttpClient,
     private tokenStorageService: TokenStorageService,
     private authService: AuthService) { }

  private getHeader() 
  {
    let token = this.tokenStorageService.getToken();
    let bearerAccess = 'Bearer '+token;
    console.log("Estoy en ecommerce")
    let options = {
      headers: {
        'Authorization': bearerAccess,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };

    return options;
    }

  getProducts(): Observable<Products[]> {
    return this.httpClient.get<Products[]>(apiUrlProducts)
      .pipe(
        tap(products => console.log('fetched products')),
        catchError(this.handleError('getProducts', []))
      );
  }


  addProduct(product: Products): Observable<any> {

    let bodyEncoded = new URLSearchParams();
    bodyEncoded.append("name", product.name);
    bodyEncoded.append("description", product.description);
    bodyEncoded.append("price", product.price.toString());
    bodyEncoded.append("taxRate", product.taxRate);
    bodyEncoded.append("image", product.image);
    bodyEncoded.append("category", product.category);
    bodyEncoded.append("availability", product.availability);
    let body = bodyEncoded.toString();

    return this.httpClient.post(apiUrlProducts, body, this.getHeader())
  }

  deleteProduct(id: number): Observable<any>{
    return this.httpClient.delete(apiUrlProducts + "/" + id, this.getHeader())
  }

  setCurrentProductId(id: number) {
    this.currentProductId = id;
  }

  getCurrentProductId(): number {
    return this.currentProductId;
  }

  getProductById(id: number): Observable<Products> {
    return this.httpClient.get<Products>(apiUrlProducts + "/" + id);
  }




  updateProduct(id: number, product: Products): Observable<any> {
    let bodyEncoded = new URLSearchParams();
    bodyEncoded.append("name", product.name);
    bodyEncoded.append("description", product.description);
    bodyEncoded.append("price", product.price.toString());
    bodyEncoded.append("taxRate", product.taxRate);
    bodyEncoded.append("image", product.image);
    bodyEncoded.append("category", product.category);
    bodyEncoded.append("availability", product.availability);
    let body = bodyEncoded.toString();

    return this.httpClient.put(apiUrlProducts + "/" + id, body, this.getHeader())

  }



  deleteTrack(id: number): Observable<any>{
    return this.httpClient.delete(apiOrder + "/" + id, this.getHeader())
  }


  
  setCurrentOrderId(id: number) {
    this.currentOrderId = id;
  }

  getCurrentOrderId(): number {
    return this.currentOrderId;
  }





  
  updateUser(id: number, user: User): Observable<any> {
    let bodyEncoded = new URLSearchParams();
    bodyEncoded.append("username", user.username);
    bodyEncoded.append("email", user.email);
    bodyEncoded.append("name", user.name);
    bodyEncoded.append("lastName", user.lastName);
    
    let body = bodyEncoded.toString();

    return this.httpClient.put(AUTH_API + id, body, this.getHeader())

  }




 

  

  

  getAddress(): Observable<Address[]> {
    return this.httpClient.get<Address[]>(apiAddress)
      .pipe(
        tap(address => console.log('fetched address')),
        catchError(this.handleError('getAddress', []))
      );
  }
 

  addAddress(address: Address): Observable<any> {

    let bodyEncoded = new URLSearchParams();
    bodyEncoded.append("street", address.street);
    bodyEncoded.append("number", address.number);
    bodyEncoded.append("zipCode", address.zipCode);
    bodyEncoded.append("location", address.location);
    bodyEncoded.append("province", address.province);
    bodyEncoded.append("country", address.country);
    let body = bodyEncoded.toString();

    return this.httpClient.post(apiAddress, body, httpOptions)
  }


  setCurrentAddressId(id: number) {
    this.currentAddressId = id;
  }

  getCurrentAddressId(): number {
    return this.currentAddressId;
  }

  getAddressById(): Observable<Address[]> {
    let id = this.getCurrentAddressId();
    console.log(id);
    
    return this.httpClient.get<Address[]>(apiAddress + "/" + id)
      .pipe(
        tap(address => console.log('fetched address')),
        catchError(this.handleError('getAddress', []))
      );
  }


  deleteAddress(id: number): Observable<any>{
    return this.httpClient.delete(apiAddress + "/" + id, this.getHeader())
  }


  setCurrentUserId(id: number) {
    this.currentOrderId = id;
  }

  getCurrentUserId(): number {
    return this.currentOrderId;
  }

  /*getTrackById(): Observable<Order[]> {
    let id_user = this.getCurrentUserId();
    console.log(id_user);
    
    return this.httpClient.get<Order[]>( apiOrder + "/" + id_user)
      .pipe(
        tap(order => console.log('fetched order')),
        catchError(this.handleError('getOrder', []))
      );
  }*/

  getOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(apiOrder, this.getHeader())
      .pipe(
        tap(order => console.log('fetched order')),
        catchError(this.handleError('getOrder', []))
      );
  }

  getTrackById(): Observable<Order[]> {
    let id = this.getCurrentOrderId();
    console.log(id);
    
    return this.httpClient.get<Order[]>(apiOrder + "/" + 3, this.getHeader())
    .pipe(
      tap(order => console.log('fetched order')),
      catchError(this.handleError('getOrder', []))
    );
  }


  updateOrder(id: number, order: Order): Observable<any> {
    let bodyEncoded = new URLSearchParams();
    bodyEncoded.append("status", order.status);
    let body = bodyEncoded.toString();

    return this.httpClient.put(apiOrder + "/" + id, body, this.getHeader())

  }
  


  private handleError<T>(operation = 'operation', result ?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
  


  getCart() {
    return this.cart;
  }

  getCartItemCount() {
    return this.cartItemCount;
  }

  
}
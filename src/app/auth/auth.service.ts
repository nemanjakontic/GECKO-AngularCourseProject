import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthResponseData {
  idToken:string;
  email:string;
  refreshToken:string;
  expiresIn:string;
  localId:string;	
  registered?:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCfpVsgclKFH8QowzJIPcUxO52mYsDyOEM',
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(catchError(error => {
        let errorMessage = 'Unknown error';
        if(!error.error || !error.error.error) {
          return throwError(errorMessage);
        }
        switch (error.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'User with same email already exists!';
            break;
        
          default:
            break;
        }
        return throwError(errorMessage);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCfpVsgclKFH8QowzJIPcUxO52mYsDyOEM',
      {
        email,
        password,
        returnSecureToken: true
      }
    )
  }

}

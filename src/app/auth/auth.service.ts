import * as AuthActions from './store/auth.actions';
import { Store } from '@ngrx/store';
import { User } from './user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import * as fromAuth from './store/auth.reducer';

import { environment } from '../../environments/environment';

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

  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router,
              private store: Store<fromAuth.State>) { }

  // signUp(email: string, password: string) {
  //   return this.http.post<AuthResponseData>(
  //     'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIkey,
  //     {
  //       email,
  //       password,
  //       returnSecureToken: true
  //     }
  //   ).pipe(catchError(this.handleError), tap(responseData => {
  //       this.handleAuthentication(
  //         responseData.email,
  //         responseData.localId,
  //         responseData.idToken,
  //         +responseData.expiresIn
  //       );
  //   }));
  // }

  // login(email: string, password: string) {
  //   return this.http.post<AuthResponseData>(
  //     'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIkey,
  //     {
  //       email,
  //       password,
  //       returnSecureToken: true
  //     }
  //   ).pipe(catchError(this.handleError), tap(responseData => {
  //     this.handleAuthentication(
  //       responseData.email,
  //       responseData.localId,
  //       responseData.idToken,
  //       +responseData.expiresIn
  //     );
  //   }));
  // }

  // autoLogin() {
  //   const userData: {
  //     email: string;
  //     id: string;
  //     _token: string;
  //     _tokenExpirationDate: string;
  //   } = JSON.parse(localStorage.getItem('userData'));
  //   if(!userData) {
  //     return;
  //   } else {
  //     const loadedUser = new User(
  //                               userData.email,
  //                               userData.id,
  //                               userData._token,
  //                               new Date(userData._tokenExpirationDate));
  //     if(loadedUser.token) {
  //       this.autoLogout(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
  //       // this.user.next(loadedUser);
  //       this.store.dispatch(new AuthActions.AuthenticateSuccess({email: loadedUser.email,
  //                                                   userId: loadedUser.id,
  //                                                 token: loadedUser.token,
  //                                                 expirationDate: new Date(userData._tokenExpirationDate)}));
  //     }
  //   }
  // }

  // logout() {
  //   // this.user.next(null);
  //   this.store.dispatch(new AuthActions.Logout());
  //   // this.router.navigate(['/auth']);
  //   localStorage.removeItem('userData');
  //   if(!this.tokenExpirationTimer) {
  //     clearTimeout(this.tokenExpirationTimer);
  //   }
  //   this.tokenExpirationTimer = null;
  // }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogOutTimer() {
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  // private handleAuthentication(
  //     email:string,
  //     userId: string,
  //     token: string,
  //     expIn: number
  //   ) {
  //     const expirationDate = new Date(new Date().getTime() + expIn * 1000);
  //     const user = new User(
  //                       email,
  //                       userId,
  //                       token,
  //                       expirationDate);
  //     // this.user.next(user);
  //     this.store.dispatch(new AuthActions.AuthenticateSuccess({email, userId, token, expirationDate}));
  //     this.autoLogout(expIn * 1000);
  //     localStorage.setItem('userData', JSON.stringify(user));
  // }

  // private handleError(error: HttpErrorResponse) {
  //   let errorMessage = 'Unknown error';
  //   if(!error.error || !error.error.error) {
  //     return throwError(errorMessage);
  //   }
  //   switch (error.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'User with same email already exists!';
  //       break;

  //       case 'EMAIL_NOT_FOUND':
  //         errorMessage = 'User with entered email does not exist!';
  //         break;

  //     default:
  //       break;
  //   }
  //   return throwError(errorMessage);
  // }

}

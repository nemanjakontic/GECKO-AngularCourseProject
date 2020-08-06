import { AuthService } from './../auth.service';
import { User } from './../user.model';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuth = (resData) => {
  const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
  const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expirationDate,
            redirect: true
          });
}

const handleError = (error) => {
  let errorMessage = 'Unknown error';
        if(!error.error || !error.error.error) {
          return of(new AuthActions.AuthenticateFail(errorMessage));
        }
        switch (error.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'User with same email already exists!';
            break;

            case 'EMAIL_NOT_FOUND':
              errorMessage = 'User with entered email does not exist!';
              break;

          default:
            break;
        }
        return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIkey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)), map(resData => {
        return handleAuth(resData);
      }), catchError(error => {
        return handleError(error);
      }));;
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIkey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)), map(resData => {
        return handleAuth(resData);
      }), catchError(error => {
        return handleError(error);
      }));
    }),

  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if(authSuccessAction.payload.redirect){
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if(!userData) {
        return {type: 'DUMMY'};
      } else {
        const loadedUser = new User(
                                  userData.email,
                                  userData.id,
                                  userData._token,
                                  new Date(userData._tokenExpirationDate));
        if(loadedUser.token) {
          // this.autoLogout(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
          // this.user.next(loadedUser);
          this.authService.setLogoutTimer(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
          return new AuthActions.AuthenticateSuccess({email: loadedUser.email,
                                                      userId: loadedUser.id,
                                                    token: loadedUser.token,
                                                    expirationDate: new Date(userData._tokenExpirationDate),
                                                    redirect: false});
        }
        return {type: 'DUMMY'};
      }
    })
  )

  @Effect({dispatch: false})
  authLogoout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogOutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  )



  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) { }
}

import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import * as fromApp from '../store/app.reducer';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router,
                private store: Store<fromApp.AppState>){}

    canActivate(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): boolean
                                        | Promise<boolean | UrlTree>
                                        | Observable<boolean | UrlTree>
                                        | UrlTree{
        return this.store.select('auth').pipe(take(1),
        map(authState => {
          return authState.user;
        }),
        map(user => {
            const isAuth = !!user;
            if(isAuth) {
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        }));
    }
}

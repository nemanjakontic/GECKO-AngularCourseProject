import { Store } from '@ngrx/store';
import { AuthService, AuthResponseData } from './auth.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  @ViewChild('f') authForm: NgForm;

  isLogin = false;
  isLoading = false;
  error: string = null;
  private storeSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  switchMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
    if(!this.authForm.valid) {
      return;
    }
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    if (this.isLogin) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
    } else {
      // authObs = this.authService.signUp(email, password);
      this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
    }

    // authObs.subscribe(response => {
    //   this.isLoading = false;
    //   this.router.navigate(['/recipes']);
    // }, error => {
    //   this.error = error;
    //   this.isLoading = false;
    // });

    this.authForm.reset();
  }

  onHandleError() {
    // this.error = null;
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

}

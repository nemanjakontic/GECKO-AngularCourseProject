import * as AuthActions from './auth/store/auth.actions';
import { AuthService } from './auth/auth.service';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import * as fromApp from './store/app.reducer';
import { Store } from '@ngrx/store';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService,
              private store: Store<fromApp.AppState>,
              @Inject(PLATFORM_ID) private platformID){}

  ngOnInit() {
    // this.authService.autoLogin();
    if(isPlatformBrowser(this.platformID)){
      this.store.dispatch(new AuthActions.AutoLogin());
    }
  }
}

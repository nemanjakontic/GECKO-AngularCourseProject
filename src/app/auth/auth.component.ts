import { AuthService } from './auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  @ViewChild('f') authForm: NgForm;

  isLogin = false;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
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

    this.isLoading = true;
    if (this.isLogin) {
      this.authService.login(email, password)
        .subscribe(response => {
          this.isLoading = false;
        }, error => {
          this.error = error;
          this.isLoading = false;
        });
    } else {
      this.authService.signUp(email, password)
        .subscribe(response => {
          this.isLoading = false;
        }, error => {
          this.error = error;
          this.isLoading = false;
        });
    }
    this.authForm.reset();
  }

}

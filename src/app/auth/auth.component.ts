import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponse, AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error!: string;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const name = form.value.name;
    const email = form.value.email;
    const password = form.value.password;
    let obs: Observable<AuthResponse>;

    this.isLoading = true;
    if (this.isLoginMode) {
      obs = this.authService.login(email, password);
    } else {
      obs = this.authService.signUp(name, email, password);
    }

    obs.subscribe({
      next: (resData) => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: (errorMessage) => {
        this.isLoading = false;
        this.error = errorMessage;
      },
    });

    form.reset();
  }
}

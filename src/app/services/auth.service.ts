import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from '../common/user';

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  tokenExpirationTimer: any;

  private BaseUrl = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  signUp(name: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.BaseUrl}/register`, {
        name,
        email,
        password,
      })
      .pipe(
        catchError(this.errorHandler),
        tap((resdata) => {
          this.handleAuthentication(
            resdata.user.name,
            resdata.user.email,
            resdata.token,
            1800
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.BaseUrl}/login`, {
        email,
        password,
      })
      .pipe(
        catchError(this.errorHandler),
        tap((resdata) => {
          this.handleAuthentication(
            resdata.user.name,
            resdata.user.email,
            resdata.token,
            1800
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    let data = localStorage.getItem('userData');
    if (data) {
      const userData: {
        name: string
        email: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(data);

      if (!userData) {
        return;
      }
      const loadedUser = new User(
        userData.name,
        userData.email,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        this.user.next(loadedUser);
        // let expirationDuration =
        //   new Date().getTime() -
        //   new Date(userData._tokenExpirationDate).getTime()
          this.autoLogout(1000*60);
        }
      }
    }
    
    autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    name: string,
    email: string,
    token: string,
    expireIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expireIn * 1000);
    const user = new User(name, email, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expireIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private errorHandler(errhandle: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred!';
    if (!errhandle.error) {
      return throwError(() => errorMessage);
    }
    switch (errhandle.error.message) {
      case 'Email Already Exists':
        errorMessage = 'This email is exists already';
        break;
      case 'password size require 8-12':
        errorMessage = 'password size require 8-12 maximum';
        break;
      case 'User not found!':
        errorMessage = 'Unknown username and password';
        break;
      case 'Bad credentials':
        errorMessage = 'Unknown username and password';
        break;
    }
    return throwError(() => errorMessage);
  }
}

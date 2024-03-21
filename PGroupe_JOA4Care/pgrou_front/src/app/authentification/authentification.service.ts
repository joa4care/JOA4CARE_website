import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  exhaustMap,
  Observable,
  Subject,
  take,
  tap,
  throwError,
} from 'rxjs';
import { User } from './user.model';
import { user_db, UsersData } from './users_db.model';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Activite } from '../activites/activite.model';

export interface AuthentificationResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthentificationService {
  // @ts-ignore
  user = new BehaviorSubject<User>(null);
  // @ts-ignore
  user_db = new BehaviorSubject<user_db>(null);

  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, photo: string, password: string) {
    return this.http
      .post<AuthentificationResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDYI-Ex__TTsOCepNXyz-huH1tayFpJh3w',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
          this.saveUserDataToDatabase(resData.email, photo, resData.localId);
        })
      );
  }

  private saveUserDataToDatabase(email: string, photo: string, uid: string) {
    this.user.pipe(take(1)).subscribe((user) => {
      this.http
        .post(
          'https://pgrou-centrale-default-rtdb.firebaseio.com/users.json?auth=' +
            user.token,
          {
            email,
            photo: photo,
            uid,
            role: 'Normal user',
            listeActivites: [],
          }
        )
        .subscribe((response) => {
          console.log(response);
        });
    });
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthentificationResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDYI-Ex__TTsOCepNXyz-huH1tayFpJh3w',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }
  logout() {
    // @ts-ignore
    this.user.next(null);
    this.router.navigate(['/authentification']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    //this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Incorrect login or pass';
        break;
    }
    return throwError(errorMessage);
  }

  autoLogin() {
    // @ts-ignore
    const userDataString: string | null = localStorage.getItem('userData');
    if (!userDataString) {
      return;
    }
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(userDataString);
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  fetchUsers() {
    return this.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.get<{ [key: string]: UsersData }>(
          'https://pgrou-centrale-default-rtdb.firebaseio.com/users.json?auth=' +
            user.token
        );
      }),
      map((users) => {
        const usersArray: user_db[] = [];
        for (const key in users) {
          if (users.hasOwnProperty(key)) {
            usersArray.push(
              new user_db(
                users[key].email,
                users[key].photo,
                users[key].uid,
                users[key].role,
                key,
                users[key].listeActivites
              )
            );
          }
        }
        return usersArray;
      })
    );
  }
}

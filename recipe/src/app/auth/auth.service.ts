import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DbCredentialsService } from '../shared/db-credentials.service';
import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable( {
  providedIn: 'root'
} )
export class AuthService extends DbCredentialsService {
  /*user = new BehaviorSubject<User>( null );*/
  private tokenExpirationTimer: any;

  constructor( private http: HttpClient, private router: Router, private store: Store<fromApp.AppState> ) {
    super();
  }

  signup( email: string, password: string ): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>( super.signUpEndpoint, {
      email,
      password,
      returnSecureToken: true
    } ).pipe( catchError( this.handleError ), tap( resData => {
      this.handleAuthentication( resData.email, resData.localId, resData.idToken, +resData.expiresIn );
    } ) );
  }

  login( email: string, password: string ): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>( super.loginEndpoint, {
      email,
      password,
      returnSecureToken: true
    } ).pipe( catchError( this.handleError ), tap( resData => {
      this.handleAuthentication( resData.email, resData.localId, resData.idToken, +resData.expiresIn );
    } ) );
  }

  autoLogin(): void {
    const userData: {
      email: string,
      id: string,
      _TOKEN: string
      _TOKEN_EXPIRATION_DATE: string;
    } = JSON.parse( localStorage.getItem( 'userData' ) );

    if ( !userData ) {
      return;
    }

    const loadedUser = new User( userData.email, userData.id, userData._TOKEN, new Date( userData._TOKEN_EXPIRATION_DATE ) );

    if ( loadedUser.token ) {
      this.store.dispatch( new AuthActions.Login( {
        email: loadedUser.email,
        userId: loadedUser.id,
        token: loadedUser.token,
        expirationDate: new Date( userData._TOKEN_EXPIRATION_DATE )
      } ) );
      const expirationDuration = new Date( userData._TOKEN_EXPIRATION_DATE ).getTime() - new Date().getTime();
      this.autoLogout( expirationDuration );
    }
  }

  logout(): void {
    this.store.dispatch( new AuthActions.Logout() );
    this.router.navigate( [ '/auth' ] );

    localStorage.removeItem( 'userData' );

    if ( this.tokenExpirationTimer ) {
      clearTimeout( this.tokenExpirationTimer );
    }

    this.tokenExpirationTimer = null;
  }

  autoLogout( expirationDuration: number ): void {
    this.tokenExpirationTimer = setTimeout( () => this.logout(), expirationDuration );
  }

  private handleAuthentication( email: string, userId: string, token: string, expiresIn: number ): void {
    const expirationDate = new Date( new Date().getTime() + expiresIn * 1000 );
    const user = new User( email, userId, token, expirationDate );

    this.store.dispatch( new AuthActions.Login( { email, userId, token, expirationDate } ) );
    this.autoLogout( expiresIn * 1000 );
    localStorage.setItem( 'userData', JSON.stringify( user ) );
  }

  private handleError( errorRes: HttpErrorResponse ): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if ( !errorRes.error || !errorRes.error.error ) {
      return throwError( errorMessage );
    }

    switch ( errorRes.error.error.message ) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'Incorrect Email or Password!';
        break;
      default:
        errorMessage = 'An unknown error occurred!';
    }

    return throwError( errorMessage );
  }
}

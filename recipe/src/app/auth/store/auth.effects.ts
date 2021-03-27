import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

  @Effect()
  authLogin = this.actions$.pipe(
    ofType( AuthActions.LOGIN_START ),
    switchMap( ( authData: AuthActions.LoginStart ) => {
      return this.http.post<AuthResponseData>( 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        } ).pipe( map( resData => {
        const expirationDate = new Date( new Date().getTime() + +resData.expiresIn * 1000 );

        return new AuthActions.Login( {
          email: resData.email,
          userId: resData.localId,
          token: resData.idToken,
          expirationDate
        } );
      } ), catchError( errorRes => {
        let errorMessage = 'An unknown error occurred!';

        if ( !errorRes.error || !errorRes.error.error ) {
          return of( new AuthActions.LoginFail( errorMessage ) );
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

        return of( new AuthActions.LoginFail( errorMessage ) );
      } ) );
    } )
  );

  @Effect( { dispatch: false } )
  authSuccess = this.actions$.pipe( ofType( AuthActions.LOGIN ), tap( () => {
    this.router.navigate( [ '/' ] );
  } ) );

  constructor( private actions$: Actions, private http: HttpClient, private router: Router ) {
  }
}

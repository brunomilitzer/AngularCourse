import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DbCredentialsService } from '../shared/db-credentials.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService extends DbCredentialsService {
  private tokenExpirationTimer: any;

  constructor( private store: Store<fromApp.AppState> ) {
    super();
  }

  setLogoutTimer( expirationDuration: number ): void {
    this.tokenExpirationTimer = setTimeout( () => this.store.dispatch( new AuthActions.Logout() ), expirationDuration );
  }

  clearLogoutTimer(): void {
    if ( this.tokenExpirationTimer ) {
      clearTimeout( this.tokenExpirationTimer );
      this.tokenExpirationTimer = null;
    }
  }
}

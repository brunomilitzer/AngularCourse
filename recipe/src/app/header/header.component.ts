import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';


@Component( {
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.css' ]
} )
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor( private authService: AuthService, private dataStorageService: DataStorageService, private store: Store<fromApp.AppState> ) {
  }

  ngOnInit(): void {
    this.userSub = this.store.select( 'auth' ).pipe(
      map( authState => authState.user )
    ).subscribe( user => this.isAuthenticated = !!user );
  }

  onSaveData(): void {
    this.dataStorageService.storeRecipes();
  }

  onFetchData(): void {
    this.store.dispatch( new RecipeActions.FetchRecipes() );
  }

  onLogout(): void {
    this.store.dispatch( new AuthActions.Logout() );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}

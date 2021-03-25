import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DbCredentialsService } from './db-credentials.service';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable( { providedIn: 'root' } )
export class DataStorageService extends DbCredentialsService {

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private store: Store<fromApp.AppState> ) {
    super();
  }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put( super.url, recipes ).subscribe( response => {
      console.log( response );
    } );
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.store.select( 'auth' ).pipe( map( authState => authState.user ) )
      .pipe( take( 1 ), exhaustMap( () => {
          return this.http.get<Recipe[]>( super.url );
        } ), map( recipes => {
          return recipes.map( recipe => {
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
          } );
        } ),
        tap( recipes => {
          this.recipeService.setRecipes( recipes );
        } ) );
  }
}

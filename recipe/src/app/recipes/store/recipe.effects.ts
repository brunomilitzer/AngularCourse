import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { environment } from '../../../environments/environment';
import * as RecipesActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipies = this.actions$.pipe(
    ofType( RecipesActions.FETCH_RECIPES ),
    switchMap( () => {
      return this.http.get<Recipe[]>( environment.recipesUrl );
    } ),
    map( recipes => {
      return recipes.map( recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
      } );
    } ),
    map( recipes => {
      return new RecipesActions.SetRecipes( recipes );
    } )
  );

  @Effect( { dispatch: false } )
  storeRecipes = this.actions$.pipe(
    ofType( RecipesActions.STORE_RECIPES ),
    withLatestFrom( this.store.select( 'recipes' ) ),
    switchMap( ( [ actionData, recipesState ] ) => {
      return this.http.put( environment.recipesUrl, recipesState.recipes );
    } ) );

  constructor( private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState> ) {
  }
}

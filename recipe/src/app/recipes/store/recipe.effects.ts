import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import { environment } from '../../../environments/environment';
import * as RecipesActions from './recipe.actions';

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

  constructor( private actions$: Actions, private http: HttpClient ) {
  }
}

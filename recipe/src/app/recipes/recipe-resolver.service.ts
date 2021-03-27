import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable( { providedIn: 'root' } )
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor( private store: Store<fromApp.AppState>, private actions$: Actions ) {
  }

  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<never> {
    this.store.dispatch( new RecipesActions.FetchRecipes() );
    return this.actions$.pipe( ofType( RecipesActions.SET_RECIPES ), take( 1 ) );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DbCredentialsService } from './db-credentials.service';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable( { providedIn: 'root' } )
export class DataStorageService extends DbCredentialsService {

  constructor( private http: HttpClient, private recipeService: RecipeService, private authService: AuthService ) {
    super();
  }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put( super.url, recipes ).subscribe( response => {
      console.log( response );
    } );
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.authService.user.pipe( take( 1 ), exhaustMap( user => {
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

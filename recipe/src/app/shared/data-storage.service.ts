import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {DatabaseCredentialsService} from './database-credentials.service';
import {Recipe} from '../recipes/recipe.model';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataStorageService extends DatabaseCredentialsService {

  constructor(private http: HttpClient, private recipeService: RecipeService) {
    super();
  }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put(super.getDbFullUrl(), recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(super.getDbFullUrl())
      .pipe(map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}

import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/Ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor( private slService: ShoppingListService ) {
  }

  setRecipes( recipes: Recipe[] ): void {
    this.recipes = recipes;
    this.recipesChanged.next( this.recipes.slice() );
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe( index: number ): Recipe {
    return this.recipes[index];
  }

  addIngredientsToShoppingList( ingredients: Ingredient[] ): void {
    this.slService.addIngredients( ingredients );
  }

  addRecipe( recipe: Recipe ): void {
    this.recipes.push( recipe );
    this.recipesChanged.next( this.recipes.slice() );
  }

  updateRecipe( index: number, recipe: Recipe ): void {
    this.recipes[index] = recipe;
    this.recipesChanged.next( this.recipes.slice() );
  }

  deleteRecipe( index: number ): void {
    this.recipes.splice( index, 1 );
    this.recipesChanged.next( this.recipes.slice() );
  }
}

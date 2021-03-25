import { Subject } from 'rxjs';
import { Ingredient } from '../shared/Ingredient.model';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient( 'Ground Beef', 350 ),
    new Ingredient( 'Bread', 1 )
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  getIngredient( index: number ): Ingredient {
    return this.ingredients[index];
  }

  addIngredient( ingredient: Ingredient ): void {
    this.ingredients.push( ingredient );
    this.ingredientsChanged.next( this.ingredients.slice() );
  }

  addIngredients( ingredients: Ingredient[] ): void {
    this.ingredients.push( ...ingredients );
    this.ingredientsChanged.next( this.ingredients.slice() );
  }

  updateIngredient( index: number, newIngredient: Ingredient ): void {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next( this.ingredients.slice() );
  }

  deleteIngredient( index: number ): void {
    this.ingredients.splice( index, 1 );
    this.ingredientsChanged.next( this.ingredients.slice() );
  }
}

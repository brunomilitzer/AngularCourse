import { Subject } from 'rxjs';
import { Ingredient } from '../shared/Ingredient.model';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient( 'Ground Beef', 350 ),
    new Ingredient( 'Bread', 1 )
  ];

  getIngredient( index: number ): Ingredient {
    return this.ingredients[index];
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

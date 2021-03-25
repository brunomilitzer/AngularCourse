import { Ingredient } from '../../shared/Ingredient.model';
import { Action } from '@ngrx/store';
import * as SLActions from './shopping-list.actions';

const initialState = {
  ingredients: [
    new Ingredient( 'Ground Beef', 350 ),
    new Ingredient( 'Bread', 1 )
  ]
};

export function shoppingListReducer( state = initialState, action: SLActions.AddIngredient ): { ingredients: (Ingredient | Action)[] } {
  switch ( action.type ) {
    case SLActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [ ...state.ingredients, action.payload ]
      };
    default:
      return state;
  }
}

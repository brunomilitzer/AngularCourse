import { Ingredient } from '../../shared/Ingredient.model';
import { Action } from '@ngrx/store';
import * as SLActions from './shopping-list.actions';

export interface AppState {
  shoppingList: State;
}

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [
    new Ingredient( 'Ground Beef', 350 ),
    new Ingredient( 'Bread', 1 )
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(
  state = initialState,
  action: SLActions.ShoppingListActions ): { ingredients: (Ingredient | Action)[] } {

  switch ( action.type ) {
    case SLActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [ ...state.ingredients, action.payload ]
      };
    case SLActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [ ...state.ingredients, ...action.payload ]
      };
    default:
      return state;
  }
}

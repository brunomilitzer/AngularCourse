import { User } from '../user.model';
import * as AuthActions from './auth.actions';
import { LOGIN, LOGOUT } from './auth.actions';

export interface State {
  user: User;
}

const initialState: State = {
  user: null
};

export function authReducer( state = initialState, action: AuthActions.AuthActions ): State {

  console.log( state );
  switch ( action.type ) {
    case LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user
      };
    case LOGOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

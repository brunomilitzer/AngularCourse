import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/Ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component( {
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: [ './shopping-edit.component.css' ]
} )
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild( 'f' ) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editedItem: Ingredient;

  constructor(
    private slService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      ( index: number ) => {
        this.editItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient( index );
        this.slForm.setValue( {
          name: this.editedItem.name,
          amount: this.editedItem.amount
        } );
      }
    );
  }

  onSubmit( form: NgForm ): void {
    const value = form.value;
    const newIngredient: Ingredient = new Ingredient( value.name, value.amount );
    if ( this.editMode ) {
      this.slService.updateIngredient( this.editItemIndex, newIngredient );
    } else {
      this.store.dispatch( new ShoppingListActions.AddIngredient( newIngredient ) );
    }
    this.editMode = false;
    form.reset();
  }

  onClear(): void {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete(): void {
    this.slService.deleteIngredient( this.editItemIndex );
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/Ingredient.model';
import { Store } from '@ngrx/store';
import * as SLActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component( {
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: [ './shopping-edit.component.css' ]
} )
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild( 'f' ) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.store.select( 'shoppingList' ).subscribe( stateData => {
      if ( stateData.editedIngredientIndex > -1 ) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue( {
          name: this.editedItem.name,
          amount: this.editedItem.amount
        } );
      } else {
        this.editMode = false;
      }
    } );
  }

  onSubmit( form: NgForm ): void {
    const value = form.value;
    const newIngredient: Ingredient = new Ingredient( value.name, value.amount );
    if ( this.editMode ) {
      this.store.dispatch( new SLActions.UpdateIngredient( newIngredient ) );
    } else {
      this.store.dispatch( new SLActions.AddIngredient( newIngredient ) );
    }
    this.editMode = false;
    form.reset();
  }

  onClear(): void {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch( new SLActions.StopEdit() );
  }

  onDelete(): void {
    this.store.dispatch( new SLActions.DeleteIngredient() );
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch( new SLActions.StopEdit() );
  }
}

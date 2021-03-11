import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/Ingredient.model';
import {ShoppingListService} from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput') nameInputRef: ElementRef;
  @ViewChild('ammountInput') ammountInputRef: ElementRef;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
  }

  onAddItem(): void {
    const ingredientName = this.nameInputRef.nativeElement.value;
    const ingredientAmmount = this.ammountInputRef.nativeElement.value;
    const newIngredient: Ingredient = new Ingredient(ingredientName, ingredientAmmount);
    this.slService.addIngredient(newIngredient);
  }

}

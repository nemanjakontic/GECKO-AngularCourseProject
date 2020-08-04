import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
  exportAs: 'ngForm'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: false}) form: NgForm;
  id: number;
  editSubscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) { }

  ngOnInit(): void {
    this.editSubscription = this.shoppingListService.startedEditing.subscribe(index => {
      this.id = index;
      this.editMode = true;
      this.editedItem = this.shoppingListService.getIngredient(this.id);
      this.form.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      });
    });
  }

  onSubmit() {
    const ingredient = new Ingredient(this.form.value.name, this.form.value.amount);
    if(this.editMode) {
      this.shoppingListService.updateIngredient(this.id, ingredient);
    } else {
      // this.shoppingListService.addIngredient(ingredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }
    this.onClearForm();
  }

  onClearForm() {
    this.form.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.id);
    this.onClearForm();
  }

  ngOnDestroy() {
    this.editSubscription.unsubscribe();
  }

}

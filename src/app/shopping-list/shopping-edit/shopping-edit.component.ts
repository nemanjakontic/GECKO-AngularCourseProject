import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f') form: NgForm;
  id: number;
  editSubscription: Subscription;
  editMode = false;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.editSubscription = this.shoppingListService.startedEditing.subscribe(index => {
      this.id = index;
      this.editMode = true;
      this.shoppingListService.getIngredient(this.id);
    });
  }

  onSubmit() {
    const ingredient = new Ingredient(this.form.value.name, this.form.value.amount);
    this.shoppingListService.addIngredient(ingredient);
  }

  ngOnDestroy() {
    this.editSubscription.unsubscribe();
  }

}

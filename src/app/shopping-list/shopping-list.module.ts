import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';


@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    ShoppingListRoutingModule
  ]
})
export class ShoppingListModule {}

import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipeSub: Subscription;

  constructor(private recipeService: RecipesService,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.recipeSub = this.store.select('recipes')
      .pipe(map(recipesState => {
        return recipesState.recipes;
      }))
      .subscribe(recipes => {
        this.recipes = recipes;
      });
  }

  onSelectRecipe(recipe: Recipe) {
  }

  ngOnDestroy() {
    this.recipeSub.unsubscribe();
  }

}

import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  recipeSub: Subscription;
  
  constructor(private recipeService: RecipesService,
              private router: Router) { }

  ngOnInit(): void {
    this.recipeSub = this.recipeService.recipesUpdated
      .subscribe(recipes => {
        this.recipes = recipes;
      });
    this.recipes = this.recipeService.getRecipes();
  }

  onSelectRecipe(recipe: Recipe) {
  }

  ngOnDestroy() {
    this.recipeSub.unsubscribe();
  }

}

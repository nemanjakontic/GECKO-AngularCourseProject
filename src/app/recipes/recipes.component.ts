import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipesService } from './recipes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy {
  selectedRecipe: Recipe;
  private recipeSub: Subscription;

  constructor(private recipeService: RecipesService) { }

  ngOnInit(): void {
    this.recipeSub = this.recipeService.recipeSelected
      .subscribe( (recipe:Recipe) => {
        this.selectedRecipe = recipe;
      });
  }

  ngOnDestroy() {
    this.recipeSub.unsubscribe();
  }

}

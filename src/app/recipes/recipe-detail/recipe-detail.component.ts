import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import * as RecipeAction from '../store/recipes.actions';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  recipeId: number;

  constructor(private recipeService: RecipesService,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.recipeId = +params.id;
      // this.recipe = this.recipeService.getRecipe(this.recipeId);
      this.store.select('recipes').pipe(map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.recipeId;
        })
      })).subscribe(recipe => {
        this.recipe = recipe;
      })
    });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.recipeId);
    this.store.dispatch(new RecipeAction.DeleteRecipe(this.recipeId));
    this.router.navigate(['../']);
  }

}

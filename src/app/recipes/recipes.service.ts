import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe 1', 
      'This is simply a test 1', 
      'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/chorizo-mozarella-gnocchi-bake-cropped.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Tomato', 4),
        new Ingredient('Meat', 3)
      ]
      ),
    new Recipe(
      'A Test Recipe 2', 
      'This is simply a test 2', 
      'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/chorizo-mozarella-gnocchi-bake-cropped.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Tomato', 4),
        new Ingredient('Meat', 3)
      ]
      ),
    new Recipe(
      'A Test Recipe 3', 
      'This is simply a test 3', 
      'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/chorizo-mozarella-gnocchi-bake-cropped.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Tomato', 4),
        new Ingredient('Meat', 3)
      ]
      )
  ];

  constructor(private slService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}

import { AuthService } from './../auth/auth.service';
import { RecipesService } from './../recipes/recipes.service';
import { Recipe } from './../recipes/recipe.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, 
              private recipesService: RecipesService, 
              private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put(
        'https://geckoangularproject.firebaseio.com/recipes.json', 
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    
    return this.http
      .get<Recipe[]>(
        'https://geckoangularproject.firebaseio.com/recipes.json'
        ).pipe(
    map(response => {
      return response.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      })
    }), 
      tap(recipes => {
        this.recipesService.setRecipes(recipes);
      }));
  }

}

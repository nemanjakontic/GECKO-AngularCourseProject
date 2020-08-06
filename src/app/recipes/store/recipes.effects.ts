import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipeAction from './recipes.actions';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) {}

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeAction.FETCH_RECIPES),
    switchMap(() => {
      return this.http
      .get<Recipe[]>(
        'https://geckoangularproject.firebaseio.com/recipes.json'
        );
    }), map(response => {
      return response.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }), map(recipes => {
      return new RecipeAction.SetRecipes(recipes);
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipeAction.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http
        .put(
          'https://geckoangularproject.firebaseio.com/recipes.json',
          recipesState.recipes
        );
      })
  );

}

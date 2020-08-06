import { take, map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RecipesService } from './recipes.service';
import { DataStorageService } from './../shared/data-storage.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipeAction from '../recipes/store/recipes.actions';
import { Actions, ofType} from '@ngrx/effects';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{

  constructor(private dataStorageService: DataStorageService,
              private recipesService: RecipesService,
              private store: Store<fromApp.AppState>,
              private actions$: Actions) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const recipes = this.recipesService.getRecipes();
    // if(recipes.length === 0) {
    //   return this.dataStorageService.fetchRecipes();
    // } else {
    //   return recipes;
    // }
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap(recipes => {
        if(recipes.length == 0) {
          this.store.dispatch(new RecipeAction.FetchRecipes());
          return this.actions$.pipe(
            ofType(RecipeAction.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );

  }

}

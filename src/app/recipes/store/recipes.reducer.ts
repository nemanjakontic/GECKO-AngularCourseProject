import { Recipe } from './../recipe.model';
import * as RecipeAction from './recipes.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
};

export function recipeReducer(state = initialState, action: RecipeAction.RecipeAction) {
  switch (action.type) {
    case RecipeAction.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      }
    case RecipeAction.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      }
    case RecipeAction.UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.recipe
      }
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;
      return {
        ...state,
        recipes: updatedRecipes
      }
    case RecipeAction.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.payload;
        })
      }
    default:
      return state;
  }
}

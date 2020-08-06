import * as RecipeAction from './../store/recipes.actions';
import { map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;
  editRecipe: Recipe;
  private storeSub: Subscription;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipesService,
              private router: Router,
              private store:  Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.editMode = params['id']!= null;
      this.initForm();
    });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDesc = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode) {
      // this.editRecipe = this.recipeService.getRecipe(this.id);
      this.storeSub = this.store.select('recipes').pipe(
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.id;
          })
        })
      ).subscribe(recipe => {
        this.editRecipe = recipe;
        recipeName = this.editRecipe.name;
        recipeImagePath = this.editRecipe.imagePath;
        recipeDesc = this.editRecipe.description;
        if(this.editRecipe.ingredients) {
          for(let ingr of this.editRecipe.ingredients) {
            recipeIngredients.push(new FormGroup({
              name: new FormControl(ingr.name, Validators.required),
              amount: new FormControl(ingr.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            }));
          }
        }
        this.recipeForm = new FormGroup({
          name: new FormControl(recipeName, Validators.required),
          imagePath: new FormControl(recipeImagePath, Validators.required),
          description: new FormControl(recipeDesc, Validators.required),
          ingredients: recipeIngredients
        });
      })
    } else {
      this.recipeForm = new FormGroup({
        name: new FormControl(recipeName, Validators.required),
        imagePath: new FormControl(recipeImagePath, Validators.required),
        description: new FormControl(recipeDesc, Validators.required),
        ingredients: recipeIngredients
      });
    }
  }

  onSubmit() {
    const newRecipe = new Recipe(this.recipeForm.value.name,
                                  this.recipeForm.value.description,
                                  this.recipeForm.value.imagePath,
                                  this.recipeForm.value.ingredients);
    if(this.editMode) {
      // this.recipeService.updateRecipe(this.id, newRecipe);
      this.store.dispatch(new RecipeAction.UpdateRecipe({index: this.id, recipe: newRecipe}));
    } else {
      // this.recipeService.addRecipe(newRecipe);
      this.store.dispatch(new RecipeAction.AddRecipe(newRecipe));
    }
    this.router.navigate(['../']);
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onClearForm() {
    this.recipeForm.reset();
    this.editMode = false;
  }

  onCancel() {
    this.router.navigate(['../']);
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  ngOnDestroy() {
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

}

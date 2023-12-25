import { Injectable } from '@angular/core';
import { Ingredient, Mealcategory, Mealtype, Recipe } from './app.model';
import { ApiService } from './api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageEnum, StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private apiService: ApiService, private storageService: StorageService) {}

  private nameState = new BehaviorSubject<string>('');
  name = this.nameState.asObservable();

  private recipesState = new BehaviorSubject<Recipe[]>([]);
  recipes = this.recipesState.asObservable();

  private favoritesState = new BehaviorSubject<Recipe[]>([]);
  favorites = this.favoritesState.asObservable();

  private ingredientsState = new BehaviorSubject<Ingredient[]>([]);
  ingredients = this.ingredientsState.asObservable();

  private mealcategoryState = new BehaviorSubject<Mealcategory[]>([]);
  mealcategories = this.mealcategoryState.asObservable();

  private mealtypesState = new BehaviorSubject<Mealtype[]>([]);
  mealtypes = this.mealtypesState.asObservable();

  async init() {
    const name = await this.storageService.get(StorageEnum.USER_NAME);
    this.nameState.next(name);
    this.getAllRecipes();
    this.getAllMealcategories();
    this.getAllMealtypes();
    this.getAllIngredients();
  }

  setNameState(name: string) {
    this.nameState.next(name);
  }

  getAllRecipes() {
    this.apiService
      .getAllRecipes()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          console.log(res);
          if (res.body) {
            this.recipesState.next(res.body);
          }
        },
        error: err => {
          console.warn(err);
        }
      });
  }

  createNewRecipe(recipe: Recipe) {
    console.log('create recipe here');
    this.apiService
      .createNewRecipe(recipe)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          console.log('Adding ' + res + ' to data...');
          const recipes = this.recipesState.getValue();
          recipes.push(res);
          this.recipesState.next(recipes);
        },
        error: err => console.warn(err)
      });
  }

  updateRecipe(recipe: Recipe) {
    console.log('update recipe here');
  }

  getAllMealcategories() {
    this.apiService
      .getAllMealcategories()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          console.log(res);
          if (res.body) {
            this.mealcategoryState.next(res.body);
          }
        },
        error: err => {
          console.warn(err);
        }
      });
  }

  createNewMealcategory(name: string) {
    console.log(name);
    this.apiService
      .createMealcategory({ name: name })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          console.log('Adding ' + res + ' to data...');
          const categories = this.mealcategoryState.getValue();
          categories.push(res);
          this.mealcategoryState.next(categories);
        },
        error: err => console.warn(err)
      });
  }

  getAllMealtypes() {
    this.apiService
      .getAllMealtypes()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          console.log(res);
          if (res.body) {
            this.mealtypesState.next(res.body);
          }
        },
        error: err => {
          console.warn(err);
        }
      });
  }

  createNewMealtype(name: string) {
    console.log(name);
    this.apiService
      .createMealtype({ name: name })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          console.log('Adding ' + res + ' to data...');
          const types = this.mealtypesState.getValue();
          types.push(res);
          this.mealtypesState.next(types);
        },
        error: err => console.warn(err)
      });
  }

  getAllIngredients() {
    this.apiService
      .getAllIngredients()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          console.log(res);
          if (res.body) {
            this.ingredientsState.next(res.body);
          }
        },
        error: err => {
          console.warn(err);
        }
      });
  }

  createNewIngredient(name: string) {
    console.log(name);
    this.apiService
      .createIngredient({ name: name })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          console.log('Adding ' + res + ' to data...');
          const ingredients = this.ingredientsState.getValue();
          ingredients.push(res);
          this.ingredientsState.next(ingredients);
        },
        error: err => console.warn(err)
      });
  }
}

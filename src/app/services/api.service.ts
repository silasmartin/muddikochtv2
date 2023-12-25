import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Ingredient, Mealcategory, Mealtype, Recipe } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  endpoint: string;

  constructor(private http: HttpClient) {
    this.endpoint = environment.apiUrl;
  }

  public getAllRecipes() {
    return this.http.get<Recipe[]>(`${this.endpoint}recipes`, {
      observe: 'response',
      headers: {
        'X-REQUESTED-WITH': 'XMLHttpRequest'
      }
    });
  }

  createNewRecipe(recipe: Recipe) {
    const body = new FormData();
    body.append('mealcategories', JSON.stringify(recipe.mealcategories));
    body.append('cooktimeInMinutes', String(recipe.cooktimeInMinutes));
    body.append('name', recipe.name);
    body.append('ingredients', JSON.stringify(recipe.ingredients));
    body.append('persons', String(recipe.persons));
    body.append('preptimeInMinutes', String(recipe.preptimeInMinutes));
    body.append('mealtypes', JSON.stringify(recipe.mealtypes));
    body.append('prepSteps', JSON.stringify(recipe.prepSteps));

    // TODO handle images
    console.log(body);
    return this.http.post<Recipe>(`${this.endpoint}recipes`, body);
  }

  public getAllMealcategories() {
    return this.http.get<Mealcategory[]>(`${this.endpoint}mealcategories`, {
      observe: 'response',
      headers: {
        'X-REQUESTED-WITH': 'XMLHttpRequest'
      }
    });
  }

  public createMealcategory(category: Mealcategory) {
    console.log(category.name);
    const body = new FormData();
    body.append('name', category.name);
    console.log(body);
    return this.http.post<Mealcategory>(`${this.endpoint}mealcategories`, body);
  }

  public getAllMealtypes() {
    return this.http.get<Mealtype[]>(`${this.endpoint}mealtypes`, {
      observe: 'response',
      headers: {
        'X-REQUESTED-WITH': 'XMLHttpRequest'
      }
    });
  }

  public createMealtype(type: Mealtype) {
    console.log(type.name);
    const body = new FormData();
    body.append('name', type.name);
    console.log(body);
    return this.http.post<Mealtype>(`${this.endpoint}mealtypes`, body);
  }

  public getAllIngredients() {
    return this.http.get<Ingredient[]>(`${this.endpoint}ingredients`, {
      observe: 'response',
      headers: {
        'X-REQUESTED-WITH': 'XMLHttpRequest'
      }
    });
  }

  public createIngredient(ingredient: Ingredient) {
    console.log(ingredient.name);
    const body = new FormData();
    body.append('name', ingredient.name);
    console.log(body);
    return this.http.post<Ingredient>(`${this.endpoint}ingredients`, body);
  }
}

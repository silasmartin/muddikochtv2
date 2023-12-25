export interface Recipe {
  mealcategories: Mealcategory[];
  cooktimeInMinutes: number;
  createdOn: string;
  favorite: boolean;
  id?: number;
  images: string[];
  ingredients: Ingredient[];
  lastCooked?: string;
  name: string;
  persons: number;
  preptimeInMinutes: number;
  mealtypes: Mealtype[];
  prepSteps: string[];
}

export interface Mealcategory {
  name: string;
  id?: number;
}

export interface Mealtype {
  name: string;
  id?: number;
}

export interface Ingredient {
  name: string;
  amount?: number;
  unit?: string;
  id?: number;
}

export interface User {
  name: string;
  photos: string;
  id?: number;
}

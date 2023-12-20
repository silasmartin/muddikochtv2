import { Injectable, WritableSignal, signal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_NAME = 'muddikochtdb';

export interface Ingridients {
  name: string;
  amount: number;
  unit: string;
}

export class Recipe {
  private _id: number;
  private _name: string;
  private _favorite: number;
  private _persons: number;
  private _cookTimeInMinutes: number;
  private _prepTimeInMinutes: number;
  private _ingridients: Ingridients[];
  private _prepSteps: string[];
  private _mealTypes: MealType[];
  private _mealCategories: MealCategory[];
  private _imagePaths: string[];

  constructor(
    id: number,
    name: string,
    favorite: number,
    persons: number,
    cookTimeInMinutes: number,
    prepTimeInMinutes: number,
    ingridients: Ingridients[],
    prepSteps: string[],
    mealTypes: MealType[],
    mealCategories: MealCategory[],
    imagePaths: string[]
  ) {
    this._id = id;
    this._name = name;
    this._favorite = favorite;
    this._persons = persons;
    this._cookTimeInMinutes = cookTimeInMinutes;
    this._prepTimeInMinutes = prepTimeInMinutes;
    this._ingridients = ingridients;
    this._prepSteps = prepSteps;
    this._mealTypes = mealTypes;
    this._mealCategories = mealCategories;
    this._imagePaths = imagePaths;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get favorite() {
    return this._favorite;
  }
  get persons() {
    return this._persons;
  }
  get cookTimeInMinutes() {
    return this._cookTimeInMinutes;
  }
  get prepTimeInMinutes() {
    return this._prepTimeInMinutes;
  }
  get ingridients() {
    return this._ingridients;
  }
  get prepSteps() {
    return this._prepSteps;
  }
  get mealTypes() {
    return this._mealTypes;
  }
  get mealCategories() {
    return this._mealCategories;
  }
  get imagePaths() {
    return this._imagePaths;
  }
}

export class MealCategory {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class MealType {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class Weekplan {
  id: number;
  name: string;
  dayFromAsISO: string;
  dayToAsISO: string;
  recipes: Recipe[];

  constructor(id: number, name: string, dayFromAsISO: string, dayToAsISO: string, recipes: Recipe[]) {
    this.id = id;
    this.name = name;
    this.dayFromAsISO = dayFromAsISO;
    this.dayToAsISO = dayToAsISO;
    this.recipes = recipes;
  }
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private recipes: WritableSignal<Recipe[]> = signal<Recipe[]>([]);
  private mealCategories: WritableSignal<MealCategory[]> = signal<MealCategory[]>([]);
  private mealTypes: WritableSignal<MealType[]> = signal<MealType[]>([]);
  private weekplans: WritableSignal<Weekplan[]> = signal<Weekplan[]>([]);
  private favorites: WritableSignal<Recipe[]> = signal<Recipe[]>([]);

  constructor() {}

  async init() {
    this.db = await this.sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
    await this.db.open();
    const schema = `
    CREATE TABLE IF NOT EXISTS mealtype (
      id INTEGER PRIMARY KEY,
      name TEXT
    );
    CREATE TABLE IF NOT EXISTS mealcategory (
      id INTEGER PRIMARY KEY,
      name TEXT
    );
    CREATE TABLE IF NOT EXISTS weekplan (
      id INTEGER PRIMARY KEY,
      name TEXT,
      dayFromAsISO TEXT,
      dayToAsISO TEXT
    );
    CREATE TABLE IF NOT EXISTS recipe (
      id INTEGER PRIMARY KEY,
      name TEXT,
      favorite INTEGER,
      persons INTEGER,
      cookTimeInMinutes INTEGER,
      prepTimeInMinutes INTEGER,
      ingredients TEXT,
      prepSteps TEXT
    );
    CREATE TABLE IF NOT EXISTS image (
      id INTEGER PRIMARY KEY,
      filePath TEXT,
      recipeId INTEGER,
      FOREIGN KEY (recipeId) REFERENCES recipe (id)
    );
    CREATE TABLE IF NOT EXISTS mealcategoryrecipe (
      id INTEGER PRIMARY KEY,
      mealcategoryId INTEGER,
      recipeId INTEGER,
      FOREIGN KEY (recipeId) REFERENCES recipe (id),
      FOREIGN KEY (mealcategoryId) REFERENCES mealcategory (id)
    );
    CREATE TABLE IF NOT EXISTS mealtyperecipe (
      id INTEGER PRIMARY KEY,
      mealtypeId INTEGER,
      recipeId INTEGER,
      FOREIGN KEY (recipeId) REFERENCES recipe (id),
      FOREIGN KEY (mealtype) REFERENCES mealtype (id)
    );
    CREATE TABLE IF NOT EXISTS recipeweekplan (
      id INTEGER PRIMARY KEY,
      recipeId INTEGER,
      weekplanId INTEGER,
      FOREIGN KEY (recipeId) REFERENCES recipe (id),
      FOREIGN KEY (weekplanId) REFERENCES weekplan (id)
    );
    `;

    await this.db.execute(schema);
    this.loadRecipes();
  }

  async loadRecipes() {
    const recipes = await this.db.query('SELECT * FROM recipes');
    const recipesToSet: Recipe[] = [];
    if (recipes.values && recipes.values.length > 0) {
      recipes.values.forEach(async recipe => {
        const ingridients = JSON.parse(recipe.ingredients);
        const imagePaths = JSON.parse(recipe.imagePaths);
        const mealTypesToSet: MealType[] = [];
        const mealTypesQueried = await this.db.query(
          `SELECT * FROM mealtype mt INNER JOIN mealtyperecipe mtr ON mt.id = mtr.mealtypeId WHERE mtr.recipeId = '${recipe.id}'`
        );
        if (mealTypesQueried.values && mealTypesQueried.values.length > 0) {
          mealTypesQueried.values.forEach(mealtype => {
            mealTypesToSet.push(new MealType(mealtype.id, mealtype.name));
          });
        }
        const mealCategoriesToSet: MealCategory[] = [];
        const mealCategoriesQueried = await this.db.query(
          `SELECT * FROM mealcategory mc INNER JOIN mealcategoryrecipe mcr ON mc.id = mcr.mealcategoryId WHERE mr.recipeId = '${recipe.id}'`
        );
        if (mealCategoriesQueried.values && mealCategoriesQueried.values.length > 0) {
          mealCategoriesQueried.values.forEach(mealcategory => {
            mealCategoriesToSet.push(new MealCategory(mealcategory.id, mealcategory.name));
          });
        }
        recipesToSet.push(
          new Recipe(
            recipe.id,
            recipe.name,
            recipe.favorite,
            recipe.persons,
            recipe.cookTimeInMinutes,
            recipe.prepTimeInMinutes,
            ingridients,
            recipe.prepSteps,
            mealTypesToSet,
            mealCategoriesToSet,
            imagePaths
          )
        );
      });
    }
    this.recipes.set(recipesToSet);
    return recipesToSet;
  }

  async loadMealCategories() {
    const mealCategories = await this.db.query('SELECT * FROM mealcategories');
    const categoriesToSet: MealCategory[] = [];
    if (mealCategories.values && mealCategories.values.length > 0) {
      mealCategories.values.forEach(category => {
        categoriesToSet.push(new MealCategory(category.id, category.name));
      });
    }
    this.mealCategories.set(categoriesToSet);
    return categoriesToSet;
  }

  async loadMealTypes() {
    const mealTypes = await this.db.query('SELECT * FROM mealtypes');
    const typesToSet: MealType[] = [];
    if (mealTypes.values && mealTypes.values.length > 0) {
      mealTypes.values.forEach(type => {
        typesToSet.push(new MealCategory(type.id, type.name));
      });
    }
    this.mealTypes.set(typesToSet);
    return typesToSet;
  }

  async loadWeekplans() {
    const weekplans = await this.db.query('SELECT * FROM weekplans');
    const weekplansToSet: Weekplan[] = [];
    if (weekplans.values && weekplans.values.length > 0) {
      weekplans.values.forEach(async plan => {
        const recipesToSet: Recipe[] = [];
        const recipes = await this.loadRecipes();
        const recipesQueried = await this.db.query(
          `SELECT recipeId FROM recipeweekplan WHERE weekplanId = '${plan.id}'`
        );
        if (recipesQueried.values && recipesQueried.values.length > 0) {
          recipesQueried.values.forEach(id => {
            recipesToSet.push(recipes.find(r => r.id == id)!);
          });
        }
        weekplansToSet.push(new Weekplan(plan.id, plan.name, plan.dayFromAsISO, plan.dayToAsISO, recipesToSet));
      });
    }
    this.weekplans.set(weekplansToSet);
    return weekplansToSet;
  }

  addRecipe(recipe: Recipe) {
    const queries = [
      `INSERT INTO recipes(name, favorite, persons, cookTimeInMinutes, prepTimeInMinutes, ingredients, prepSteps) VALUES (${recipe.name},${recipe.favorite}, ${recipe.persons}, ${recipe.cookTimeInMinutes}, ${recipe.prepTimeInMinutes}, ${recipe.ingridients}, ${recipe.prepSteps}`
    ];
    recipe.mealCategories.forEach(category =>
      queries.push(`INSERT INTO mealcategoryrecipe (mealcategoryId, recipeId) VALUES (${category.id}, ${recipe.id})`)
    );
    recipe.mealTypes.forEach(type =>
      queries.push(`INSERT INTO mealtyperecipe (mealtypeId, recipeId) VALUES (${type.id}, ${recipe.id})`)
    );
    queries.forEach(q => this.db.query(q));
    this.loadRecipes();
  }

  addMealType(mealtype: MealType) {
    const query = `INSERT INTO mealtype (name) VALUES (${mealtype.name})`;
    this.loadMealTypes();
  }

  addMealCategory(category: MealCategory) {
    const query = `INSERT INTO mealcategory (name) VALUES (${category.name})`;
    this.loadMealCategories();
  }
}

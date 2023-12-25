import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController, IonModal } from '@ionic/angular';
import { Ingredient, Mealcategory, Mealtype, Recipe } from 'src/app/services/app.model';
import { DataService } from 'src/app/services/data.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { addIcons } from 'ionicons';
import { addCircle } from 'ionicons/icons';
import { Keyboard } from '@capacitor/keyboard';

@UntilDestroy()
@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.page.html',
  styleUrls: ['./create-recipe.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CreateRecipePage {
  @Input() inputRecipe?: Recipe;

  recipe: Recipe = {
    mealcategories: [],
    cooktimeInMinutes: 0,
    createdOn: 'string',
    favorite: false,
    images: [],
    ingredients: [],
    lastCooked: '',
    name: '',
    persons: 4,
    preptimeInMinutes: 0,
    mealtypes: [],
    prepSteps: []
  };

  availableMealcategories?: Mealcategory[];
  availableMealcategoriesFiltered?: Mealcategory[];

  availableMealtypes?: Mealtype[];
  availableMealtypesFiltered?: Mealtype[];

  availableIngredients?: Ingredient[];
  availableIngredientsFiltered?: Ingredient[];

  tempInstruction = '';

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService,
    private alertCtrl: AlertController
  ) {
    addIcons({ addCircle });
  }

  ionViewWillEnter() {
    if (this.inputRecipe) {
      this.recipe = this.inputRecipe;
    }
    this.dataService.mealcategories.pipe(untilDestroyed(this)).subscribe({
      next: categories => {
        this.availableMealcategories = categories;
        this.availableMealcategoriesFiltered = categories;
      },
      error: err => console.warn(err)
    });
    this.dataService.mealtypes.pipe(untilDestroyed(this)).subscribe({
      next: types => {
        this.availableMealtypes = types;
        this.availableMealtypesFiltered = types;
      },
      error: err => console.warn(err)
    });
    this.dataService.ingredients.pipe(untilDestroyed(this)).subscribe({
      next: ingredients => {
        this.availableIngredients = ingredients;
        this.availableIngredientsFiltered = ingredients;
      },
      error: err => console.warn(err)
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    if (this.recipe.id) {
      this.dataService.updateRecipe(this.recipe);
    } else {
      this.dataService.createNewRecipe(this.recipe);
    }
    this.modalCtrl.dismiss();
  }

  changeMealcategories(ev: any) {
    console.log(ev);
    if (ev.detail.checked) {
      this.recipe.mealcategories.push(ev.detail.value);
    } else {
      const index = this.recipe.mealcategories.findIndex(cat => cat.id == ev.detail.value.id);
      if (index > -1) {
        this.recipe.mealcategories.splice(index, 1);
      }
    }
  }

  async createNewMealcategory() {
    const alert = await this.alertCtrl.create({
      header: 'Kategorie zur Sammlung hinzufügen',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: res => {
            console.log(res[0]);
            this.dataService.createNewMealcategory(res[0]);
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          placeholder: 'Name',
          min: 1,
          max: 100
        }
      ]
    });

    await alert.present();
  }

  filterCategories(ev: any) {
    console.log(ev.detail.value);
    if (ev.detail.value.length < 1) {
      this.availableMealcategoriesFiltered = this.availableMealcategories;
      return;
    }
    this.availableMealcategoriesFiltered = this.availableMealcategories?.filter(category => {
      return category.name.toLowerCase().trim().indexOf(ev.detail.value.toLowerCase().trim()) > -1;
    });
  }

  checkMealcategory(category: Mealcategory) {
    return this.recipe.mealcategories.includes(category);
  }

  changeMealtypes(ev: any) {
    console.log(ev);
    if (ev.detail.checked) {
      this.recipe.mealtypes.push(ev.detail.value);
    } else {
      const index = this.recipe.mealtypes.findIndex(ty => ty.id == ev.detail.value.id);
      if (index > -1) {
        this.recipe.mealtypes.splice(index, 1);
      }
    }
  }

  async createNewMealtype() {
    const alert = await this.alertCtrl.create({
      header: 'Typ zur Sammlung hinzufügen',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: res => {
            console.log(res[0]);
            this.dataService.createNewMealtype(res[0]);
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          placeholder: 'Name',
          min: 1,
          max: 100
        }
      ]
    });

    await alert.present();
  }

  filterTypes(ev: any) {
    console.log(ev.detail.value);
    if (ev.detail.value.length < 1) {
      this.availableMealtypesFiltered = this.availableMealtypes;
      return;
    }
    this.availableMealtypesFiltered = this.availableMealtypes?.filter(type => {
      return type.name.toLowerCase().trim().indexOf(ev.detail.value.toLowerCase().trim()) > -1;
    });
  }

  checkMealtype(type: Mealtype) {
    return this.recipe.mealtypes.includes(type);
  }

  changeIngredients(ev: any) {
    console.log(ev);
    if (ev.detail.checked) {
      this.changeIngredientsAlert(ev.detail.value);
    } else {
      const index = this.recipe.ingredients.findIndex(ingredient => ingredient.id == ev.detail.value.id);
      if (index > -1) {
        this.recipe.ingredients.splice(index, 1);
      }
    }
  }

  async changeIngredientsAlert(ingredient: Ingredient) {
    const alert = await this.alertCtrl.create({
      header: `${ingredient.name} zum Rezept hinzufügen`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: res => {
            console.log(res[0]);
            console.log(res[1]);
            ingredient.amount = res[0];
            ingredient.unit = res[1];
            this.recipe.ingredients.push(ingredient);
          }
        }
      ],
      inputs: [
        {
          type: 'number',
          placeholder: 'Menge',
          min: 1
        },
        {
          type: 'text',
          placeholder: 'Einheit (l, ml, g, TL, ...',
          min: 1,
          max: 3
        }
      ]
    });

    await alert.present();
  }

  async createNewIngredient() {
    const alert = await this.alertCtrl.create({
      header: 'Zutat zur Sammlung hinzufügen',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: res => {
            console.log(res[0]);
            this.dataService.createNewIngredient(res[0]);
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          placeholder: 'Name',
          min: 1,
          max: 100
        }
      ]
    });

    await alert.present();
  }

  filterIngredients(ev: any) {
    console.log(ev.detail.value);
    if (ev.detail.value.length < 1) {
      this.availableIngredientsFiltered = this.availableIngredients;
      return;
    }
    this.availableIngredientsFiltered = this.availableIngredients?.filter(ingredient => {
      return ingredient.name.toLowerCase().trim().indexOf(ev.detail.value.toLowerCase().trim()) > -1;
    });
  }

  checkIngredient(ingredient: Ingredient) {
    return this.recipe.ingredients.includes(ingredient);
  }

  addStep() {
    console.log('Now adding ' + this.tempInstruction);
    if (this.tempInstruction.length < 1) {
      return;
    }
    this.recipe.prepSteps.push(this.tempInstruction);
    this.tempInstruction = '';
  }

  stepsReorder(ev: any) {
    console.log(ev);
    const draggedItem = this.recipe.prepSteps.splice(ev.detail.from, 1)[0];
    this.recipe.prepSteps.splice(ev.detail.to, 0, draggedItem);
    ev.detail.complete();
  }

  closeKeyboard() {
    Keyboard.hide();
  }
}

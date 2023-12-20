import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Recipe } from '../services/database.service';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { CreateRecipePage } from '../common/create-recipe/create-recipe.page';
import { addCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecipesPage implements OnInit {
  constructor(private modalCtrl: ModalController) {
    addIcons({ addCircle });
  }

  ngOnInit() {}

  async addRecipe(recipe?: Recipe) {
    console.log(recipe);
    const modal = await this.modalCtrl.create({
      component: CreateRecipePage,
      presentingElement: await this.modalCtrl.getTop(),
      canDismiss: true,
      keyboardClose: true,
      componentProps: {
        inputMeal: recipe
      }
    });
    modal.present();

    modal.onDidDismiss().then(data => {
      console.log(data);
    });
  }

  search(ev: any) {
    console.log(ev);
  }

  goToLetterGroup(ev: any) {
    const content = document.getElementById('content') as any;
    const group = document.getElementById(ev);
    if (group) {
      console.log(content);
      console.log(group);
      const customScroll = group.getBoundingClientRect().top + document.body.scrollTop;
      console.log(customScroll);
      content.scrollToPoint(undefined, customScroll, 600);
    }

    console.log(ev);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-meal-categories',
  templateUrl: './meal-categories.page.html',
  styleUrls: ['./meal-categories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MealCategoriesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

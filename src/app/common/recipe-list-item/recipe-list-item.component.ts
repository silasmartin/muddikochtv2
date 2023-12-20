import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Recipe } from 'src/app/services/database.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-recipe-list-item',
  templateUrl: './recipe-list-item.component.html',
  styleUrls: ['./recipe-list-item.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeListItemComponent implements OnInit {
  @Input() recipe!: Recipe;

  constructor() {}

  ngOnInit() {}

  openItem() {}
}

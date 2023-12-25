import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageEnum, StorageService } from '../services/storage.service';
import { DataService } from '../services/data.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  name = '';

  constructor(private storageService: StorageService, private dataService: DataService) {}

  ngOnInit() {
    this.dataService.name.pipe(untilDestroyed(this)).subscribe({
      next: name => {
        this.name = name;
      },
      error: err => {
        console.warn(err);
      }
    });
  }

  createRecipe() {}
}

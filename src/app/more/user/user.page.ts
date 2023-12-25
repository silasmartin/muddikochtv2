import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PhotoService } from 'src/app/services/photo.service';
import { DataService } from 'src/app/services/data.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Keyboard } from '@capacitor/keyboard';

@UntilDestroy()
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserPage {
  name = '';

  constructor(private photoService: PhotoService, private dataService: DataService) {}

  ionViewWillEnter(): void {
    this.dataService.name.pipe(untilDestroyed(this)).subscribe({
      next: name => {
        this.name = name;
      },
      error: err => {
        console.warn(err);
      }
    });
    try {
      Keyboard.addListener('keyboardWillHide', () => {
        this.dataService.setNameState(this.name);
      });
    } catch (e) {}
  }

  newPic() {
    this.photoService.takePicture().then(res => {
      console.log(res);
    });
  }

  ionViewWillLeave() {
    try {
      Keyboard.removeAllListeners();
    } catch (e) {}
    this.dataService.setNameState(this.name);
  }
}

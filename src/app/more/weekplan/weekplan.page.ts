import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-weekplan',
  templateUrl: './weekplan.page.html',
  styleUrls: ['./weekplan.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class WeekplanPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

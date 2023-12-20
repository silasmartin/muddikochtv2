import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealTypesPage } from './meal-types.page';

describe('MealTypesPage', () => {
  let component: MealTypesPage;
  let fixture: ComponentFixture<MealTypesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MealTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealCategoriesPage } from './meal-categories.page';

describe('MealCategoriesPage', () => {
  let component: MealCategoriesPage;
  let fixture: ComponentFixture<MealCategoriesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MealCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeekplanPage } from './weekplan.page';

describe('WeekplanPage', () => {
  let component: WeekplanPage;
  let fixture: ComponentFixture<WeekplanPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WeekplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

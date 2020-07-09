import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverCategories } from './popover-categories.component';

describe('PopoverCategoriesComponent', () => {
  let component: PopoverCategories;
  let fixture: ComponentFixture<PopoverCategories>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverCategories],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListToPage } from './list-to.page';

describe('ListToPage', () => {
  let component: ListToPage;
  let fixture: ComponentFixture<ListToPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListToPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListToPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

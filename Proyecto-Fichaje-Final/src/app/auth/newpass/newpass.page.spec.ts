import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewpassPage } from './newpass.page';

describe('NewpassPage', () => {
  let component: NewpassPage;
  let fixture: ComponentFixture<NewpassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewpassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewpassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

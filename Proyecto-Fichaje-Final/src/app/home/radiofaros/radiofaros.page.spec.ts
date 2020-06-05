import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadiofarosPage } from './radiofaros.page';

describe('RadiofarosPage', () => {
  let component: RadiofarosPage;
  let fixture: ComponentFixture<RadiofarosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiofarosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadiofarosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

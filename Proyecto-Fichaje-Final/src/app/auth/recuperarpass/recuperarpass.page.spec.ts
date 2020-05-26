import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecuperarpassPage } from './recuperarpass.page';

describe('RecuperarpassPage', () => {
  let component: RecuperarpassPage;
  let fixture: ComponentFixture<RecuperarpassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecuperarpassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarpassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

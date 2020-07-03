import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IncompletosPage } from './incompletos.page';

describe('IncompletosPage', () => {
  let component: IncompletosPage;
  let fixture: ComponentFixture<IncompletosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncompletosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IncompletosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CercanosPage } from './cercanos.page';

describe('TrabajadoresPage', () => {
  let component: CercanosPage;
  let fixture: ComponentFixture<CercanosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CercanosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CercanosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

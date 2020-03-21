import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrabajadoresPage } from './trabajadores.page';

describe('TrabajadoresPage', () => {
  let component: TrabajadoresPage;
  let fixture: ComponentFixture<TrabajadoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrabajadoresPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrabajadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

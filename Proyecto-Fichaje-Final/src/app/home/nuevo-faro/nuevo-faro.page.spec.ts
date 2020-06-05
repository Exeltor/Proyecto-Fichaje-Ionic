import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NuevoFaroPage } from './nuevo-faro.page';

describe('NuevoFaroPage', () => {
  let component: NuevoFaroPage;
  let fixture: ComponentFixture<NuevoFaroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoFaroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoFaroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

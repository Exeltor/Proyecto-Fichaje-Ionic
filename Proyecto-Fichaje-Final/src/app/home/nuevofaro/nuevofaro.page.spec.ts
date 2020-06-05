import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NuevofaroPage } from './nuevofaro.page';

describe('NuevofaroPage', () => {
  let component: NuevofaroPage;
  let fixture: ComponentFixture<NuevofaroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevofaroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevofaroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

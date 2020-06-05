import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NUEVOFAROPage } from './nuevo-faro.page';

describe('NUEVOFAROPage', () => {
  let component: NUEVOFAROPage;
  let fixture: ComponentFixture<NUEVOFAROPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NUEVOFAROPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NUEVOFAROPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

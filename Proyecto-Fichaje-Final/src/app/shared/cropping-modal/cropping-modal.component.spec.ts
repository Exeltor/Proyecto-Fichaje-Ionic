import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CroppingModalComponent } from './cropping-modal.component';

describe('CroppingModalComponent', () => {
  let component: CroppingModalComponent;
  let fixture: ComponentFixture<CroppingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CroppingModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CroppingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

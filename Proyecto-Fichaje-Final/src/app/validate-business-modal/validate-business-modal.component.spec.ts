import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ValidateBusinessModalComponent } from './validate-business-modal.component';

describe('ValidateBusinessModalComponent', () => {
  let component: ValidateBusinessModalComponent;
  let fixture: ComponentFixture<ValidateBusinessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateBusinessModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidateBusinessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

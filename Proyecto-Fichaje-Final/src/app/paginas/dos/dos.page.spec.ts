import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DosPage } from './dos.page';

describe('DosPage', () => {
  let component: DosPage;
  let fixture: ComponentFixture<DosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

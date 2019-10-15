import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaPage } from './ficha.page';

describe('FichaPage', () => {
  let component: FichaPage;
  let fixture: ComponentFixture<FichaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

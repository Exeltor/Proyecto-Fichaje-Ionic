import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoraPage } from './hora.page';

describe('HoraPage', () => {
  let component: HoraPage;
  let fixture: ComponentFixture<HoraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoraPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterempresaPage } from './registerempresa.page';

describe('RegisterempresaPage', () => {
  let component: RegisterempresaPage;
  let fixture: ComponentFixture<RegisterempresaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterempresaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterempresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UinfoPage } from './uinfo.page';

describe('UinfoPage', () => {
  let component: UinfoPage;
  let fixture: ComponentFixture<UinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

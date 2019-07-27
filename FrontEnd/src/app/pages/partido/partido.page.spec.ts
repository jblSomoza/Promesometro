import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidoPage } from './partido.page';

describe('PartidoPage', () => {
  let component: PartidoPage;
  let fixture: ComponentFixture<PartidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartidoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

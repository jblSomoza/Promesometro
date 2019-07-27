import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatosPage } from './candidatos.page';

describe('CandidatosPage', () => {
  let component: CandidatosPage;
  let fixture: ComponentFixture<CandidatosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

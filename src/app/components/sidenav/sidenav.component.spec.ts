import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SidenavComponent} from './sidenav.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {

    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

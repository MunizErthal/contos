import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContosComponent } from './contos.component';

describe('ContosComponent', () => {
  let component: ContosComponent;
  let fixture: ComponentFixture<ContosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinicontosComponent } from './minicontos.component';

describe('MinicontosComponent', () => {
  let component: MinicontosComponent;
  let fixture: ComponentFixture<MinicontosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinicontosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinicontosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

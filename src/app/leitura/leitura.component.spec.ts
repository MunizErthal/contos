import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeituraComponent } from './leitura.component';

describe('LeituraComponent', () => {
  let component: LeituraComponent;
  let fixture: ComponentFixture<LeituraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeituraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeituraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

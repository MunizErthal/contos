import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrevendoComponent } from './escrevendo.component';

describe('EscrevendoComponent', () => {
  let component: EscrevendoComponent;
  let fixture: ComponentFixture<EscrevendoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscrevendoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscrevendoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

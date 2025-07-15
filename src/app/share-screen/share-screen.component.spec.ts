import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareScreenComponent } from './share-screen.component';

describe('ShareScreenComponent', () => {
  let component: ShareScreenComponent;
  let fixture: ComponentFixture<ShareScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

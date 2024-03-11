import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinUsComponent } from './join-us.component';

describe('JoinInComponent', () => {
  let component: JoinUsComponent;
  let fixture: ComponentFixture<JoinUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinUsComponent],
    });
    fixture = TestBed.createComponent(JoinUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNicePlaceComponent } from './new-nice-place.component';

describe('NewNicePlaceComponent', () => {
  let component: NewNicePlaceComponent;
  let fixture: ComponentFixture<NewNicePlaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewNicePlaceComponent]
    });
    fixture = TestBed.createComponent(NewNicePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

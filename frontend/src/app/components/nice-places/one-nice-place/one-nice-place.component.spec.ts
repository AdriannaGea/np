import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneNicePlaceComponent } from './one-nice-place.component';

describe('OneNicePlaceComponent', () => {
  let component: OneNicePlaceComponent;
  let fixture: ComponentFixture<OneNicePlaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneNicePlaceComponent]
    });
    fixture = TestBed.createComponent(OneNicePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

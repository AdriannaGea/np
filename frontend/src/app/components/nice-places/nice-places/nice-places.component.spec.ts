import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NicePlacesComponent } from './nice-places.component';

describe('NicePlacesComponent', () => {
  let component: NicePlacesComponent;
  let fixture: ComponentFixture<NicePlacesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NicePlacesComponent],
    });
    fixture = TestBed.createComponent(NicePlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

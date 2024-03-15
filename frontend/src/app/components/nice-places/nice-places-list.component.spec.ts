import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NicePlacesListComponent } from './nice-places-list.component';

describe('NicePlacesComponent', () => {
  let component: NicePlacesListComponent;
  let fixture: ComponentFixture<NicePlacesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NicePlacesListComponent],
    });
    fixture = TestBed.createComponent(NicePlacesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

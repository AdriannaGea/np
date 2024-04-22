import { Component, Input, OnInit } from '@angular/core';
import { NicePlace } from '../../models/nice-place.model';
import { NicePlacesService } from '../services/nice-places.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-nice-places-list',
  templateUrl: './nice-places-list.component.html',
  styleUrls: ['./nice-places-list.component.scss'],
})
export class NicePlacesListComponent implements OnInit {
  nicePlace$!: Observable<NicePlace[]>;
  searchPlaces: FormGroup = new FormGroup({});
  selectAllFilters: boolean = false;

  constructor(private nps: NicePlacesService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchPlaces = this.fb.group({
      search: [null],
      food: [null],
      drinks: [null],
      ambience: [null],
    });
    this.nicePlace$ = this.nps.getAllNicePlaces();
  }

  selectAll(controlName: string, values: string[]) {
    const formControl = this.searchPlaces.get(controlName);

    if (this.selectAllFilters) {
      formControl?.setValue([]);
    } else {
      formControl?.setValue(['tous', ...values]);
    }

    this.selectAllFilters = !this.selectAllFilters;
  }

  onOptionSelect(option: string, controlName: string) {
    const formControl = this.searchPlaces.get(controlName);

    if (option !== 'tous' && formControl?.value.includes('tous')) {
      // Si une option autre que 'tous' est selecionnée et que 'tous est actuellement sélectionné, sécocher 'tous
      formControl.setValue(
        formControl.value.filter((value: string) => value !== 'tous')
      );
      this.selectAllFilters;
    }
  }

  // ------------------ Searching --------------- //

  // getAllValues(searchFormGroup: FormGroup, controlName: string): string[] {
  //     const formControl = searchFormGroup.get(controlName);
  //     const values = formControl?.value || [];

  //     return this.removeAllOptions(values)
  //   }

  // removeAllOptions(values: string[]): string[] {
  //   const index = values.indexOf('tous');
  //   if (index !== -1) {
  //     values.splice(index, 1);
  //   }
  //   return values;
  // }
}

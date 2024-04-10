import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { NicePlace } from '../models/nice-place.model';
import { NicePlacesService } from '../services/nice-places.service';

@Component({
  selector: 'app-new-nice-place',
  templateUrl: './new-nice-place.component.html',
  styleUrls: ['./new-nice-place.component.scss'],
})
export class NewNicePlaceComponent {
  placeForm!: FormGroup;
  newNicePlacePreview$!: Observable<NicePlace>;
  urlRegex!: RegExp;

  constructor(
    private fb: FormBuilder,
    private nps: NicePlacesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.placeForm = this.fb.group(
      {
        title: [null, [Validators.required]],
        description: [null, [Validators.required]],
        imageUrl: [
          null,
          [Validators.required, Validators.pattern(this.urlRegex)],
        ],
        location: [null],
      },
      {
        updateOn: 'blur',
      }
    );

    this.newNicePlacePreview$ = this.placeForm.valueChanges.pipe(
      map((formValue: any) => ({
        ...formValue,
        createdDate: new Date(),
        likes: 0,
        dislikes: 0,
        id: 0,
      }))
    );
  }

  onSubmitForm() {
    this.nps
      .addNewPlace(this.placeForm.value)
      .pipe(tap(() => this.router.navigateByUrl('/nice-places')))
      .subscribe();
  }
}

import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { NicePlace } from '../../../models/nice-place.model';
import { NicePlacesService } from '../../services/nice-places.service';
import { LocalStoreService } from '../../join-in/services/other/local-store.service';

@Component({
  selector: 'app-new-nice-place',
  templateUrl: './new-nice-place.component.html',
  styleUrls: ['./new-nice-place.component.scss'],
})
export class NewNicePlaceComponent {
  @Input() editNicePlaceData: NicePlace | null = null;
  showForm = false;

  placeForm!: FormGroup;
  newNicePlacePreview$!: Observable<NicePlace>;
  urlRegex!: RegExp;
  currentUser: any | null;

  constructor(
    private fb: FormBuilder,
    private nps: NicePlacesService,
    private router: Router,
    private local: LocalStoreService
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire réactif
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

    this.currentUser = this.local.getItem('currentUser');

    console.log(this.currentUser);

    if (this.editNicePlaceData) {
      this.placeForm.patchValue(this.editNicePlaceData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes:', changes);
    if (
      changes['editNicePlaceData'] &&
      changes['editNicePlaceData'].currentValue
    ) {
      this.placeForm.patchValue(changes['editNicePlaceData'].currentValue);
    }
  }

  // Soumission du formulaire
  onSubmitForm() {
    const { title, description, imageUrl, location } = this.placeForm.value;

    const postData = {
      title,
      description,
      imageUrl,
      location,
      member_id: this.currentUser.id,
      likes: this.editNicePlaceData ? this.editNicePlaceData.likes : 0,
      dislikes: this.editNicePlaceData ? this.editNicePlaceData.dislikes : 0,
      // createdDate: new Date(), // Actualisation createdDate pendant edit
    };

    if (this.editNicePlaceData) {
      this.nps
        .updateNicePlace(this.editNicePlaceData.id, postData)
        .pipe(tap(() => this.router.navigateByUrl('/nice-places')))
        .subscribe();
    } else {
      this.nps
        .addNewPlace(postData, this.currentUser)
        .pipe(tap(() => this.router.navigateByUrl('/nice-places')))
        .subscribe();
    }
  }
}

import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NicePlace } from '../models/nice-place.model';
import { NicePlacesService } from '../services/nice-places.service';

@Component({
  selector: 'app-nice-places',
  templateUrl: './nice-places.component.html',
  styleUrls: ['./nice-places.component.scss'],
})
export class NicePlacesComponent {
  @Input() nicePlace!: NicePlace;
  nicePlaces: NicePlace[] = [];

  constructor(private nps: NicePlacesService, private router: Router) {}

  ngOnInit(): void {
    this.loadNicePlaces();
  }

  loadNicePlaces() {
    this.nps.getAllNicePlaces().subscribe(
      (places: any) => {
        // console.log(places);
        this.nicePlaces = places['data'];
      },
      (error) => {
        console.error('Error loading nice places: ', error);
      }
    );
  }

  onViewNicePlace(nicePlace: NicePlace) {
    this.router.navigateByUrl(`nice-places/${nicePlace.id}`);
  }
}

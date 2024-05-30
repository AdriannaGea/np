import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NicePlace } from '../../../models/nice-place.model';
import { NicePlacesService } from '../../../services/nice-places.service';

@Component({
  selector: 'app-nice-places',
  templateUrl: './nice-places.component.html',
  styleUrls: ['./nice-places.component.scss'],
})
export class NicePlacesComponent implements OnInit {
  @Input() nicePlace!: NicePlace;
  nicePlaces: NicePlace[] = [];

  constructor(private nps: NicePlacesService, private router: Router) {}

  ngOnInit(): void {
    this.loadNicePlaces();
  }

  loadNicePlaces() {
    this.nps.getAllNicePlaces().subscribe(
      (places: any) => {
        this.nicePlaces = places['data'];
      },
      (error) => {
        console.error('Error loading nice places: ', error);
      }
    );
  }

  reloadPlaces() {
    this.loadNicePlaces(); // Możesz to wywołać po każdej operacji modyfikacji
  }

  updatePlace(postId: number, updatedData: Partial<NicePlace>) {
    this.nps.updateNicePlace(postId, updatedData).subscribe({
      next: (updated) => {
        console.log('Place updated:', updated);
        this.reloadPlaces(); // Ponowne załadowanie miejsc po aktualizacji
      },
      error: (error) => console.error('Failed to update place', error),
    });
  }

  onViewNicePlace(nicePlace: NicePlace) {
    this.router.navigateByUrl(`nice-places/${nicePlace.id}`);
  }
}

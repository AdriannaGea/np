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
    // Charge les "nice places" lors de l'initialisation du composant
    this.loadNicePlaces();
  }

  loadNicePlaces() {
    this.nps.getAllNicePlaces().subscribe(
      (places: any) => {
        // Met à jour la liste des "nice places" avec les données reçues
        this.nicePlaces = places['data'];
      },
      (error) => {
        // Affiche une erreur en cas de problème lors du chargement des "nice places"
        console.error('Erreur lors du chargement des "nice places" : ', error);
      }
    );
  }

  reloadPlaces() {
    // Peut être appelée après chaque opération de modification pour recharger les données
    this.loadNicePlaces();
  }

  updatePlace(postId: number, updatedData: Partial<NicePlace>) {
    this.nps.updateNicePlace(postId, updatedData).subscribe({
      next: (updated) => {
        // Affiche un message lorsque l'endroit est mis à jour avec succès
        console.log('Place updated:', updated);
        // Recharge les "nice places" après la mise à jour
        this.reloadPlaces();
      },
      // Affiche une erreur en cas d'échec de la mise à jour de l'endroit
      error: (error) =>
        console.error("Échec de la mise à jour de l'endroit", error),
    });
  }

  onViewNicePlace(nicePlace: NicePlace) {
    // Navigue vers la page de détail de l'endroit sélectionné
    this.router.navigateByUrl(`nice-places/${nicePlace.id}`);
  }
}

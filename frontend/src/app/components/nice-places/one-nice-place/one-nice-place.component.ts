import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NicePlacesService } from '../services/nice-places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of, tap } from 'rxjs';
import { NicePlace } from '../models/nice-place.model';

@Component({
  selector: 'app-one-nice-place',
  templateUrl: './one-nice-place.component.html',
  styleUrls: ['./one-nice-place.component.scss'],
})
export class OneNicePlaceComponent {
  nicePlace$!: Observable<NicePlace>;
  buttonText!: string;
  dislikeButtonText!: string;
  @Output() postCommented = new EventEmitter<{
    comment: string;
    nicePlaceId: number;
  }>();

  constructor(private nps: NicePlacesService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Initialisation du texte des boutons
    this.buttonText = 'Like It!';
    this.dislikeButtonText = 'Dislike It!';

    // Récupération de l'ID du lieu depuis l'URL
    const nicePlaceId = +this.route.snapshot.params['id'];

    // Récupération du lieu par ID depuis le service
    this.nicePlace$ = this.nps
      .getNicePlaceById(nicePlaceId)
      .pipe(map((response) => response.result));
  }

  onLike(nicePlaceId: number, likeType: 'like' | 'dislike') {
    let updateAction: Observable<NicePlace> | undefined;

    // Si le type est 'like'
    if (likeType === 'like') {
      // Mise à jour du lieu avec le type de like approprié
      updateAction = this.nps
        .likeNicePlaceById(
          nicePlaceId,
          this.buttonText === 'Like It!' ? 'like' : 'unlike'
        )
        .pipe(
          tap(() => {
            // Modification du texte du bouton "Like"
            this.buttonText =
              this.buttonText === 'Like It!' ? 'Unlike!' : 'Like It!';
          })
        );
    }
    // Si le type est 'dislike'
    else if (likeType === 'dislike') {
      // Mise à jour du lieu avec le type de dislike approprié
      updateAction = this.nps
        .likeNicePlaceById(
          nicePlaceId,
          this.dislikeButtonText === 'Dislike It!' ? 'dislike' : 'undislike'
        )
        .pipe(
          tap(() => {
            // Modification du texte du bouton "Dislike"
            this.dislikeButtonText =
              this.dislikeButtonText === 'Dislike It!'
                ? 'Undislike!'
                : 'Dislike It!';
          })
        );
    }

    // Si une action de mise à jour a été définie
    if (updateAction) {
      // Souscription à l'action de mise à jour
      updateAction.subscribe((updatedNicePlace) => {
        this.nicePlace$ = of(updatedNicePlace);
      });
    }
  }

  // onNewComment(comment: string) {
  //   const nicePlaceId = +this.route.snapshot.params['id'];
  //   this.postCommented.emit({ comment, nicePlaceId });
  // }
}

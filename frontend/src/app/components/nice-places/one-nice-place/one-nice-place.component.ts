import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NicePlacesService } from '../../../services/nice-places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of, tap } from 'rxjs';
import { NicePlace } from '../../../models/nice-place.model';
import { ToastrService } from 'ngx-toastr';
import { Comment } from 'src/app/models/comments.model';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { NewNicePlaceComponent } from '../new-nice-place/new-nice-place.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-one-nice-place',
  templateUrl: './one-nice-place.component.html',
  styleUrls: ['./one-nice-place.component.scss'],
})
export class OneNicePlaceComponent {
  nicePlace$!: Observable<NicePlace>;
  buttonText!: string;
  dislikeButtonText!: string;
  currentUser: any;
  nicePlaces: NicePlace[] = [];
  editMode = false;
  comments: Comment[] = [];
  commentCtrl = new FormControl('');

  @Output() postCommented = new EventEmitter<{
    comment: string;
    nicePlaceId: number;
  }>();

  @Output() editNicePlace = new EventEmitter<NicePlace>();

  constructor(
    private nps: NicePlacesService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // Initialisation du texte des boutons
    this.buttonText = 'Like It!';
    this.dislikeButtonText = 'Dislike It!';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}'); // Obtenir l'utilisateur actuel depuis le localStorage

    // Récupération de l'ID de Nice Place depuis l'URL
    const nicePlaceId = +this.route.snapshot.params['id'];

    // Récupération de Nice Place par ID depuis le service
    this.nicePlace$ = this.nps
      .getNicePlaceById(nicePlaceId)
      .pipe(map((response: any) => response['data']));
  }

  onLike(nicePlaceId: number, likeType: 'like' | 'dislike') {
    let updateAction: Observable<NicePlace> | undefined;

    // Si le type est 'like'
    if (likeType === 'like') {
      // Mise à jour de Nice Place avec le type de like approprié
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
      // Mise à jour de Nice Place avec le type de dislike approprié
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

  updatePlace(nicePlace: NicePlace) {
    const updatedData = {
      title: nicePlace.title,
      description: nicePlace.description,
      imageUrl: nicePlace.imageUrl,
      location: nicePlace.location,
      // member_id: this.currentUser.id,
      // likes: nicePlace.likes,
      // dislikes: nicePlace.dislikes,
    };

    this.nps.updateNicePlace(nicePlace.id, updatedData).subscribe(
      (updatedPlace) => {
        const index = this.nicePlaces.findIndex(
          (p) => p.id === updatedPlace.id
        );
        if (index !== -1) {
          this.nicePlaces[index] = updatedPlace;
        }
        this.snackBar.open(
          'Ton Nice Place a été modifié avec succès!',
          'Fermer',
          {
            duration: 3000,
          }
        );
        this.nicePlace$ = of(updatedPlace); // Actualisation de nicePlace$
      },
      (error) => {
        this.snackBar.open(
          'Une erreur est survenue lors de la modification de ton Nice Place!',
          'Fermer',
          {
            duration: 3000,
          }
        );
      }
    );
  }

  deletePlace(nicePlace: NicePlace) {
    this.nps.deleteNicePlace(nicePlace.id).subscribe(() => {
      this.snackBar.open(
        'Ton Nice Place a été supprimé avec succès!',
        'Fermer',
        {
          duration: 3000,
        }
      );
      // Redirection vers la page /nice-places
      this.router.navigate(['/nice-places']);
    });
  }

  editClicked(nicePlace: NicePlace) {
    this.editMode = true;
    this.editNicePlace.emit(nicePlace);
  }

  scrollToBottom() {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }

  // onLeaveComment() {
  //   const newComment: Comment = {
  //     id: /* générer un nouvel ID */,
  //     userId: /* l'ID de l'utilisateur actuel */,
  //     comment: this.commentCtrl.value ?? '',  // Utilisation de l'opérateur de coalescence nulle
  //     createdDate: new Date().toISOString()  // ou utilisez une fonction pour obtenir la date actuelle
  //   };

  //   this.comments.push(newComment);
  //   this.commentCtrl.reset();
  // }
}

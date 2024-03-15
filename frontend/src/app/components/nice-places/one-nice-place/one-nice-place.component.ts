import { Component, EventEmitter, Output } from '@angular/core';
import { NicePlacesService } from '../services/nice-places.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { NicePlace } from '../models/nice-place.model';

@Component({
  selector: 'app-one-nice-place',
  templateUrl: './one-nice-place.component.html',
  styleUrls: ['./one-nice-place.component.scss'],
})
export class OneNicePlaceComponent {
  nicePlace$!: Observable<NicePlace>;
  buttonText!: string;
  @Output() postCommented = new EventEmitter<{
    comment: string;
    nicePlaceId: number;
  }>();

  constructor(private nps: NicePlacesService, private route: ActivatedRoute) {}


  ngOnInit() {
    this.buttonText = 'Like It!';
    const nicePlaceId = +this.route.snapshot.params['id'];
    this.nicePlace$ = this.nps.getNicePlaceById(nicePlaceId);
  }

  // onLike(nicePlaceId: number) {
  //   if (this.buttonText === 'Like It!') {
  //     this.nicePlace$ = this.nps
  //       .likeNicePlaceById(nicePlaceId, 'like')
  //       .pipe(tap(() => (this.buttonText = 'Unlike!')));
  //   } else {
  //     this.nicePlace$ = this.nps
  //       .likeNicePlaceById(nicePlaceId, 'unlike')
  //       .pipe(tap(() => (this.buttonText = 'Like It!')));
  //   }
  // }

  // onNewComment(comment: string) {
  //   const NicePlaceId = +this.route.snapshot.params['id'];
  //   this.postCommented.emit({ comment, nicePlaceId });
  // }
}

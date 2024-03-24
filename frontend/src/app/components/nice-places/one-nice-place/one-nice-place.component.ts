import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NicePlacesService } from '../services/nice-places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
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
    this.nicePlace$ = this.nps
      .getNicePlaceById(nicePlaceId)
      .pipe(map((response) => response.result));
  }

  onLike(perfectShoeId: number) {
    if (this.buttonText === 'Like It!') {
      this.nicePlace$ = this.nps
        .likeNicePlaceById(perfectShoeId, 'like')
        .pipe(tap(() => (this.buttonText = 'Unlike!')));
    } else {
      this.nicePlace$ = this.nps
        .likeNicePlaceById(perfectShoeId, 'unlike')
        .pipe(tap(() => (this.buttonText = 'Like It!')));
    }
  }

  // onNewComment(comment: string) {
  //   const perfectShoeId = +this.route.snapshot.params['id'];
  //   this.postCommented.emit({ comment, perfectShoeId });
  // }
}

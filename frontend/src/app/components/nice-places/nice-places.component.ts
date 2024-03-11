import { Component, Input } from '@angular/core';
import { NicePlace } from './models/nice-place.model';
import { NicePlacesService } from './services/nice-places.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nice-places',
  templateUrl: './nice-places.component.html',
  styleUrls: ['./nice-places.component.scss'],
})
export class NicePlacesComponent {
  @Input() nicePlace!: NicePlace;
  buttonText!: string;

  constructor(private nps: NicePlacesService, private router: Router) {}

  ngOnInit(): void {}

  onViewNicePlace() {
    // this.router.navigateByUrl(`nice-places/${this.nicePlace.id}`);
  }
}


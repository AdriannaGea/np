import { Component, Input, OnInit } from '@angular/core';
import { NicePlace } from './models/nice-place.model';
import { NicePlacesService } from './services/nice-places.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nice-places-list',
  templateUrl: './nice-places-list.component.html',
  styleUrls: ['./nice-places-list.component.scss'],
})
export class NicePlacesListComponent implements OnInit {
  nicePlace$!: Observable<NicePlace[]>;

  constructor(private nps: NicePlacesService) {}

  ngOnInit(): void {
    this.nicePlace$ = this.nps.getAllNicePlaces();
  }
}


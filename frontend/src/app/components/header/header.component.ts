import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NicePlace } from '../../models/nice-place.model';
import { NicePlacesService } from '../services/nice-places.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  searchText: string = '';
  selectedCategory: string = '';
  nicePlaces$!: Observable<NicePlace[]>;

  constructor(private nps: NicePlacesService) {}

  refresh() {
    // Implementuj logikę odświeżania
  }

  search() {
    // Implementuj logikę wyszukiwania
  }

  clearSearch() {
    this.searchText = '';
  }

  ngOnInit(): void {
    this.nicePlaces$ = this.nps.getAllNicePlaces();
  }
}

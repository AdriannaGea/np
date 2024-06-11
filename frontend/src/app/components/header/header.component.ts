import { Component } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { NicePlace } from '../../models/nice-place.model';
import { NicePlacesService } from '../../services/nice-places.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  searchText: string = '';
  selectedCategory: string = '';
  nicePlaces$!: Observable<NicePlace[]>;
  userEmail!: string;
  lastThreeNicePlaces$!: Observable<NicePlace[]>;

  constructor(private nps: NicePlacesService, private router: Router) {}

  onContinue(): void {
    this.router.navigateByUrl('nice-places');
  }

  onSubmitForm(form: NgForm): void {
    console.log(form.value);
  }

  ngOnInit(): void {
    this.lastThreeNicePlaces$ = this.nps.getLastThreeNicePlaces();
  }
}

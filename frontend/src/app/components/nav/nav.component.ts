import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  constructor(private router: Router, private authService: AuthService) {}

  // Initialisation du composant
  ngOnInit(): void {}

  // Méthode pour ajouter un nouveau lieu agréable
  onAddNewNicePlace(): void {
    if (this.authService.isLoggedIn()) {
      // Redirection vers la page d'ajout si l'utilisateur est connecté
      this.router.navigateByUrl('auth/add');
    } else {
      // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
      this.router.navigateByUrl('auth/login');
    }
  }
}

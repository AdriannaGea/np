import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  // Initialisation du composant
  ngOnInit(): void {
    // Souscrire au changement du statut de connexion
    this.authService.isLoggedInObservable().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  // Méthode pour ajouter un nouveau lieu agréable
  onAddNewNicePlace(): void {
    if (this.isLoggedIn) {
      // Rediriger l'utilisateur vers la page d'ajout seulement s'il est connecté
      this.router.navigateByUrl('/auth/add');
    } else {
      // Rediriger l'utilisateur vers la page de connexion s'il n'est pas connecté
      // Po zalogowaniu, przekieruj użytkownika do '/auth/add'
      this.router.navigateByUrl('/auth/login').then(() => {
        this.router.navigateByUrl('/auth/add');
      });
    }
  }

  // Méthode pour déconnecter l'utilisateur
  onLogout(): void {
    this.authService.logout(); // Appel de la méthode logout du service AuthService
    this.router.navigateByUrl(''); // Redirection vers la page de connexion après déconnexion
  }
}

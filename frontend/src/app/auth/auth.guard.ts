import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  // Méthode pour vérifier si l'utilisateur est authentifié
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Récupérer le token de l'utilisateur
    const token = this.auth.getToken();
    if (token) {
      // Si un token est présent, autoriser l'accès
      return true;
    } else {
      // Si aucun token n'est présent, rediriger vers la page de connexion et refuser l'accès
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }
}

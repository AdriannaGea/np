import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token!: string;

  constructor(private http: HttpClient) {}

  // Fonction pour se connecter à l'API avec un email et un mot de passe
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>('http://localhost:3000/login', { email, password })
      .pipe(
        tap((response) => {
          // Si le token est reçu dans la réponse, il est stocké et sauvegardé dans le localStorage
          if (response.token) {
            this.token = response.token;
            localStorage.setItem('token', this.token); // Optionnel: sauvegarde du token dans le localStorage
          }
        })
      );
  }

  // Vérification si l'utilisateur est connecté en vérifiant la présence du token dans le localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Récupèration le token de l'utilisateur depuis la variable de classe ou depuis le localStorage
  getToken(): string {
    return this.token || localStorage.getItem('token') || '';
  }
}

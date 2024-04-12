import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { LocalStoreService } from '../components/join-in/services/other/local-store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token!: string;
private currentUser:any;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient,
  private local: LocalStoreService
) {}

  // Fonction pour se connecter à l'API avec un email et un mot de passe
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>('http://localhost:3000/api/login', { email, password })
      .pipe(
        tap((response) => {
          if (response.data && response.data.token) {
            this.token = response.data.token;
            this.currentUser = response.data.user[0]
            this.local.setItem('currentUser', this.currentUser);
            localStorage.setItem('token', this.token);
            console.log(this.currentUser);
            this.isLoggedInSubject.next(true); // mise à jour du statut de connexion
          }
        }),
        catchError((error) => {
          console.error('Erreur lors de la connexion:', error);
          throw error;
        })
      );
  }

  // Fonction pour se déconnecter
  logout(): void {
    this.token = '';
    localStorage.removeItem('token');
    this.local.removeItem('currentUser');
    this.isLoggedInSubject.next(false); // mise à jour du statut de connexion
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Retourne l'observable du statut de connexion
  isLoggedInObservable(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Retourne le token stocké
  getToken(): string {
console.log(this.token);
    return this.token || localStorage.getItem('token') || '';
  }

  // Vérifie si le token est expiré
  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.getToken();
    }
    const decodedToken = this.decodeToken(token);
    if (decodedToken && decodedToken.exp) {
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      return expirationDate.valueOf() < new Date().valueOf();
    }
    return true;
  }

  // Décodage du token JWT
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      return null;
    }
  }
}

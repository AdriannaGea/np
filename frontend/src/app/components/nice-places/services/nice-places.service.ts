import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { NicePlace } from '../models/nice-place.model';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NicePlacesService {
  addTagToNicePlace(placeId: any, tagName: string) {
    throw new Error('Méthode non implémentée.');
  }

  // URL de l'API défini dans le fichier de configuration de l'environnement
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Récupérer tous les Nice Places depuis l'API
  getAllNicePlaces(): Observable<NicePlace[]> {
    return this.http.get<NicePlace[]>(`${this.apiUrl}/niceplaces`);
  }

  // Ajouter un nouveau Nice Place via un formulaire
  addNewPlace(formValue: {
    title: string;
    description: string;
    imageUrl: string;
    location?: string;
  }): Observable<NicePlace> {
    return this.http.post<NicePlace>(`${this.apiUrl}/niceplaces`, formValue);
  }

  // Récupérer un Nice Place spécifique par son ID
  getNicePlaceById(
    id: number
  ): Observable<{ status: string; result: NicePlace }> {
    return this.http.get<{ status: string; result: NicePlace }>(
      `${this.apiUrl}/niceplaces/${id}`
    );
  }

  // Mettre à jour le nombre de likes ou de dislikes d'un Nice Place par son ID
  likeNicePlaceById(
    id: number,
    likeType: 'like' | 'unlike' | 'dislike' | 'undislike'
  ): Observable<NicePlace> {
    return this.getNicePlaceById(id).pipe(
      switchMap((response) => {
        let updatedNicePlace: NicePlace;

        if (likeType === 'like' || likeType === 'unlike') {
          updatedNicePlace = {
            ...response.result,
            likes: response.result.likes + (likeType === 'like' ? 1 : -1),
          };
        } else if (likeType === 'dislike' || likeType === 'undislike') {
          updatedNicePlace = {
            ...response.result,
            dislikes:
              response.result.dislikes + (likeType === 'dislike' ? 1 : -1),
          };
        } else {
          throw new Error('Type de like invalide');
        }

        // Mettre à jour le Nice Place sur le serveur
        return this.http
          .put<NicePlace>(`${this.apiUrl}/niceplaces/${id}`, updatedNicePlace)
          .pipe(map((updated) => updatedNicePlace));
      })
    );
  }
}

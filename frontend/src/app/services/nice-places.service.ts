import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { NicePlace } from 'src/app/models/nice-place.model';
import { Comment } from '../models/comments.model';

@Injectable({
  providedIn: 'root',
})
export class NicePlacesService {
  // URL de l'API récupérée depuis la configuration de l'environnement
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Récupérer tous les Nice Places depuis l'API
  getAllNicePlaces(): Observable<NicePlace[]> {
    return this.http.get<NicePlace[]>(`${this.apiUrl}/niceplaces`);
  }
  // Récupération un Nice Place spécifique par son ID
  getNicePlaceById(
    id: number
  ): Observable<{ status: string; data: NicePlace }> {
    return this.http.get<{ status: string; data: NicePlace }>(
      `${this.apiUrl}/niceplaces/${id}`
    );
  }

  // Ajouter un nouveau Nice Place via un formulaire
  addNewPlace(form: any, member: any): Observable<NicePlace> {
    // Création de l'objet formValue à partir des données du formulaire et de l'utilisateur
    const formValue = {
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl,
      location: form.location,
      tags: form.tags,
      member_id: member.id,
    };

    // Appel à l'API pour ajouter un nouveau Nice Place
    return this.http.post<NicePlace>(`${this.apiUrl}/niceplaces`, formValue);
  }

  // Actualisation de Nice Place
  updateNicePlace(
    id: number,
    updatedData: Partial<NicePlace>
  ): Observable<NicePlace> {
    // updatedData.editDate = new Date();

    return this.http.put<NicePlace>(
      `${this.apiUrl}/niceplaces/${id}`,
      updatedData
    );
  }

  // Suppresion de Nice PlACE
  deleteNicePlace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/niceplaces/${id}`);
  }

  // Verification qui est le poprieter de ce Nice Place
  isOwnerOfNicePlace(nicePlace: NicePlace, userId: number): boolean {
    return nicePlace.member_id === userId;
  }

  // Mise à jour le nombre de likes ou de dislikes d'un Nice Place par son ID
  likeNicePlaceById(
    id: number,
    likeType: 'like' | 'unlike' | 'dislike' | 'undislike'
  ): Observable<NicePlace> {
    return this.getNicePlaceById(id).pipe(
      switchMap((response) => {
        let updatedNicePlace: NicePlace;

        // Mise à jour du Nice Place en fonction du type de like
        if (likeType === 'like' || likeType === 'unlike') {
          updatedNicePlace = {
            ...response.data,
            likes: response.data.likes + (likeType === 'like' ? 1 : -1),
          };
        } else if (likeType === 'dislike' || likeType === 'undislike') {
          updatedNicePlace = {
            ...response.data,
            dislikes:
              response.data.dislikes + (likeType === 'dislike' ? 1 : -1),
          };
        } else {
          throw new Error('Type de like invalide');
        }

        // Mise à jour du Nice Place sur le serveur
        return this.http
          .put<NicePlace>(`${this.apiUrl}/niceplaces/${id}`, updatedNicePlace)
          .pipe(map((updated) => updatedNicePlace));
      })
    );
  }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments`, comment);
  }
}

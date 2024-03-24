import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, tap } from 'rxjs';
import { NicePlace } from '../models/nice-place.model';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NicePlacesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllNicePlaces(): Observable<NicePlace[]> {
    return this.http.get<NicePlace[]>(`${this.apiUrl}/niceplaces`);
  }

  addNewPlace(formValue: {
    title: string;
    description: string;
    imageUrl: string;
    location?: string;
  }): Observable<NicePlace> {
    return this.http.post<NicePlace>(`${this.apiUrl}/niceplaces`, formValue);
  }

  getNicePlaceById(
    id: number
  ): Observable<{ status: string; result: NicePlace }> {
    return this.http.get<{ status: string; result: NicePlace }>(
      `${this.apiUrl}/niceplaces/${id}`
    );
  }

  likeNicePlaceById(
    id: number,
    likeType: 'like' | 'unlike'
  ): Observable<NicePlace> {
    return this.getNicePlaceById(id).pipe(
      switchMap((response) => {
        const updatedNicePlace = {
          ...response.result,
          likes: response.result.likes + (likeType === 'like' ? 1 : -1),
        };
        return this.http.put<NicePlace>(
          `${this.apiUrl}/niceplaces/${id}`,
          updatedNicePlace
        );
      })
    );
  }
}

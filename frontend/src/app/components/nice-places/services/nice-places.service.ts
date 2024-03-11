import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { NicePlace } from '../models/nice-place.model';

@Injectable({
  providedIn: 'root',
})
export class NicePlacesService {
  constructor(private http: HttpClient) {}

  getAllNicePlaces(): Observable<NicePlace[]> {
    return this.http.get<NicePlace[]>('http://localhost:3000/niceplaces');
  }

  getNicePlaceById(nicePlaceId: number): Observable<NicePlace> {
    return this.http.get<NicePlace>(
      `http://localhost:3000/niceplaces/${nicePlaceId}`
    );
  }

  addNewPlace(formValue: {
    title: string;
    description: string;
    imageUrl: string;
    location?: string;
  }): Observable<NicePlace> {
    return this.getAllNicePlaces().pipe(
      map((nicePlaces) => [...nicePlaces].sort((a, b) => a.id - b.id)),
      map(
        (sortedNicePlaces) =>
          sortedNicePlaces[sortedNicePlaces.length - 1]
      ),
      map((previousNicePlace) => ({
        ...formValue,
        likes: 0,
        createdDate: new Date(),
        id: previousNicePlace.id + 1,
      })),
      switchMap((newNicePlace) =>
        this.http.post<NicePlace>(
          'http://localhost:3000/niceplaces',
          newNicePlace
        )
      )
    );
  }
}

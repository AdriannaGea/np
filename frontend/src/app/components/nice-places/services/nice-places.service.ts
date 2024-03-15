import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getNicePlaceById(nicePlaceId: number): Observable<NicePlace> {
    return this.http.get<NicePlace>(`${this.apiUrl}/niceplaces/${nicePlaceId}`);
  }
}

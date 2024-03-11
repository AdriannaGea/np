import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, mapTo, of } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { JoinUsValue } from '../models/join-us-value.model';

@Injectable({
  providedIn: 'root',
})
export class JoinUsService {
  constructor(private http: HttpClient) {}

  saveUserInfo(formValue: JoinUsValue): Observable<boolean> {
    return this.http.post(`${environment.apiUrl}/members`, formValue).pipe(
      mapTo(true),
      delay(1000),
      catchError(() => of(false).pipe(delay(1000)))
    );
  }
}

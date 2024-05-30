import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, mapTo, of } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { JoinUsValue } from 'src/app/models/join-us-value.model';


@Injectable({
  providedIn: 'root',
})
export class JoinUsService {
  constructor(private http: HttpClient) {}

  saveUserInfo(formValue: JoinUsValue): Observable<boolean> {
    const preparSave = {
      firstName: formValue.personalInfo.firstName,
      lastName: formValue.personalInfo.lastName,
      email: formValue.email?.email,
      userName: formValue.loginInfo.username,
      password: formValue.loginInfo.password,
    };

    return this.http.post<boolean>(`${environment.apiUrl}/api/members`, preparSave).pipe(
      mapTo(true),
      delay(1000),
      catchError(() => of(false).pipe(delay(1000)))
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiConceptsEtTravauxService {

  constructor(private http: HttpClient) { }

  addUserWithRole(userData: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/add_utilisateur_with_role', userData);
  }

  deleteUser(userId: number): Observable<any> {
    const url = `http://localhost:3000/delete_utilisateur/${userId}`;
    return this.http.delete<any>(url);
  }
}

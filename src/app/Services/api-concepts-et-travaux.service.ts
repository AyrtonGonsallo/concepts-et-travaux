import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../Models/Roles';
import { Autorisation } from '../Models/Autorisations';

@Injectable({
  providedIn: 'root'
})
export class ApiConceptsEtTravauxService {

  constructor(private http: HttpClient) { }
  
 // Méthode pour récupérer la liste des rôles depuis l'API
 getRoles(): Observable<Role[]> {
  return this.http.get<Role[]>('http://localhost:3000/get_Roles');
}
getAutorisations(): Observable<Autorisation[]> {
  return this.http.get<Autorisation[]>('http://localhost:3000/get_autorisations');
}
// Méthode pour récupérer les détails d'un utilisateur par son ID depuis l'API
getUserById(userId: number): Observable<any> {
  const url = `http://localhost:3000/get_utilisateur_by_id/${userId}`;
  return this.http.get<any>(url);
}

get_autorisation(userId: number): Observable<any> {
  const url = `http://localhost:3000/get_autorisation/${userId}`;
  return this.http.get<any>(url);
}
getAutorisationsByIds(ids: number[]): Observable<any> {
  const url = `http://localhost:3000/get_autorisations/${ids.join(',')}`;
  return this.http.get<any>(url);
}
get_role(userId: number): Observable<any> {
  const url = `http://localhost:3000/get_role/${userId}`;
  return this.http.get<any>(url);
}
  addUserWithRole(userData: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/add_utilisateur_with_role', userData);
  }
  add_autorisation(userData: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/add_autorisation', userData);
  }
  deleteUser(userId: number): Observable<any> {
    const url = `http://localhost:3000/delete_utilisateur/${userId}`;
    return this.http.delete<any>(url);
  }

  deleteAutorisation(autorisationId: number): Observable<any> {
    const url = `http://localhost:3000/delete_autorisation/${autorisationId}`;
    return this.http.delete<any>(url);
  }
  deleteRole(roleId: number): Observable<any> {
    const url = `http://localhost:3000/delete_role/${roleId}`;
    return this.http.delete<any>(url);
  }
  updateUser(userId: number, userData: any): Observable<any> {
    const url = `http://localhost:3000/update_utilisateur/${userId}`;
    return this.http.post<any>(url, userData);
  }
  updateAutorisation(userId: number, userData: any): Observable<any> {
    const url = `http://localhost:3000/update_autorisation/${userId}`;
    return this.http.put<any>(url, userData);
  }
  updateRole(userId: number, userData: any): Observable<any> {
    const url = `http://localhost:3000/update_role/${userId}`;
    return this.http.put<any>(url, userData);
  }
  

  
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../Models/Roles';
import { Autorisation } from '../Models/Autorisations';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConceptsEtTravauxService {

  constructor(private http: HttpClient) { }
  get_all_user_data_by_id(userId: number): Observable<any> {
    const url = `${environment.apiUrl}/get_all_user_data_by_id/${userId}`;
    return this.http.get<any>(url);
  }
  send_mail(mailData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/send-email`, mailData);
  }
  login_user(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/login_user`, userData);
  }
 // Méthode pour récupérer la liste des rôles depuis l'API
 getRoles(): Observable<Role[]> {
  return this.http.get<Role[]>(`${environment.apiUrl}/get_Roles`);
}
getAutorisations(): Observable<Autorisation[]> {
  return this.http.get<Autorisation[]>(`${environment.apiUrl}/get_autorisations`);
}
// Méthode pour récupérer les détails d'un utilisateur par son ID depuis l'API
clear_assurance_rc_decennale(userId: number): Observable<any> {
  const url = `${environment.apiUrl}/clear_assurance_rc_decennale/${userId}`;
  return this.http.get<any>(url);
}
clear_questionnaire_tarif(userId: number): Observable<any> {
  const url = `${environment.apiUrl}/clear_questionnaire_tarif/${userId}`;
  return this.http.get<any>(url);
}
clear_kbis(userId: number): Observable<any> {
  const url = `${environment.apiUrl}/clear_kbis/${userId}`;
  return this.http.get<any>(url);
}
getUsersByRole(userId: number): Observable<any> {
  const url = `${environment.apiUrl}/get_utilisateurs_by_role/${userId}`;
  return this.http.get<any>(url);
}
getUserById(userId: number): Observable<any> {
  const url = `${environment.apiUrl}/get_utilisateur_by_id/${userId}`;
  return this.http.get<any>(url);
}
getProjetsByUserId(userId: number): Observable<any> {
  const url = `${environment.apiUrl}/get_user_projects/${userId}`;
  return this.http.get<any>(url);
}
get_projet(userId: number): Observable<any> {
  const url = `${environment.apiUrl}/get_project/${userId}`;
  return this.http.get<any>(url);
}
getEtapesProjet(): Observable<any> {
  const url = `${environment.apiUrl}/get_etapes_projet`;
  return this.http.get<any>(url);
}
getBesoinsProjet(): Observable<any> {
  const url = `${environment.apiUrl}/get_besoins_projet`;
  return this.http.get<any>(url);
}
getCategoriesPiece(): Observable<any> {
  const url = `${environment.apiUrl}/get_categories_piece`;
  return this.http.get<any>(url);
}

getProjets(): Observable<any> {
  const url = `${environment.apiUrl}/get_all_projects`;
  return this.http.get<any>(url);
}
getPieces(): Observable<any> {
  const url = `${environment.apiUrl}/get_pieces`;
  return this.http.get<any>(url);
}
getRealisations(): Observable<any> {
  const url = `${environment.apiUrl}/get_realisations`;
  return this.http.get<any>(url);
}
get_galeries(): Observable<any> {
  const url = `${environment.apiUrl}/get_galeries`;
  return this.http.get<any>(url);
}

get_autorisation(userId: number): Observable<any> {
  const url = `${environment.apiUrl}/get_autorisation/${userId}`;
  return this.http.get<any>(url);
}
getAutorisationsByIds(ids: number[]): Observable<any> {
  const url = `${environment.apiUrl}/get_autorisations/${ids.join(',')}`;
  return this.http.get<any>(url);
}
getUtilisateursByIds(ids: number[]): Observable<any> {
  const url = `${environment.apiUrl}/get_utilisateurs/${ids.join(',')}`;
  return this.http.get<any>(url);
}

get_role(userId: number): Observable<any> {
  const url = `${environment.apiUrl}/get_role/${userId}`;
  return this.http.get<any>(url);
}
  addUserWithRole(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_utilisateur_with_role`, userData);
  }
  addParticulier(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_particulier`, userData);
  }
  add_autorisation(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_autorisation`, userData);
  }
  add_projet(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_project`, userData);
  }
  add_realisation(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/ajouter_realisation`, userData);
  }
  ajouter_piece(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/ajouter_piece`, userData);
  }
  add_role(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_role`, userData);
  }
  add_galerie_with_images(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_galerie_with_images`, userData);
  }

  upload_file(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/upload`, userData);
  }
  deleteUser(userId: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_utilisateur/${userId}`;
    return this.http.delete<any>(url);
  }

  deleteAutorisation(autorisationId: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_autorisation/${autorisationId}`;
    return this.http.delete<any>(url);
  }
  deleteProjet(autorisationId: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_project/${autorisationId}`;
    return this.http.delete<any>(url);
  }
  deleteRole(roleId: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_role/${roleId}`;
    return this.http.delete<any>(url);
  }
  updateUser(userId: number, userData: any): Observable<any> {
    const url = `${environment.apiUrl}/update_utilisateur/${userId}`;
    return this.http.post<any>(url, userData);
  }
  updateParticulier(userId: number, userData: any): Observable<any> {
    const url = `${environment.apiUrl}/update_particulier/${userId}`;
    return this.http.post<any>(url, userData);
  }
  updateProjet(userId: number, userData: any): Observable<any> {
    const url = `${environment.apiUrl}/update_project/${userId}`;
    return this.http.put<any>(url, userData);
  }
  updateAutorisation(userId: number, userData: any): Observable<any> {
    const url = `${environment.apiUrl}/update_autorisation/${userId}`;
    return this.http.put<any>(url, userData);
  }
  updateRole(userId: number, userData: any): Observable<any> {
    const url = `${environment.apiUrl}/update_role/${userId}`;
    return this.http.put<any>(url, userData);
  }
  

  
}

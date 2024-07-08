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
add_etape_projet(userData: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/ajouter_etape_projet`, userData);
}
add_besoin_projet(userData: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/ajouter_besoin_projet`, userData);
}
add_categorie_piece(userData: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/ajouter_categorie_piece`, userData);
}
getEtapesProjet(): Observable<any> {
  const url = `${environment.apiUrl}/get_etapes_projet`;
  return this.http.get<any>(url);
}
getEtapeProjetById(id: number): Observable<any> {
  const url = `${environment.apiUrl}/get_etape_projet/${id}`;
  return this.http.get<any>(url);
}

updateEtapeProjet(id: number, etape: any): Observable<any> {
  const url = `${environment.apiUrl}/update_etape_projet/${id}`;
  return this.http.put<any>(url, etape);
}

deleteEtapeProjet(id: number): Observable<any> {
  const url = `${environment.apiUrl}/delete_etape_projet/${id}`;
  return this.http.delete<any>(url);
}

getBesoinsProjet(): Observable<any> {
  const url = `${environment.apiUrl}/get_besoins_projet`;
  return this.http.get<any>(url);
}
getBesoinProjetById(id: number): Observable<any> {
  const url = `${environment.apiUrl}/get_besoin_projet/${id}`;
  return this.http.get<any>(url);
}

updateBesoinProjet(id: number, besoin: any): Observable<any> {
  const url = `${environment.apiUrl}/update_besoin_projet/${id}`;
  return this.http.put<any>(url, besoin);
}

deleteBesoinProjet(id: number): Observable<any> {
  const url = `${environment.apiUrl}/delete_besoin_projet/${id}`;
  return this.http.delete<any>(url);
}
getCategoriesPiece(): Observable<any> {
  const url = `${environment.apiUrl}/get_categories_piece`;
  return this.http.get<any>(url);
}

getCategoriePieceById(id: number): Observable<any> {
  const url = `${environment.apiUrl}/get_categorie_piece/${id}`;
  return this.http.get<any>(url);
}

updateCategoriePiece(id: number, categorie: any): Observable<any> {
  const url = `${environment.apiUrl}/update_categorie_piece/${id}`;
  return this.http.put<any>(url, categorie);
}

deleteCategoriePiece(id: number): Observable<any> {
  const url = `${environment.apiUrl}/delete_categorie_piece/${id}`;
  return this.http.delete<any>(url);
}

getProjets(): Observable<any> {
  const url = `${environment.apiUrl}/get_all_projects`;
  return this.http.get<any>(url);
}
getPieces(): Observable<any> {
  const url = `${environment.apiUrl}/get_pieces`;
  return this.http.get<any>(url);
}
getPiece(id:number): Observable<any> {
  const url = `${environment.apiUrl}/get_piece/${id}`;
  return this.http.get<any>(url);
}
getRealisations(): Observable<any> {
  const url = `${environment.apiUrl}/get_realisations`;
  return this.http.get<any>(url);
}
getRealisation(id:number): Observable<any> {
  const url = `${environment.apiUrl}/get_realisation/${id}`;
  return this.http.get<any>(url);
}

get_galeries(): Observable<any> {
  const url = `${environment.apiUrl}/get_galeries`;
  return this.http.get<any>(url);
}
get_galerie(id: number): Observable<any> {
  const url = `${environment.apiUrl}/get_galerie/${id}`;
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
  add_question(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_question`, userData);
  }
  get_categories_question(): Observable<any> {
    const url = `${environment.apiUrl}/get_categories_question/`;
    return this.http.get<any>(url);
  }
  get_categorie_question(id: number): Observable<any> {
    const url = `${environment.apiUrl}/get_categorie_question/${id}`;
    return this.http.get<any>(url);
  }
  get_questions(): Observable<any> {
    const url = `${environment.apiUrl}/get_questions/`;
    return this.http.get<any>(url);
  }
  get_question(id: number): Observable<any> {
    const url = `${environment.apiUrl}/get_question/${id}`;
    return this.http.get<any>(url);
  }
    
  add_categorie_question(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/create_categorie_question`, userData);
  }
  update_question(id:number,userData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_question/${id}`, userData);
  }
  update_categorie_question(id:number,userData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_categorie_question/${id}`, userData);
  }
  add_realisation(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/ajouter_realisation`, userData);
  }
  update_realisation(id:number,userData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_realisation/${id}`, userData);
  }
  update_piece(id:number,userData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_piece/${id}`, userData);
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

  add_images_to_galerie(id:number,userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_images_to_galerie/${id}`, userData);
  }

  upload_file(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/upload`, userData);
  }
  deleteUser(userId: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_utilisateur/${userId}`;
    return this.http.delete<any>(url);
  }
  deleteRealisation(id: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_realisation/${id}`;
    return this.http.delete<any>(url);
  }
  delete_categorie_question(id: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_categorie_question/${id}`;
    return this.http.delete<any>(url);
  }
  delete_question(id: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_question/${id}`;
    return this.http.delete<any>(url);
  }
  deletePiece(id: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_piece/${id}`;
    return this.http.delete<any>(url);
  }
  deleteGalerie(userId: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_galerie/${userId}`;
    return this.http.delete<any>(url);
  }
  deleteImageFromGallery(id: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_image_from_gallery/${id}`;
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
  
   // Ajouter un nouveau Pointcle
   addPointcle(pointcleData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_pointcle`, pointcleData);
  }

  // Obtenir tous les Pointcles
  getPointscles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/get_pointscle`);
  }

  // Obtenir un Pointcle par ID
  getPointcleById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_pointcle/${id}`);
  }

  // Mettre à jour un Pointcle par ID
  updatePointcle(id: number, pointcleData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_pointcle/${id}`, pointcleData);
  }

  // Supprimer un Pointcle par ID
  deletePointcle(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_pointcle/${id}`);
  }

  // Create
  addAvis(avisData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_avis`, avisData);
  }

  // Read all
  getAvis(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/get_all_avis`);
  }

  // Read one
  getAvisById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_avis/${id}`);
  }

  // Update
  updateAvis(id: number, avisData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_avis/${id}`, avisData);
  }

  // Delete
  deleteAvis(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_avis/${id}`);
  }

  // Create
  addFrontPage(avisData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_page`, avisData);
  }

  // Read all
  getFrontPages(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/get_pages`);
  }

  // Read one
  getFrontPageById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_page/${id}`);
  }

  // Update
  updateFrontPage(id: number, avisData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_page/${id}`, avisData);
  }

  // Delete
  deleteFrontPage(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_page/${id}`);
  }
 
   // Create
   addEquipement(equipement: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_equipement/`, equipement);
  }

  // Read all
  getEquipements(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_equipements/`);
  }

  // Read one
  getEquipement(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_equipement/${id}`);
  }

  // Read by PieceID
  getEquipementsByPiece(pieceID: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_equipements_by_piece/${pieceID}`);
  }

  // Update
  updateEquipement(id: number, equipement: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_equipement/${id}`, equipement);
  }

  // Delete
  deleteEquipement(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_equipement/${id}`);
  }

  // Méthode pour ajouter un travail
  addTravail(travailData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_travail`, travailData);
  }

  // Méthode pour récupérer tous les travaux avec les détails de la pièce associée
  getTravaux(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/get_travaux`);
  }

  // Méthode pour récupérer un travail par son ID avec les détails de la pièce associée
  getTravailById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_travail/${id}`);
  }

  // Méthode pour récupérer un travail par son ID avec les détails de la pièce associée
  getTravauxByPieceId(pid: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_travaux_by_piece/${pid}`);
  }

  // Méthode pour mettre à jour un travail par son ID
  updateTravail(id: number, travailData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_travail/${id}`, travailData);
  }

  // Méthode pour supprimer un travail par son ID
  deleteTravail(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_travail/${id}`);
  }
}

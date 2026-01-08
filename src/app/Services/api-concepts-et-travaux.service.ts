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
add_visite(userData: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/add_visite`, userData);
}

update_visite(id: number, visite: any): Observable<any> {
  const url = `${environment.apiUrl}/update_visite/${id}`;
  return this.http.put<any>(url, visite);
}
add_paiement(userData: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/add_paiement`, userData);
}

add_demande_paiement(userData: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/add_demande_paiement`, userData);
}

ressend_demande_paiement(id: number): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/ressend_demande_paiement/${id}`);
}


update_status_demande_paiement(id: number): Observable<any> {
  const url = `${environment.apiUrl}/update_status_demande_paiement/${id}`;
  return this.http.put<any>(url, null);
}

get_all_projet_paiements(devisID: number): Observable<any> {
  const url = `${environment.apiUrl}/get_all_projet_paiements/${devisID}`;
  return this.http.get<any>(url);
}

getFichiers(): Observable<any> {
  const url = `${environment.apiUrl}/get_fichiers/`;
  return this.http.get<any>(url);
}

deleteFichier(id: number): Observable<any> {
  const url = `${environment.apiUrl}/delete_fichier/${id}`;
  return this.http.delete<any>(url);
}

send_visite_scheduled(visiteID: number,projectID:number): Observable<any> {
  const url = `${environment.apiUrl}/send_visite_scheduled/${visiteID}/${projectID}`;
  return this.http.get<any>(url);
}

send_visite_done(visiteID: number,projectID:number): Observable<any> {
  const url = `${environment.apiUrl}/send_visite_done/${visiteID}/${projectID}`;
  return this.http.get<any>(url);
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
update_project_status( donnees: any): Observable<any> {
  const url = `${environment.apiUrl}/update_project_status`;
  return this.http.post<any>(url, donnees);
}

deleteEtapeProjet(id: number): Observable<any> {
  const url = `${environment.apiUrl}/delete_etape_projet/${id}`;
  return this.http.delete<any>(url);
}

delete_paiement(id: number): Observable<any> {
  const url = `${environment.apiUrl}/delete_paiement/${id}`;
  return this.http.delete<any>(url);
}

add_etape_devis(userData: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/ajouter_etape_devis`, userData);
}
getEtapesDevis(): Observable<any> {
  const url = `${environment.apiUrl}/get_etapes_devis`;
  return this.http.get<any>(url);
}
getEtapeDevisById(id: number): Observable<any> {
  const url = `${environment.apiUrl}/get_etape_devis/${id}`;
  return this.http.get<any>(url);
}

updateEtapeDevis(id: number, etape: any): Observable<any> {
  const url = `${environment.apiUrl}/update_etape_devis/${id}`;
  return this.http.put<any>(url, etape);
}

deleteEtapeDevis(id: number): Observable<any> {
  const url = `${environment.apiUrl}/delete_etape_devis/${id}`;
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
get_prix_devis_piece(id: number): Observable<any> {
  const url = `${environment.apiUrl}/get_prix_devis_piece/${id}`;
  return this.http.get<any>(url);
}

get_prix_devis_tache(data: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/get_prix_devis_tache`, data);
}
// Read by Type
getEquipementsByType(type: string): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/get_equipements_by_type/${type}`);
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

  upload_import_gammes_file(formData: any): Observable<any> {

  return this.http.post<any>(`${environment.apiUrl}/import_gammes`, formData);
}

  upload_import_equipements(formData: any): Observable<any> {

  return this.http.post<any>(`${environment.apiUrl}/import_equipements`, formData);
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

  get_all_projet_remises(pid: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_all_remises_by_project/${pid}`);
  }
  add_remise(remise: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_remise/`, remise);
  }
  delete_remise(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_remise/${id}`);
  }

  // Read by PieceID
  getEquipementsByPiece(pieceID: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_equipements_by_piece/${pieceID}`);
  }

  // Update
  updateEquipement(id: number, equipement: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_equipement/${id}`, equipement);
  }

  restaurerDevisTache(id_tache: number, id_historique: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/restaurer_devis_tache/${id_tache}/${id_historique}`, null);
  }


  updateDevistache(id: number, dt: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_devis_tache/${id}`, dt);
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

  // Méthode pour récupérer 
  getHistoriqueDevisTacheById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_historique_devis_tache/${id}`);
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

  // Ajouter un nouveau modèle d'équipement
  addModeleEquipement(modeleEquipement: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_modele_equipement`, modeleEquipement);
  }

 

  getExportGammes(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/export_gammes`, {
      responseType: 'blob'  // Important : récupérer la réponse comme un fichier (Blob)
    });
  }

  getExportModelesEquipements(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/export_modeles_equipement`, {
      responseType: 'blob'  // Important : récupérer la réponse comme un fichier (Blob)
    });
  }


  // Récupérer un modèle d'équipement par son ID
  getModeleEquipementById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_modele_equipement/${id}`);
  }

  // Mettre à jour un modèle d'équipement par son ID
  updateModeleEquipement(id: number, modeleEquipement: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_modele_equipement/${id}`, modeleEquipement);
  }

  // Supprimer un modèle d'équipement par son ID
  deleteModeleEquipement(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_modele_equipement/${id}`);
  }

  // Récupérer tous les modèles d'équipement
  getModelesEquipement(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_modeles_equipement`);
  }

  getDevisPieceById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_devis_piece/${id}`);
  }

  get_devis_tache(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_devis_tache/${id}`);
  }
  getGammesByTravailAndTypeOrdered(travailID:number,type: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_ordered_gammes_by_type_and_travailID/${travailID}/${type}`);
  }
  // Méthode pour récupérer un travail par son ID avec les détails de la pièce associée
  get_devis_taches_by_travail(tid: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_devis_taches_by_travail/${tid}`);
  }

  // Méthode pour récupérer les devis
  getAllDevisPieces(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_all_devis_piece`);
  }

  // Méthode pour récupérer les devis avec les projets
  getAllDevisPieceswithProjects(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_all_devis_piece_with_projects`);
  }

  // Méthode pour récupérer un travail par son ID avec les détails de la pièce associée
  getUserProjects(uid: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_user_Projects/${uid}`);
  }
   // Méthode pour supprimer un devis pièce par ID
   deleteDevisPiece(devisPieceId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_devis_piece/${devisPieceId}`);
  }
   // Update
   updateDevisPiece(id: number, devis: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_devis_piece/${id}`, devis);
  }
  // Update
  updateCommentaireDevisPiece(id: number, devis: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_commentaire_devis_piece/${id}`, devis);
  }
  addParametre(parametre: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_parametre`, parametre);
  }
  // Méthode pour récupérer un travail par son ID avec les détails de la pièce associée
  getParametreById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_parametre/${id}`);
  }
  getParametres(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_parametres`);
  }
  deleteParametre(ParametreId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_parametre/${ParametreId}`);
  }
   // Update
   updateParametre(id: number, Parametre: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_parametre/${id}`, Parametre);
  }

  // Ajouter un nouveau modèle d'équipement
  addGamme(gamme: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_gamme`, gamme);
  }
  // Méthode pour récupérer un travail par son ID avec les détails de la pièce associée
  getGammeById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_gamme/${id}`);
  }
  getGammesByTravailAndType(travailID:number,type: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_gammes_by_type_and_travailID/${travailID}/${type}`);
  }

  getFournisseursGammesByGammeReference(refID:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_Fournisseurs_gammes_by_refID/${refID}`);
  }
  // Méthode pour récupérer un travail par son ID avec les détails de la pièce associée
  getGammes(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_gammes`);
  }
   // Méthode pour supprimer un devis pièce par ID
   deleteGamme(gammeId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_gamme/${gammeId}`);
  }
   // Update
   updateGamme(id: number, gamme: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_gamme/${id}`, gamme);
  }

  // Ajouter un nouveau modèle d'équipement
  addTacheGenerale(tache_generale: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/add_tache_generale`, tache_generale);
  }
  // Méthode pour récupérer un travail par son ID avec les détails de la pièce associée
  getTacheGeneraleById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_tache_generale/${id}`);
  }
  getTacheGeneralesByTravailAndType(travailID:number,type: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_tache_generales_by_type_and_travailID/${travailID}/${type}`);
  }
  // Méthode pour récupérer un travail par son ID avec les détails de la pièce associée
  getTacheGenerales(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_tache_generales`);
  }
  // Méthode pour supprimer un devis pièce par ID
  deleteTacheGenerale(tache_generaleId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/delete_tache_generale/${tache_generaleId}`);
  }
  // Update
  updateTacheGenerale(id: number, tache_generale: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update_tache_generale/${id}`, tache_generale);
  }
  edit_devis_tache(id:number,json: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/edit_devis_tache/${id}`, json);
  }
}

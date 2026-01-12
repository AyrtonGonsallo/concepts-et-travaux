import { Injectable } from '@angular/core';
import { ApiConceptsEtTravauxService } from './api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private userSubject = new BehaviorSubject<any>(this.getDataFromLocal("utilisateur") || null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private userService: ApiConceptsEtTravauxService,
    private message: NzMessageService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  // Login avec gestion des erreurs et de l'état
  login(userData: any): void {
    this.userService.login_user(userData).subscribe(
      (response) => {
        console.log('Utilisateur identifié avec succès :', response);
        this.userService.get_all_user_data_by_id(response.Id).subscribe(
          (response2) => {
            // Sauvegarder les données et émettre via BehaviorSubject
            this.saveDataToLocal("utilisateur", response2);
            this.userSubject.next(response2);  // Mise à jour du BehaviorSubject avec les nouvelles données
            this.message.create('success', `Utilisateur identifié avec succès`);
            
            this.loggedIn = true;
            // Création d'un cookie pour l'authentification
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 3);


            this.cookieService.set(
              'loggedInconcepts&travauxback',
              'true',
              { expires: expirationDate }
            );

            // on sauvegarde aussi l'expiration
            localStorage.setItem(
              'auth_expiration',
              expirationDate.toISOString()
            );
        

            
            this.router.navigate(['/administration']);
            

            },
          (error) => {
            console.error('Erreur lors de l\'identification de l\'utilisateur :', error);
            this.message.create('error', `Erreur lors de l\'identification de l\'utilisateur`);
          }
        );
      },
      (error) => {
        console.error('Erreur lors de l\'identification de l\'utilisateur :', error);
        this.message.create('error', `Erreur lors de l\'identification de l\'utilisateur`);
      }
    );
  }

  // Méthode pour récupérer les données utilisateur depuis le localStorage
  getDataFromLocal(nom: string): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(nom);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  // Méthode pour stocker les données dans le localStorage
  saveDataToLocal(nom: string, data: any): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(nom, JSON.stringify(data));
    }
  }

  // Récupérer l'utilisateur depuis le BehaviorSubject (au lieu de recréer un Observable à chaque fois)
  getUser(): Observable<any> {
    return this.user$;
  }

  // Supprimer les données du localStorage
  clearDataFromLocal(nom: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(nom);
    }
  }

  // Logout et nettoyage des données
  logout(): void {
    this.loggedIn = false;
    this.cookieService.delete('loggedInconcepts&travauxback');
    this.message.create('success', `Utilisateur déconnecté`);
    this.clearDataFromLocal("utilisateur");
    this.userSubject.next(null);  // Mise à jour du BehaviorSubject avec une valeur nulle
    this.router.navigate(['login']);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.cookieService.get('loggedInconcepts&travauxback') === 'true';
  }

  // Vérifier si l'utilisateur est un admin
  isAdmin(): boolean {
    const utilisateur = this.getDataFromLocal("utilisateur");
    return utilisateur ? utilisateur.Role.Id === 1 : false;
  }

  // Vérifier si l'utilisateur est un admin ou super admin
  isAdminorSuperAdmin(): boolean {
    const utilisateur = this.getDataFromLocal("utilisateur");
    return utilisateur ? (utilisateur.Role.Id === 1 || utilisateur.Role.Id === 12) : false;
  }

  // Vérifier si l'utilisateur est un admin ou super admin
  isTechAdminorSuperAdmin(): boolean {
    const utilisateur = this.getDataFromLocal("utilisateur");
    return utilisateur ? (utilisateur.Role.Id === 13  || utilisateur.Role.Id === 1 || utilisateur.Role.Id === 12) : false;
  }

  // Vérifier si c'est le même utilisateur
  isHim(id: number): boolean {
    const utilisateur = this.getDataFromLocal("utilisateur");
    return utilisateur ? utilisateur.Id === id : false;
  }

  // Vérifier si l'utilisateur est admin ou le même utilisateur
  isAdminOrHim(id: number): boolean {
    const utilisateur = this.getDataFromLocal("utilisateur");
    return utilisateur ? (utilisateur.Role.Id === 1 || utilisateur.Id === id) : false;
  }

  // Vérifier si l'utilisateur n'est pas un artisan
  IsNotArtisan(): boolean {
    const utilisateur = this.getDataFromLocal("utilisateur");
    return utilisateur ? utilisateur.Role.Id !== 2 : false;
  }

  // Vérifier si l'utilisateur est lui-même ou un admin avec un autre utilisateur non admin
  isHimOrAdminAndOtherNotAdmin(id: number, other_user_roleId: number): boolean {
    const utilisateur = this.getDataFromLocal("utilisateur");
    return utilisateur ? (utilisateur.Role.Id === 1 && other_user_roleId !== 1) || utilisateur.Id === id : false;
  }

  // Vérifier si l'utilisateur est lui-même ou un super admin
  isHimOrSuperAdmin(id: number): boolean {
    const utilisateur = this.getDataFromLocal("utilisateur");
    return utilisateur ? (utilisateur.Role.Id === 12 || utilisateur.Id === id) : false;
  }


    isSessionExpired(): boolean {
    const expiration = localStorage.getItem('auth_expiration');
    if (!expiration) {
      return true;
    }

    return new Date(expiration) <= new Date();
  }



}

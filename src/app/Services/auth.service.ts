import { Injectable } from '@angular/core';
import { ApiConceptsEtTravauxService } from './api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor(private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router,private cookieService: CookieService) {}

  login(userData: any): void {
    // Logique de connexion ici (par exemple, appel à une API, gestion de jetons, etc.)
    this.userService.login_user(userData).subscribe(
      (response) => {
        console.log('Utilisateur identifié avec succès :', response);
        this.message.create('success', `Utilisateur identifié avec succès`);
        this.router.navigate(['/administration']);
        this.loggedIn = true;
        // Créer un cookie pour stocker l'information de connexion avec expiration dans 1 heure
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1); // Ajouter 1 heure

        this.cookieService.set('loggedInconcepts&travauxback', 'true', {
          expires: expirationDate,
          /* Autres options */
        });
      },
      (error) => {
        console.error('Erreur lors de l\'identification de l\'utilisateur :', error);
        this.message.create('error', `Erreur lors de l\'identification de l\'utilisateur`);
      }
    );
   
  }

  logout(): void {
    // Logique de déconnexion ici
    this.loggedIn = false;
    this.cookieService.delete('loggedInconcepts&travauxback');
    this.message.create('success', `Utilisateur déconnecté`);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    //return this.loggedIn;
    return this.cookieService.get('loggedInconcepts&travauxback') === 'true';
  }
}

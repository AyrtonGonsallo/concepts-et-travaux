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
        this.userService.get_all_user_data_by_id(response.Id).subscribe(
          (response2) => {
            this.saveDataToLocal("utilisateur",response2)
          },
          (error) => {
            console.error('Erreur lors de l\'identification de l\'utilisateur :', error);
            this.message.create('error', `Erreur lors de l\'identification de l\'utilisateur`);
          })
          
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
// Méthode pour stocker les données dans le stockage local
saveDataToLocal(nom:string,data: any): void {
  localStorage.setItem(nom, JSON.stringify(data));
}

// Méthode pour récupérer les données du stockage local
getDataFromLocal(nom:string,): any {
  const data = localStorage.getItem(nom);
  return data ? JSON.parse(data) : null;
}

// Méthode pour supprimer les données du stockage local
clearDataFromLocal(nom:string): void {
  localStorage.removeItem(nom);
}
  logout(): void {
    // Logique de déconnexion ici
    this.loggedIn = false;
    this.cookieService.delete('loggedInconcepts&travauxback');
    this.message.create('success', `Utilisateur déconnecté`);
    this.clearDataFromLocal("utilisateur")
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    //return this.loggedIn;
    return this.cookieService.get('loggedInconcepts&travauxback') === 'true';
  }
  isAdmin(): boolean {
    //return this.loggedIn;
    return this.getDataFromLocal("utilisateur").Role.Id == 1;
  }
  isHim(id:number): boolean {
    //return this.loggedIn;
    var iduser=this.getDataFromLocal("utilisateur").Id
    console.log("comparaison "+iduser+" et "+id)
   
      return iduser == id;
    
    
   
  }
  isAdminOrHim(id:number){
    //return this.loggedIn;
    var iduser=this.getDataFromLocal("utilisateur").Id
    //console.log("comparaison "+iduser+" et "+id)
    if(this.getDataFromLocal("utilisateur").Role.Id == 1){
      return true
    }else{
      return iduser == id;
    }
  }
  IsNotArtisan(): boolean {
    //return this.loggedIn;
    return this.getDataFromLocal("utilisateur").Role.Id != 2;
  }
  isHimOrAdminAndOtherNotAdmin(id:number,other_user_roleId:number){
    //return this.loggedIn;
    var iduser=this.getDataFromLocal("utilisateur").Id
    //console.log("comparaison "+iduser+" et "+id)
    if((this.getDataFromLocal("utilisateur").Role.Id) == 1 && other_user_roleId!=1){
      return true
    }else{
      return iduser == id;
    }
  }
}

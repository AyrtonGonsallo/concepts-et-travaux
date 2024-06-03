import { Component } from '@angular/core';
import { Utilisateur } from '../../../Models/Utilisateurs';
import { HttpClient } from '@angular/common/http';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-comptes',
  templateUrl: './comptes.component.html',
  styleUrl: './comptes.component.css'
})
export class ComptesComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Utilisateur, b: Utilisateur) => a.Id - b.Id,
      priority: 3
    },
    {
      title: 'RaisonSociale',
      compare: (a: Utilisateur, b: Utilisateur) => (a.RaisonSociale  ?? '').localeCompare(b.RaisonSociale ?? ''),
      priority: false
    },
    
    {
      title: 'Nom',
      compare: (a: Utilisateur, b: Utilisateur) => a.Nom.localeCompare(b.Nom),
      priority: 2
    },
    {
      title: 'Prénom',
      compare: (a: Utilisateur, b: Utilisateur) => a.Prenom.localeCompare(b.Prenom),
      priority: 1
    },
    {
      title: 'Email',
      compare: (a: Utilisateur, b: Utilisateur) => a.Email.localeCompare(b.Email),
      priority: 1
    },
    {
      title: 'Telephone',
      compare: (a: Utilisateur, b: Utilisateur) => a.Telephone.localeCompare(b.Telephone),
      priority: 1
    },
    {
      title: 'AdressePostale',
      compare: (a: Utilisateur, b: Utilisateur) => a.AdressePostale.localeCompare(b.AdressePostale),
      priority: 1
    },
    {
      title: 'Role',
      compare: (a: Utilisateur, b: Utilisateur) => (a.Role?.Titre  ?? '' ).localeCompare(b.Role?.Titre  ?? '' ),
      priority: 1
    }
  ];
  utilisateurs:Utilisateur[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs(): void {
    this.http.get<Utilisateur[]>(`${environment.apiUrl}/get_utilisateurs`)
      .subscribe((data: Utilisateur[]) => {
        this.utilisateurs = data;
        console.log("réponse de la requette get_utilisateurs",this.utilisateurs);
      });
      console.log("envoi de la requette get_utilisateurs",this.utilisateurs);
      
  }
  isAdminOrHim(id:number){

    return this.authService.isAdminOrHim(id)
  }
  isHimOrAdminAndOtherNotAdmin(id:number,rid:number| undefined){
    return this.authService.isHimOrAdminAndOtherNotAdmin(id,rid?rid:0)
  }
  cancel(): void {
    this.message.info('suppression annulée');
  }
  deleteUser(userId: number,roleId: number | undefined) {
    if (this.authService.isHimOrAdminAndOtherNotAdmin( userId,roleId?roleId:0)) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          //console.log('Utilisateur supprimé avec succès');
          this.message.success( 'Utilisateur supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des utilisateurs si nécessaire
          this.loadUtilisateurs();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          this.message.error( 'Erreur lors de la suppression de l\'utilisateur');
        }
      );
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour acceder à cette page et/ou ce n'est pas votre compte`);
      return false;
    }
    
  }
}
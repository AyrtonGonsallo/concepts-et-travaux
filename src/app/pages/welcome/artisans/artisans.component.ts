import { Component } from '@angular/core';
import { Utilisateur } from '../../../Models/Utilisateurs';
import { HttpClient } from '@angular/common/http';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-artisans',
  templateUrl: './artisans.component.html',
  styleUrl: './artisans.component.css'
})
export class ArtisansComponent {
size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Utilisateur, b: Utilisateur) => a.Id - b.Id,
      priority: 3
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
      title: 'Rôle',
      compare: (a: Utilisateur, b: Utilisateur) => (a.Role?.Titre  ?? '' ).localeCompare(b.Role?.Titre  ?? '' ),
      priority: 1
    }
  ];
  
  utilisateurs:Utilisateur[] = [];

  utilisateursFiltres: Utilisateur[] = [];
  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des comptes');
    this.loadUtilisateurs();
    this.authService.getUser().subscribe(
      (user) => {
        console.log('Utilisateur récupéré:', user);
        this.uid=user.Id
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    );
    
  }
uid=0
  loadUtilisateurs(): void {
    this.userService.getUsersByRole(17)
      .subscribe((data: Utilisateur[]) => {
        if(!this.isAdminorSuperAdmin()){
          this.utilisateurs = data.filter(user => user.Id === this.uid);

          console.log("réponse de la requette get_utilisateur",this.uid,this.utilisateurs)
        }else{
          this.utilisateurs = data;
        console.log("réponse de la requette get_utilisateurs",this.utilisateurs)
        };
        this.utilisateursFiltres = [...this.utilisateurs];
      });
      console.log("envoi de la requette get_utilisateurs",this.utilisateurs);
      
  }

 
  isAdminOrHim(id:number){

    return this.authService.isAdminOrHim(id)
  }
  isHimOrSuperAdmin(id:number){
    return this.authService.isHimOrSuperAdmin(id)
  }
  isAdminorSuperAdmin(){
    return this.authService.isAdminorSuperAdmin()
  }
  cancel(): void {
    this.message.info('suppression annulée');
  }
  deleteUser(userId: number,roleId: number | undefined) {
    if (this.authService.isHimOrSuperAdmin( userId)) {
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

search_term=''
  onSearch(): void {
    const term = this.search_term.toLowerCase();

    this.utilisateursFiltres = this.utilisateurs.filter(user =>
      user.Nom?.toLowerCase().includes(term) ||
      user.Prenom?.toLowerCase().includes(term) ||
      user.Email?.toLowerCase().includes(term) ||
      user.Telephone?.toLowerCase().includes(term) ||
      user.Role?.Titre?.toLowerCase().includes(term)
    );
  }
  
}

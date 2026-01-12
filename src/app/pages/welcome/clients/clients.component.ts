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
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
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
      title: 'DateDeCreation',
      compare: (a: Utilisateur, b: Utilisateur) => {
        const dateA = new Date(a.DateDeCreation ?? 0).getTime();
        const dateB = new Date(b.DateDeCreation ?? 0).getTime();

        return dateA - dateB;
      },
      priority: 1,
      order:'descend', 
    },
   
  ];


  utilisateurs: Utilisateur[] = [];
  utilisateursSource: Utilisateur[] = [];
  searchValue = '';

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des clients');
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
  this.http
    .get<Utilisateur[]>(`${environment.apiUrl}/get_utilisateurs_by_role/3`)
    .subscribe((data: Utilisateur[]) => {

      if (!this.isAdminorSuperAdmin()) {
        this.utilisateursSource = data.filter(user => user.Id === this.uid);
      } else {
        this.utilisateursSource = data;
      }

      // affichage initial
      this.utilisateurs = [...this.utilisateursSource];
    });
}


onSearch(): void {
  const value = this.searchValue.toLowerCase();

  this.utilisateurs = this.utilisateursSource.filter(user =>
    user.Nom?.toLowerCase().includes(value) ||
    user.Prenom?.toLowerCase().includes(value) ||
    user.Email?.toLowerCase().includes(value)
  );
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
}
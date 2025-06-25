import { Component } from '@angular/core';
import { Projet } from '../../../Models/Projet';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';

@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.css'
})
export class ProjetComponent {
  projets: Projet[] = [];
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Projet, b: Projet) => a.Id - b.Id,
      priority: 3,
      order: null
    },
    {
     title: 'Nom',
      compare: (a: Projet, b: Projet) => a.Nom.localeCompare(b.Nom),
      priority: 2,
      order: null
    },
    {
      title: 'Status',
      compare: (a: Projet, b: Projet) => a.Status.localeCompare(b.Status),
      priority: false,
      order: null
    },
    {
      title: 'Validé ?',
      compare: (a: Projet, b: Projet) => 1,
      priority: false,
      order: null
    },
    {
      title: 'DateDeCreation',
      compare: (a: Projet, b: Projet) => {
        if (!a.Date_de_creation || !b.Date_de_creation) return 0;
        return new Date(a.Date_de_creation).getTime() - new Date(b.Date_de_creation).getTime();
      },
      priority: 1,
      order:'descend', 
    }
  ];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadProjets();
  }

  loadProjets(): void {
    if(this.authService.isAdminorSuperAdmin()){
      this.userService.getProjets().subscribe(
        (response) => {
          this.projets = response;
          console.log("réponse de la requette get_projets",response);
        },
        (error) => {
          console.error('Erreur lors de la recuperation des projets :', error);
        }
      );
    }else{
      this.userService.getProjetsByUserId (this.authService.getDataFromLocal("utilisateur").Id).subscribe(
        (response) => {
          this.projets = response;
          console.log("réponse de la requette get_projets",this.projets);
        },
        (error) => {
          console.error('Erreur lors de la recuperation des projets :', error);
        }
      );
    }
    
      console.log("envoi de la requette get_Projets",this.projets);
  }
  deleteProjet(autoId: number) {
    this.userService.get_projet(autoId).subscribe((succ) => {
      let projet_a_sup=succ
      if (this.authService.isAdminorSuperAdmin()) {
        this.userService.deleteProjet(autoId).subscribe(
          () => {
            console.log('Utilisateur supprimé avec succès');
            // Mettez ici le code pour actualiser la liste des Projets si nécessaire
            this.loadProjets();
          },
          (error) => {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          }
        );
        return true
      } else {
        this.message.info( `Vous n'avez pas assez de privilèges pour faire cette action`);
        return false;
      }
    },
    (error) => {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    })

    

    
  }
}
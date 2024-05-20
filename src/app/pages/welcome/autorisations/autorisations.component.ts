import { Component } from '@angular/core';
import { Autorisation } from '../../../Models/Autorisations';
import { HttpClient } from '@angular/common/http';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-autorisations',
  templateUrl: './autorisations.component.html',
  styleUrl: './autorisations.component.css'
})
export class AutorisationsComponent {
  autorisations: Autorisation[] = [];
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Autorisation, b: Autorisation) => a.Id - b.Id,
      priority: 3
    },
    {
     title: 'Explications',
      compare: (a: Autorisation, b: Autorisation) => a.Explications.localeCompare(b.Explications),
      priority: 1
    },
    {
      title: 'Titre',
      compare: (a: Autorisation, b: Autorisation) => a.Titre.localeCompare(b.Titre),
      priority: false
    },
    {
      title: 'DateDeCreation',
      compare: (a: Autorisation, b: Autorisation) => {
        if (!a.DateDeCreation || !b.DateDeCreation) return 0;
        return new Date(a.DateDeCreation).getTime() - new Date(b.DateDeCreation).getTime();
      },
      priority: 2
    }
  ];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadAutorisations();
  }

  loadAutorisations(): void {
    this.userService.getAutorisations().subscribe(
      (response) => {
        this.autorisations = response;
        console.log("réponse de la requette get_roles",this.autorisations);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des roles :', error);
      }
    );
      console.log("envoi de la requette get_autorisations",this.autorisations);
  }

  deleteAutorisation(autoId: number) {
    if (this.authService.isAdmin()) {
      this.userService.deleteAutorisation(autoId).subscribe(
        () => {
          console.log('Utilisateur supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des Autorisations si nécessaire
          this.loadAutorisations();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        }
      );
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour acceder à cette page et/ou ce n'est pas votre compte`);
      return false;
    }

    
  }
}
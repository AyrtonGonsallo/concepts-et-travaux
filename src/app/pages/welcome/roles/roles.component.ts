import { Component } from '@angular/core';
import { Role } from '../../../Models/Roles';
import { HttpClient } from '@angular/common/http';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Role, b: Role) => a.Id - b.Id,
      priority: false
    },
    {
      title: 'Titre',
      compare: (a: Role, b: Role) => a.Titre.localeCompare(b.Titre),
      priority: false
    },
    {
      title: 'Commentaire',
      compare: (a: Role, b: Role) => a.Commentaire.localeCompare(b.Commentaire),
      priority: false
    },
    
  ];
  roles: Role[] = [];

  constructor(private http: HttpClient,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe(
      (response) => {
        this.roles = response;
        console.log("réponse de la requette get_roles",this.roles);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des roles :', error);
      }
    );
  }
  deleteRole(roleId: number) {
    this.userService.deleteRole(roleId).subscribe(
      () => {
        console.log('role supprimé avec succès');
        // Mettez ici le code pour actualiser la liste des Autorisations si nécessaire
        this.loadRoles();
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'role :', error);
      }
    );
  }
}

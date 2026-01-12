import { Component } from '@angular/core';
import { Role } from '../../../Models/Roles';
import { HttpClient } from '@angular/common/http';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Title } from '@angular/platform-browser';

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

  constructor(private titleService: Title,private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Liste des rôles');
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
    if (this.authService.isAdminorSuperAdmin()) {
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
      return true
    } else {
      this.message.info( `Vous n'avez pas assez de privilèges pour acceder à cette page et/ou ce n'est pas votre compte`);
      return false;
    }
    
  }
}

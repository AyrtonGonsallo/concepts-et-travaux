import { Component } from '@angular/core';
import { Role } from '../../../Models/Roles';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.http.get<Role[]>('http://localhost:3000/get_Roles')
      .subscribe((data: Role[]) => {
        this.roles = data;
        console.log("réponse de la requette get_roles",this.roles);
      });
      console.log("envoi de la requette get_roles",this.roles);
  }
}

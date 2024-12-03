import { Component } from '@angular/core';
import { Equipement } from '../../../Models/Equipement';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-equipements',
  templateUrl: './equipements.component.html',
  styleUrl: './equipements.component.css'
})
export class EquipementsComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Equipement, b: Equipement) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: Equipement, b: Equipement) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Description',
      compare: (a: Equipement, b: Equipement) => a.Description.localeCompare(b.Description),
      priority: 1
    },
    {
      title: 'Type',
      compare: (a: Equipement, b: Equipement) => a.Type.localeCompare(b.Type),
      priority: 1
    },
  ];
  equipements:Equipement[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadEquipements();
  }

  loadEquipements(): void {
    this.userService.getEquipements()
      .subscribe((data: Equipement[]) => {
        this.equipements = data;
        console.log("réponse de la requette get_categories_equipement",this.equipements);
      });
      console.log("envoi de la requette get_categories_equipement",this.equipements);
      
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
  deleteEquipement(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteEquipement(id).subscribe(
        () => {
          //console.log('Equipement supprimé avec succès');
          this.message.success( 'Equipement supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadEquipements();
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
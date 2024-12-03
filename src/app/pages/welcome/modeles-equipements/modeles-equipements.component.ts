import { Component } from '@angular/core';
import { ModeleEquipement } from '../../../Models/ModeleEquipement';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-modeles-equipements',
  templateUrl: './modeles-equipements.component.html',
  styleUrl: './modeles-equipements.component.css'
})
export class ModelesEquipementsComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: ModeleEquipement, b: ModeleEquipement) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: ModeleEquipement, b: ModeleEquipement) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Description',
      compare: (a: ModeleEquipement, b: ModeleEquipement) => a.Description.localeCompare(b.Description),
      priority: 1
    },
    {
      title: 'Prix',
      compare: (a: ModeleEquipement, b: ModeleEquipement) => (a.Prix?? 0)-(b.Prix??0),
      priority: 1
    }
  ];
  modeles:ModeleEquipement[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadModeleEquipements();
  }

  loadModeleEquipements(): void {
    this.userService.getModelesEquipement()
      .subscribe((data: ModeleEquipement[]) => {
        this.modeles = data;
        console.log("réponse de la requette get_categories_piece",this.modeles);
      });
      console.log("envoi de la requette get_categories_piece",this.modeles);
      
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
  deleteModeleEquipement(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteModeleEquipement(id).subscribe(
        () => {
          //console.log('ModeleEquipement supprimé avec succès');
          this.message.success( 'ModeleEquipement supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadModeleEquipements();
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
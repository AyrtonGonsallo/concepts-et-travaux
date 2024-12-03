import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { Travail } from '../../../Models/Travail';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { presetColors } from 'ng-zorro-antd/core/color';

@Component({
  selector: 'app-travaux',
  templateUrl: './travaux.component.html',
  styleUrl: './travaux.component.css'
})
export class TravauxComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Travail, b: Travail) => a.ID - b.ID,
      priority: 3
    },
    {
      title: 'Titre',
      compare: (a: Travail, b: Travail) => a.Titre.localeCompare(b.Titre),
      priority: 1
    },
    
  ];
  travaux:Travail[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadTravaux();
  }

  loadTravaux(): void {
    this.userService.getTravaux()
      .subscribe((data: Travail[]) => {
        this.travaux = data;
        console.log("réponse de la requette get_travail",this.travaux);
      });
      
      
  }

  public tagColors = presetColors;
  isAdminOrHim(id:number){

    return this.authService.isAdminOrHim(id)
  }
  isHimOrAdminAndOtherNotAdmin(id:number,rid:number| undefined){
    return this.authService.isHimOrAdminAndOtherNotAdmin(id,rid?rid:0)
  }
  cancel(): void {
    this.message.info('suppression annulée');
  }
  deletetravail(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deleteTravail(id).subscribe(
        () => {
          //console.log('Travail supprimé avec succès');
          this.message.success( 'Travail supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadTravaux();
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

  get_label(slug: any): string {
    // Convert the value to a boolean if it is a string
    const booleanSlug = (slug === 'true' || slug === true) ? true : false;
  
    return booleanSlug ? 'oui' : 'non';
  }
}
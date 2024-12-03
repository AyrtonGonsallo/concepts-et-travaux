import { Component } from '@angular/core';
import { Pointcle } from '../../../Models/PointCle';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';

@Component({
  selector: 'app-points-cles',
  templateUrl: './points-cles.component.html',
  styleUrl: './points-cles.component.css'
})
export class PointsClesComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Pointcle, b: Pointcle) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: Pointcle, b: Pointcle) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Description',
      compare: (a: Pointcle, b: Pointcle) => a.Description.localeCompare(b.Description),
      priority: 1
    }
  ];
  categories_de_pieces:Pointcle[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadPointcles();
  }

  loadPointcles(): void {
    this.userService.getPointscles()
      .subscribe((data: Pointcle[]) => {
        this.categories_de_pieces = data;
        console.log("réponse de la requette points_cles",this.categories_de_pieces);
      });
      console.log("envoi de la requette points_cles",this.categories_de_pieces);
      
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
  deletePoint(id: number) {
    if (this.authService.isAdminorSuperAdmin()) {
      this.userService.deletePointcle(id).subscribe(
        () => {
          //console.log('Pointcle supprimé avec succès');
          this.message.success( 'Pointcle supprimée avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadPointcles();
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
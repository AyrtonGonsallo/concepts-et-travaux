import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { CategoriePiece } from '../../../Models/Categorie-Piece';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-categorie-piece',
  templateUrl: './categorie-piece.component.html',
  styleUrl: './categorie-piece.component.css'
})
export class CategoriePieceComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: CategoriePiece, b: CategoriePiece) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: CategoriePiece, b: CategoriePiece) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Description',
      compare: (a: CategoriePiece, b: CategoriePiece) => a.Description.localeCompare(b.Description),
      priority: 1
    }
  ];
  categories_de_pieces:CategoriePiece[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadCategoriePieces();
  }

  loadCategoriePieces(): void {
    this.userService.getCategoriesPiece()
      .subscribe((data: CategoriePiece[]) => {
        this.categories_de_pieces = data;
        console.log("réponse de la requette get_categories_piece",this.categories_de_pieces);
      });
      console.log("envoi de la requette get_categories_piece",this.categories_de_pieces);
      
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
  deleteUser(userId: number,roleId: number | undefined) {
    if (this.authService.isHimOrAdminAndOtherNotAdmin( userId,roleId?roleId:0)) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          //console.log('CategoriePiece supprimé avec succès');
          this.message.success( 'CategoriePiece supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadCategoriePieces();
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
import { Component } from '@angular/core';
import { Piece } from '../../../Models/Piece';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../Services/api-concepts-et-travaux.service';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.css'
})
export class PieceComponent {
  size: NzButtonSize = 'large';
  listOfColumn = [
    {
      title: 'Id',
      compare: (a: Piece, b: Piece) => a.ID - b.ID,
      priority: 3
    },
   
    {
      title: 'Titre',
      compare: (a: Piece, b: Piece) => a.Titre.localeCompare(b.Titre),
      priority: 2
    },
    {
      title: 'Presentation',
      compare: (a: Piece, b: Piece) => a.Présentation.localeCompare(b.Présentation),
      priority: 1
    },
  ];
  pieces:Piece[] = [];

  constructor(private http: HttpClient,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) { }

  ngOnInit(): void {
    this.loadPieces();
  }

  loadPieces(): void {
    this.userService.getPieces()
      .subscribe((data: Piece[]) => {
        this.pieces = data;
        console.log("réponse de la requette get_categories_piece",this.pieces);
      });
      console.log("envoi de la requette get_categories_piece",this.pieces);
      
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
          //console.log('Piece supprimé avec succès');
          this.message.success( 'Piece supprimé avec succès');
          // Mettez ici le code pour actualiser la liste des besoins si nécessaire
          this.loadPieces();
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
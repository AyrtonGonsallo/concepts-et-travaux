import { Injectable } from '@angular/core';
import { ApiConceptsEtTravauxService } from './api-concepts-et-travaux.service';
import { DevisPiece } from '../Models/DevisPiece';

@Injectable({
  providedIn: 'root'
})
export class CalculDevisService {

  constructor(private userService: ApiConceptsEtTravauxService, ) {
    
  }
  devispiece:any



  calculer_prix(devispiece: DevisPiece, index: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.get_prix_devis_piece(devispiece.ID).subscribe(
        (response) => {
          resolve(response); // Renvoie la réponse quand elle est prête
        },
        (error) => {
          console.error('Erreur lors de la récupération des get_prix_devis_piece :', error);
          reject(error); // En cas d'erreur, rejette la promesse
        }
      );
    });
  }
  


}

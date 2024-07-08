// piece.model.ts


import { Piece } from "./Piece";

export interface Equipement {
    ID: number; // Le point d'interrogation indique que la propriété est facultative
    Image: string;
    Titre: string;
    Description: string;
    PieceID?: number; // Le point d'interrogation indique que la propriété est facultative
    Piece?: Piece; // Propriété pour stocker l'objet Galerie lié
  }
  
  
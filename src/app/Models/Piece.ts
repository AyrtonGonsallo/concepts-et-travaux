// piece.model.ts

import { CategoriePiece } from "./Categorie-Piece";
import { Galerie } from "./Galerie";

export interface Piece {
    ID: number; // Le point d'interrogation indique que la propriété est facultative
    Image_principale: string;
    Image_presentation: string;
    Titre: string;
    Présentation: string;
    Description: string;
    CategoriePieces: CategoriePiece[];
    GalerieID?: number; // Le point d'interrogation indique que la propriété est facultative
    Galerie?: Galerie; // Propriété pour stocker l'objet Galerie lié
  }
  
  
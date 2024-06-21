// realisation.model.ts

import { Galerie } from './Galerie'; // Importez si nécessaire l'interface Galerie
import { Piece } from './Piece'; // Importez si nécessaire l'interface Piece

export interface Realisation {
  ID: number; // Le point d'interrogation indique que la propriété est facultative
  Titre: string;
  SousTitre: string;
  Superficie: number;
  Prix: number;
  Image_principale: string;
  Description: string;
  Duree: number;
  Top: boolean;
  GalerieID?: number; // Le point d'interrogation indique que la propriété est facultative
  PieceID: number;
  
}

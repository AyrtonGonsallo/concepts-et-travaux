// piece.model.ts


import { ModeleEquipement } from "./ModeleEquipement";
import { Piece } from "./Piece";

export interface Equipement {
    ID: number; // Le point d'interrogation indique que la propriété est facultative
    Image: string;
    Titre: string;
    Description: string;
    AfficherLongueur?: boolean;
    Type: string;
    AfficherLargeur?: boolean;
    AfficherVasque?: boolean;
    AfficherEncastreeApparente?: boolean;
    PieceID?: number; // Le point d'interrogation indique que la propriété est facultative
    Piece?: Piece; // Propriété pour stocker l'objet Galerie lié
    ModeleEquipements: ModeleEquipement[]
  }
  
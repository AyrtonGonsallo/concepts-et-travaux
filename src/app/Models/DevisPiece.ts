import { DevisTache } from "./DevisTache";

export interface DevisPiece {
    ID: number;
    Username: string;
    AdresseIP: string;
    Date: Date;
    Commentaire?: string;
    PieceID: number;
    Prix?: number ;
    UtilisateurID?: number;
    DevisTaches:DevisTache[];
  }
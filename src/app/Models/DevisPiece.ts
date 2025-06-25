import { DevisTache } from "./DevisTache";
import { Visite } from "./Visite";
import {Utilisateur} from "./Utilisateurs";

export interface DevisPiece {
    ID: number;
    Username: string;
    AdresseIP: string;
    Date: Date;
    Commentaire?: string;
    PieceID: number;
    Prix?: number ;
    UtilisateurID?: number;
    Utilisateur:Utilisateur;
    DevisTaches:DevisTache[];
    
  }
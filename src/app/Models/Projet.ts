import { DevisPiece } from "./DevisPiece";
import { Utilisateur } from "./Utilisateurs";
import { Visite } from "./Visite";

export interface Projet {
    Id: number;
    Nom: string;
    Date_de_creation: string; // Si la date est stockée sous forme de chaîne de caractères (format ISO 8601)
    Status: 'visite à régler' | 'visite programmée' | 'projet validé' | 'acompte payé' | 'travaux démarrés' | 'travaux en cours' | 'travaux achevés' | 'travaux livrés';
    Description: string;
    User_id: number;
    Valider:boolean;
    Utilisateur?:Utilisateur;
    Devis?:DevisPiece[]
    Visite?: Visite;
    VisiteFaite: boolean ;
    VisiteID?: number;
    Payed: boolean ;
  }
  
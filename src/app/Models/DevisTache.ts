// devis-tache.model.ts

import { Travail } from "./Travail";

export interface DevisTache {
    ID: number;
    TravailID: number;
    Travail:Travail;
    DevisPieceID: number;
    TravailSlug: string;
    Commentaires?: string;
    Prix:number;
    Donnees: any; // Utilisez un type spécifique pour Donnees selon la structure de votre JSON
  }
  
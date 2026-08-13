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
    PrixCoutant?:number;
    PrixDebourseHT?:number;
    PrixDeVenteHT?:number;
    PrixDeVenteRemiseHT?:number;
    PrixDeVenteRemiseTTC?:number;
    Donnees: any; // Utilisez un type spécifique pour Donnees selon la structure de votre JSON
  }
  
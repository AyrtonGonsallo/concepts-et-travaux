import { Travail } from "./Travail";

export interface EtapeDevis {
    ID: number;
    Titre: string;
    Sous_titre?: string;
    Travail:Travail
    Description?: string;
    Description_chambre?: string;
    Description_sdb?: string;
    Description_salle_manger?: string;
    Description_wc?: string;
    Description_cuisine?: string;
    Description_salon?: string;
    Etape: string;
  }
  
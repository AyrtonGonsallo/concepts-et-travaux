export interface Gamme {
    ID: number;
    Type: string;
    Label: string;
    PrixPose: number;
    PrixFournisseur: number;
    Prix: number;
    Image?: string; // Optional field
    Pdf?: string; // Optional field
    Etape: string;
    TravailID: number;
    ActiverPrixMultiples: boolean;
    ActiverFournisseur: boolean;
    FournisseurID: number
  }
  
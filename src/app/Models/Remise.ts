

export interface Remise {
    ID: number; // Le point d'interrogation indique que la propriété est facultative
    Titre: string;
    Type: string;
    Pourcentage: number;
    Valeur: number;
    Commentaire?: string;
    DevisID?: number; // Le point d'interrogation indique que la propriété est facultative
  }
  

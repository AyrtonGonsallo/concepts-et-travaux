

export interface Paiement {
    ID: number; // Le point d'interrogation indique que la propriété est facultative
    TypeDePaiement: string;
    Type: string;
    Montant: number;
    Date: string;
    DevisID?: number; // Le point d'interrogation indique que la propriété est facultative
  }
  

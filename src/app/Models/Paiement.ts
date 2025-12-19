

export interface Paiement {
    ID: number; // Le point d'interrogation indique que la propriété est facultative
    Requette: string;
    TypeDePaiement: string;
    Type: string;
    Titre?: string;
    Commentaire?: string;
    Montant: number;
    Date: string;
    Status:Boolean;
    ProjetID?: number; // Le point d'interrogation indique que la propriété est facultative
  }
  

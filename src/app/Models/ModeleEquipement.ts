export interface ModeleEquipement {
    ID: number; // L'ID peut être optionnel si c'est auto-incrémenté dans la base de données
    Titre: string;
    Description: string;
    Image?: string ;
    Prix?: number ;
    Longeur?: number ;
    Largeur?: number ;
    Hauteur?: number ;
    Epaisseur?: number ;
    Matiere?: string ;
    EquipementID: number; // Assurez-vous de correspondre au type utilisé dans Equipement
    ActiverFournisseur:boolean;
  }
  
import { Autorisation } from "./Autorisations";

export interface Role {
    Id: number;
    Titre: string;
    Commentaire: string;
    Autorisations: Autorisation[]; // Tableau d'autorisations
  }
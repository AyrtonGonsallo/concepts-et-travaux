import { Projet } from "./Projet";

export interface Fichier {
  ID: number;
  Nom: string;
  Url: string;
  DateDeCreation: Date;
  Type: string;
  DevisID?: number; // Peut être null donc marqué comme optionnel
  Projet:Projet;
}

import { Utilisateur } from "./Utilisateurs";

export interface Projet {
    Id: number;
    Nom: string;
    Date_de_creation: string; // Si la date est stockée sous forme de chaîne de caractères (format ISO 8601)
    Status: 'devis en cours' | 'devis à finaliser' | 'devis à valider' | 'travaux à démarrer' | 'travaux en cours' | 'travaux achevés' | 'chantier réceptionné';
    Description: string;
    User_id: number;
    Utilisateur?:Utilisateur;
  }
  
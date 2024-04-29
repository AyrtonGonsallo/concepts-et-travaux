import { Role } from "./Roles";

export interface Utilisateur {
    Id: number;
    DateDeCreation?: Date;
    RaisonSociale?: string;
    NumeroSIRET?: string;
    Nom: string;
    Prenom: string;
    Email: string;
    Password: string;
    Telephone: string;
    AdressePostale: string;
    Activite?: string;
    CA?: number;
    Effectif?: number;
    References?: string;
    QuestionnaireTarif?: string;
    AssuranceRCDecennale?: string;
    KBis?: string;
    RoleId: number;
    Role?: Role; // Ajout de la référence au modèle Role
  }
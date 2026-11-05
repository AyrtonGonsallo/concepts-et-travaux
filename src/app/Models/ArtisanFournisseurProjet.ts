import { DevisTache } from "./DevisTache";
import {Utilisateur} from "./Utilisateurs";
import { Projet } from "./Projet";

export interface ArtisanFournisseurProjet {
    Id: number;
    UtilisateurID: number;
    ProjetID: number;
    DevistacheID: number;
    Montant: number ;
    NatureDesTravaux: string;
    AvisClients?: number ;
    RespectDesDelais?: number ;
    RespectDuPrix?: number ;
    QualiteDesTravaux?: number ;
    TenueDuChantier?: number ;
    Utilisateur:Utilisateur;
    DevisTache:DevisTache;
    Projet?:Projet;
    
  }
import { Piece } from "./Piece";

export interface Travail {
    ID: number;
    Titre: string;
    Description: string;
    Valide:boolean;
    Pieces: Piece[]
  }
  
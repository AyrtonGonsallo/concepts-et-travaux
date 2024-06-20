import { CategorieQuestion } from "./Categorie-Question";

export interface Question {
    ID: number;
    Titre: string;
    Question: string;
    Reponse: string;
    CategorieQuestionFaqs: CategorieQuestion[]
  }
  
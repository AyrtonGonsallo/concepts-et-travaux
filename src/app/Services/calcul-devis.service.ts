import { Injectable } from '@angular/core';
import { ApiConceptsEtTravauxService } from './api-concepts-et-travaux.service';
import { DevisPiece } from '../Models/DevisPiece';
import { DevisTache } from '../Models/DevisTache';

@Injectable({
  providedIn: 'root'
})
export class CalculDevisService {

  constructor(private devisService: ApiConceptsEtTravauxService, ) {
  }
  devispiece:any



  calculer_prix(devispiece:DevisPiece,index:number){
    let tache=devispiece.DevisTaches[index]
    let tacheid=tache.TravailID
    let titre=tache.TravailSlug
    let donnees_json=JSON.parse(tache.Donnees) 
    console.log("calcul du prix de la tache ",titre," d'id ",tacheid)
    tache.Prix=0.0
    let prix=0
    if(tacheid==5){
      prix=this.get_prix_tache_5(donnees_json)
    }
    else if(tacheid==10){
      prix=this.get_prix_tache_10(donnees_json)
    }
    else if(tacheid==12){
      prix=this.get_prix_tache_12(donnees_json)
    }
    tache.Prix=prix
    return prix
  }


get_prix_tache_5(donnees_json:any){
  let prix=0
  const murs: {
    hauteur: number;
    surface: number;
    longueur: number;
    etat: string;
    carrelage: string;
    papier: string;
    enduit: string;
    peinture: string;
    image: any; // Vous pouvez spécifier le type de 'image' selon vos besoins
  }[] = donnees_json.murs;

  // Parcourir chaque mur
  murs.forEach(mur => {
    if(mur.papier){
      prix+=mur.surface*this.getTarif(mur.papier.length)
    }
    if(mur.peinture){
      prix+=mur.surface*this.getTarif(mur.peinture.length)
    }
    if(mur.enduit){
      prix+=mur.surface*this.getTarif(mur.enduit.length)
    }
    if(mur.carrelage){
      prix+=mur.surface*this.getTarif(mur.carrelage.length)
    }
  });
  return prix
}
  getTarif(id:number){
    return id
  }
  get_prix_tache_10(donnees_json:any){
    let prix=0
    const portes: {
      type1: string;
      type2: string;
      type3: string;
      finition: string;
    }[] = donnees_json.portes;
  
    // Parcourir chaque mur
    portes.forEach(porte => {
      if(porte.type1){
        prix+=this.getTarif(porte.type1.length)
      }
      if(porte.type2){
        prix+=this.getTarif(porte.type2.length)
      }
      if(porte.type3){
        prix+=this.getTarif(porte.type3.length)
      }
      if(porte.finition){
        prix+=this.getTarif(porte.finition.length)
      }
    });
    return prix
  }

  get_prix_tache_12(donnees_json:any){
    let prix=0
    prix+=donnees_json.creation_de_canalisations*this.getTarif("creation_de_canalisations".length)
    prix+=donnees_json.pose_de_radiateur_existant*this.getTarif("pose_de_radiateur_existant".length)
    
    return prix
  }
}

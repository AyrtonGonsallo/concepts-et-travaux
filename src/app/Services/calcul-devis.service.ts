import { Injectable } from '@angular/core';
import { ApiConceptsEtTravauxService } from './api-concepts-et-travaux.service';
import { DevisPiece } from '../Models/DevisPiece';

@Injectable({
  providedIn: 'root'
})
export class CalculDevisService {

  constructor(private userService: ApiConceptsEtTravauxService, ) {
    this.userService.getTacheGeneraleById(2).subscribe((data) => {
      this.tache_retirer_carrelage = data;
    });
    this.userService.getTacheGeneraleById(4).subscribe((data) => {
      this.tache_retirer_papier = data;
    });
    this.userService.getTacheGeneraleById(1).subscribe((data) => {
      this.tache_retirer_peinture = data;
    });
    this.userService.getTacheGeneraleById(3).subscribe((data) => {
      this.tache_retirer_enduit = data;
    });
    this.userService.getTacheGeneraleById(6).subscribe((data) => {
      this.tache_retirer_lambris = data;
    });
    this.userService.getTacheGeneraleById(5).subscribe((data) => {
      this.tache_retirer_tissus = data;
    });
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
    else if(tacheid==9){
      prix=this.get_prix_tache_9(donnees_json)
    }
    else if(tacheid==8){
      prix=this.get_prix_tache_8(donnees_json)
    }
    else if(tacheid==14){
      prix=this.get_prix_tache_14(donnees_json)
    }
    tache.Prix=prix
    return prix
  }


get_prix_tache_5(donnees_json:any){
  let prix=0
  let dimensions = donnees_json["dimensions-pose-murs"].murs;
  let gammes = donnees_json["gammes-produits-pose-murs"].murs;
  let etat_surfaces = donnees_json["etat-surfaces-pose-murs"].murs;
  let total=dimensions.length
  for(let i=0;i<total;i++){
    prix+=dimensions[i].surface*gammes[i].peinture
    prix+=dimensions[i].surface*gammes[i].carrelage
    prix+=dimensions[i].surface*gammes[i].papier
    prix+=dimensions[i].surface*gammes[i].enduit
  }
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
  get_prix_tache_8(donnees_json:any){
    let prix=0
    let surface=donnees_json["dimensions-pose-plafond"].surface
    let prix_carrelage=donnees_json["gammes-produits-pose-plafond"].carrelage;
    let prix_papier=donnees_json["gammes-produits-pose-plafond"].papier;
    let prix_enduit=donnees_json["gammes-produits-pose-plafond"].enduit;
    let prix_peinture=donnees_json["gammes-produits-pose-plafond"].peinture;
    prix+=prix_carrelage*surface
    prix+=prix_papier*surface
    prix+=prix_enduit*surface
    prix+=prix_peinture*surface
      
    return prix
  }
  get_prix_tache_9(donnees_json:any){
    let prix=0
    let surface=donnees_json["dimensions-pose-sol"].surface
    let prix_plinthes=donnees_json["gammes-produits-pose-sol"].plinthes;
    let has_pvc=(donnees_json["gammes-produits-pose-sol"].sol_pvc)?1:0;
    let has_moquette=(donnees_json["gammes-produits-pose-sol"].moquette)?1:0;
    let prix_pvc=donnees_json["gammes-produits-pose-sol"].sol_pvc_prix;
    let prix_moquette=donnees_json["gammes-produits-pose-sol"].moquette_prix;
    let prix_carrelage=donnees_json["gammes-produits-pose-sol"].carrelage;
    let prix_parquet_massif=donnees_json["gammes-produits-pose-sol"].parquet_massif;
    let prix_paquet_flottant_finition_bois=donnees_json["gammes-produits-pose-sol"].paquet_flottant_finition_bois;
    let prix_parquet_flottant_finition_stratifiee=donnees_json["gammes-produits-pose-sol"].parquet_flottant_finition_stratifiee;
    prix+=prix_plinthes*surface
    prix+=prix_carrelage*surface
    prix+=prix_parquet_massif*surface
    prix+=has_moquette*prix_moquette
    prix+=has_pvc*prix_pvc
    prix+=prix_paquet_flottant_finition_bois*surface
    prix+=prix_parquet_flottant_finition_stratifiee*surface
      
    return prix
  }
  tache_retirer_carrelage:any
  tache_retirer_papier:any
  tache_retirer_enduit:any
  tache_retirer_lambris:any
  tache_retirer_peinture:any
  tache_retirer_tissus:any
  get_prix_tache_14(donnees_json:any){
    
    let prix=0

    let dimensions = donnees_json["dimensions-depose-murs"].murs;
    let gammes = donnees_json["gammes-produits-depose-murs"].murs;
    let etat_surfaces = donnees_json["etat-surfaces-depose-murs"].murs;
    let total=dimensions.length
    for(let i=0;i<total;i++){
      let surface=dimensions[i].surface
      let has_carrelage=(gammes[i].carrelage)?1:0;
      let has_papier=(gammes[i].papier)?1:0;
      let has_enduit=(gammes[i].enduit)?1:0;
      let has_peinture=(gammes[i].peinture)?1:0;
      let has_lambris=(gammes[i].lambris)?1:0;
      let has_tissus=(gammes[i].tissus)?1:0;

      prix+=has_carrelage*surface*this.tache_retirer_carrelage.Prix
      prix+=has_papier*surface*this.tache_retirer_papier.Prix
      prix+=has_peinture*surface*this.tache_retirer_peinture.Prix
      prix+=has_enduit*surface*this.tache_retirer_enduit.Prix
      prix+=has_lambris*surface*this.tache_retirer_lambris.Prix
      prix+=has_tissus*surface*this.tache_retirer_tissus.Prix
    }
      
    return prix
  }
}

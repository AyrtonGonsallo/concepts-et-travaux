import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';

@Component({
  selector: 'app-pose-de-revetement-sur-plafond-calcul',
  templateUrl: './pose-de-revetement-sur-plafond-calcul.component.html',
  styleUrl: './pose-de-revetement-sur-plafond-calcul.component.css'
})
export class PoseDeRevetementSurPlafondCalculComponent {
tacheId:string =  this.route.snapshot.paramMap.get('id')??'0';
  element:any
  donnees:any
  formulaire!: FormGroup;
  devisTache!:DevisTache;
  detailsCalcul:any
  edit_mode=false

   constructor(private calculDevisService:CalculDevisService,private fb: NonNullableFormBuilder,private route: ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    }

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const mode = params['mode'];
        if (mode === 'modification') {
          // Mode modification activé
          console.log('On est en mode modification');
          this.edit_mode=true
        } else {
          // Mode création/test
          console.log('On est en mode test');
        }
      });
      this.route.params.subscribe(params => {
        this.tacheId = params['id'] ?? '0';
        console.log('Tache ID récupéré:', this.tacheId);
      });
      this.getDetails(parseInt(this.tacheId, 10))
      this.load_gammes_depose()
      this.load_gammes_pose()
      this.load_types()
    }
  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          
            // Dimensions du plafond
            longueur: this.donnees["dimensions-pose-plafond"].longueur,
            hauteur: this.donnees["dimensions-pose-plafond"].hauteur,
            largeur: this.donnees["dimensions-pose-plafond"].largeur,
            depose: this.donnees["dimensions-pose-plafond"].depose,
        
            // État de la surface
            etat: this.donnees["etat-surfaces-pose-plafond"].etat,
        
            // Gammes produits
            gamme: this.donnees["gammes-produits-pose-plafond"].gamme,
            autre_gamme: this.donnees["gammes-produits-pose-plafond"].autre_gamme,
           
          
        });
        
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }

  
  gammes_depose:any
  load_gammes_depose(){
    this.userService.getGammesByTravailAndType(8,"service-depose-revetement-plafond").subscribe(
      (response: any) => {
        console.log('recuperation des gammes gammes_depose:', response);
        this.gammes_depose=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes gammes_depose :', error);
      }
    );
  }

  
  
gammes_peinture:any
gammes_enduit:any
gammes_papier:any
gammes_carrelage:any
load_gammes_pose(){
  this.userService.getGammesByTravailAndType(8,"peinture-plafond").subscribe(
    (response: any) => {
      console.log('recuperation des gammes peinture-plafond:', response);
      this.gammes_peinture=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes peinture-plafond :', error);
    }
  );
 
  this.userService.getGammesByTravailAndType(8,"	enduit-decoratif-plafond").subscribe(
    (response: any) => {
      console.log('recuperation des gammes 	enduit-decoratif-plafond:', response);
      this.gammes_enduit=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes 	enduit-decoratif-plafond :', error);
    }
  );
  this.userService.getGammesByTravailAndType(8,"papier-peint-plafond").subscribe(
    (response: any) => {
      console.log('recuperation des gammes papier-peint-plafond:', response);
      this.gammes_papier=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes papier-peint-plafond :', error);
    }
  );
  this.userService.getGammesByTravailAndType(8,"carrelage-plafond").subscribe(
    (response: any) => {
      console.log('recuperation des gammes carrelage-plafond:', response);
      this.gammes_carrelage=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes carrelage-plafond :', error);
    }
  );
}



submit(){
  console.log(this.formulaire.value)
  this.devisTache.Donnees = {
    "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "dimensions-pose-plafond": {
      longueur: this.formulaire.value.longueur,
      largeur: this.formulaire.value.largeur,
      depose: this.formulaire.value.depose
    },
    "etat-surfaces-pose-plafond": {
      etat: this.formulaire.value.etat
    },
    "gammes-produits-pose-plafond": {
      gamme: this.formulaire.value.gamme,
      autre_gamme: this.formulaire.value.autre_gamme,
      lineaire: this.formulaire.value.lineaire,
      plinthes: this.formulaire.value.plinthes,
      has_plinthes: this.formulaire.value.has_plinthes
    }
  };
  console.log("donnees", this.devisTache)
  this.calculDevisService.calculer_prix_tache(this.devisTache).then((result) => {
    this.detailsCalcul = result
    let formule = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule;

    // Si formule existe, on remplace les \n par des <br>
    if (formule) {
      formule = formule.replace(/\n/g, '<br>');

      // On réinjecte la formule modifiée dans l'objet
      this.detailsCalcul.resultats[this.element.TravailSlug] = {
        ...this.detailsCalcul.resultats[this.element.TravailSlug],
        formule: formule
      };
    }
    console.log("Prix reçu :", this.detailsCalcul);
    
  }).catch((error) => {
    console.error("Erreur lors du calcul :", error);
  });
}

etat_des_surfaces:any
load_types(){
  this.userService.getGammesByTravailAndTypeOrdered(8,"etat-des-surfaces-plafond").subscribe(
    (response: any) => {
      console.log('recuperation des etat-des-surfaces-murs	:', response);
      this.etat_des_surfaces=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des etat-des-surfaces-murs	 :', error);
    }
  );
}



modifier(){
  this.devisTache.Donnees = {
     "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "dimensions-pose-plafond": {
      longueur: this.formulaire.value.longueur,
      largeur: this.formulaire.value.largeur,
      depose: this.formulaire.value.depose
    },
    "etat-surfaces-pose-plafond": {
      etat: this.formulaire.value.etat
    },
    "gammes-produits-pose-plafond": {
      gamme: this.formulaire.value.gamme,
      autre_gamme: this.formulaire.value.autre_gamme,
      lineaire: this.formulaire.value.lineaire,
      plinthes: this.formulaire.value.plinthes,
      has_plinthes: this.formulaire.value.has_plinthes
    }
  };

  console.log("Données avant modification", this.devisTache);

  this.calculDevisService.calculer_prix_tache(this.devisTache).then((result) => {
    this.detailsCalcul = result;
    let formule = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule;
    if (formule) {
      formule = formule.replace(/\n/g, '<br>');
      this.detailsCalcul.resultats[this.element.TravailSlug] = {
        ...this.detailsCalcul.resultats[this.element.TravailSlug],
        formule: formule
      };
    }
    const prixCalcule = (this.detailsCalcul?.resultats?.[this.element.TravailSlug]?.prix/1.25);
    console.log("Prix calculé", this.element.TravailSlug, prixCalcule);

    if (prixCalcule !== undefined) {
      this.devisTache.Prix = prixCalcule;
    }

    console.log("Données après modification", this.devisTache);

    this.userService.updateDevistache(parseInt(this.tacheId),this.devisTache).subscribe(
      (response) => {
        console.log('Tache modifiée avec succès :', response);
        this.message.create('success', `Tache modifiée avec succès`);
        setTimeout(() => {
          this.router.navigate(['/administration/devis-pieces', 'modifier-devis-piece', this.devisTache.DevisPieceID]);
        }, 2000);
      },
      (error) => {
        console.error('Erreur lors de la modification de la tache :', error);
      }
    );
  }).catch(error => {
    console.error('Erreur lors du calcul du prix:', error);
  });
}

}


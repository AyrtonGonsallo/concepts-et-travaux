import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';


@Component({
  selector: 'app-renovation-electrique-complete-calcul',
  templateUrl: './renovation-electrique-complete-calcul.component.html',
  styleUrl: './renovation-electrique-complete-calcul.component.css'
})
export class RenovationElectriqueCompleteCalculComponent {
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
    }
  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          chauffage_exist: [this.donnees["gammes-produits-renovation-electrique"].chauffage_exist || false],
          mise_en_securite: [this.donnees["gammes-produits-renovation-electrique"].mise_en_securite || false],
          renovation_conforme: [this.donnees["gammes-produits-renovation-electrique"].renovation_conforme || false],
          quantite_chauffage: [this.donnees["gammes-produits-renovation-electrique"].quantite_chauffage || 0],
          surface: [this.donnees["gammes-produits-renovation-electrique"].surface || 0]
        });
        
        
        
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }

 


submit() {
  console.log(this.formulaire.value);

  const chauffage_exist = this.formulaire.value.chauffage_exist;
  const mise_en_securite = this.formulaire.value.mise_en_securite;
  const renovation_conforme = this.formulaire.value.renovation_conforme;
  const surface = this.formulaire.value.surface;
  const quantite_chauffage = this.formulaire.value.quantite_chauffage;



  this.devisTache.Donnees = {
    "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "gammes-produits-renovation-electrique": {
        chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
        surface: surface
    },
    "etat-surfaces-renovation-electrique": {
      chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
        surface: surface
    },
    "dimensions-renovation-electrique": {
      chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
        surface: surface
    }
  };

  console.log("donnees", this.devisTache);

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

    console.log("Prix reçu :", this.detailsCalcul);

  }).catch((error) => {
    console.error("Erreur lors du calcul :", error);
  });
}



  
modifier(){
  
  const chauffage_exist = this.formulaire.value.chauffage_exist;
  const mise_en_securite = this.formulaire.value.mise_en_securite;
  const renovation_conforme = this.formulaire.value.renovation_conforme;
  const surface = this.formulaire.value.surface;
  const quantite_chauffage = this.formulaire.value.quantite_chauffage;



  this.devisTache.Donnees = {
     "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "gammes-produits-renovation-electrique": {
        chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
        surface: surface
    },
    "etat-surfaces-renovation-electrique": {
      chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
        surface: surface
    },
    "dimensions-renovation-electrique": {
      chauffage_exist: chauffage_exist,
        mise_en_securite: mise_en_securite,
        renovation_conforme: renovation_conforme,
        quantite_chauffage: quantite_chauffage,
        surface: surface
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
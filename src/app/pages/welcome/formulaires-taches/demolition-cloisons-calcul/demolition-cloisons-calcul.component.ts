import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';

@Component({
  selector: 'app-demolition-cloisons-calcul',
  templateUrl: './demolition-cloisons-calcul.component.html',
  styleUrl: './demolition-cloisons-calcul.component.css'
})
export class DemolitionCloisonsCalculComponent {
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
      this.load_gammes()
    }
  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          mursNonporteurs: this.fb.array(
            this.donnees["gammes-produits-murs-non-porteurs"].mursNonporteurs.map((mur: any) => {
              return this.fb.group({
                longueur: [mur.longueur],
                hauteur: [mur.hauteur],
                epaisseur: [mur.epaisseur],
                ndp: [mur.ndp],
                cloison: [mur.cloison],
              });
            })
          ),
          ouverturePartielle: this.fb.array(
            this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle.map((ouverture: any) => {
              return this.fb.group({
                longueur: [ouverture.longueur],
                hauteur: [ouverture.hauteur],
                epaisseur: [ouverture.epaisseur],
                longueur_ouverture: [ouverture.longueur_ouverture],
                hauteur_ouverture: [ouverture.hauteur_ouverture],
                hauteur_depuis_le_sol: [ouverture.hauteur_depuis_le_sol],
                hauteur_depuis_le_plafond: [ouverture.hauteur_depuis_le_plafond],
                cloison: [ouverture.cloison],
                image: [ouverture.image]
              });
            })
          ),
          tp1: [this.donnees["gammes-produits-murs-non-porteurs"].tp1 || false],
          tp3: [this.donnees["gammes-produits-murs-non-porteurs"].tp3 || false]
        });
        
        
        
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }

  
  get ouverturePartielle() {
    return this.formulaire.get('ouverturePartielle') as FormArray;
  }
  get mursNonporteurs() {
    return this.formulaire.get('mursNonporteurs') as FormArray;
  }

  gammes_cloison:any
  load_gammes(){
    this.userService.getGammesByTravailAndType(3,"cloison").subscribe(
      (response: any) => {
        console.log('recuperation des gammes cloison:', response);
        this.gammes_cloison=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes cloison :', error);
      }
    );
  }


submit(){
  console.log(this.formulaire.value);

  const mursNonporteurs = this.formulaire.value.mursNonporteurs;
  const ouverturePartielle = this.formulaire.value.ouverturePartielle;
  const tp1 = this.formulaire.value.tp1;
  const tp3 = this.formulaire.value.tp3;

  this.devisTache.Donnees = {
    "gammes-produits-murs-non-porteurs": {
      mursNonporteurs: mursNonporteurs,
      ouverturePartielle: ouverturePartielle,
      tp1: tp1,
      tp3: tp3
    }
  };

  console.log("donnees", this.devisTache);

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



modifier(){
  
  const mursNonporteurs = this.formulaire.value.mursNonporteurs;
  const ouverturePartielle = this.formulaire.value.ouverturePartielle;
  const tp1 = this.formulaire.value.tp1;
  const tp3 = this.formulaire.value.tp3;

  this.devisTache.Donnees = {
    "gammes-produits-murs-non-porteurs": {
      mursNonporteurs: mursNonporteurs,
      ouverturePartielle: ouverturePartielle,
      tp1: tp1,
      tp3: tp3
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

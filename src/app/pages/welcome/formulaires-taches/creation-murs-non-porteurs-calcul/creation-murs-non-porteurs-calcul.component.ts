import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';

@Component({
  selector: 'app-creation-murs-non-porteurs-calcul',
  templateUrl: './creation-murs-non-porteurs-calcul.component.html',
  styleUrl: './creation-murs-non-porteurs-calcul.component.css'
})
export class CreationMursNonPorteursCalculComponent {
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
          murs_non_porteurs: this.fb.array(
            this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].murs_non_porteurs.map((mur: any) => {
              return this.fb.group({
                longueur: [mur.longueur],
                hauteur: [mur.hauteur],
                epaisseur: [mur.epaisseur],
              });
            })
          ),
          portes: this.fb.array(
            this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].portes.map((porte: any) => {
              return this.fb.group({
                largeur: [porte.largeur],
                gamme: [porte.gamme],
                epaisseur: [porte.epaisseur],
              });
            })
          ),
          has_portes: [this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].has_portes || false]
        });
        
        
        
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }

  
  get murs_non_porteurs() {
    return this.formulaire.get('murs_non_porteurs') as FormArray;
  }
  get portes() {
    return this.formulaire.get('portes') as FormArray;
  }

 
gammes1:any[]=[]
gammes2:any[]=[]
gammes3:any[]=[]
gammes4:any[]=[]
load_gammes(){
  this.userService.getGammesByTravailAndType(4,"type-de-porte-creation-murs-non-porteurs_ep_5").subscribe(
    (response: any) => {
      console.log('recuperation des gammes type-de-porte-creation-murs-non-porteurs_ep_5:', response);
      this.gammes1=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes type-de-porte-creation-murs-non-porteurs_ep_5 :', error);
    }
  );

  this.userService.getGammesByTravailAndType(4,"type-de-porte-creation-murs-non-porteurs_ep_7").subscribe(
    (response: any) => {
      console.log('recuperation des gammes type-de-porte-creation-murs-non-porteurs_ep_7:', response);
      this.gammes2=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes type-de-porte-creation-murs-non-porteurs_ep_7 :', error);
    }
  );

  this.userService.getGammesByTravailAndType(4,"type-de-porte-creation-murs-non-porteurs_ep_10").subscribe(
    (response: any) => {
      console.log('recuperation des gammes type-de-porte-creation-murs-non-porteurs_ep_10:', response);
      this.gammes3=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes type-de-porte-creation-murs-non-porteurs_ep_10 :', error);
    }
  );

  this.userService.getGammesByTravailAndType(4,"type-de-porte-creation-murs-non-porteurs_ep_10+").subscribe(
    (response: any) => {
      console.log('recuperation des gammes type-de-porte-creation-murs-non-porteurs_ep_10+:', response);
      this.gammes4=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes type-de-porte-creation-murs-non-porteurs_ep_10+ :', error);
    }
  );
}


submit(){
  console.log(this.formulaire.value);

  const murs_non_porteurs = this.formulaire.value.murs_non_porteurs;
  const portes = this.formulaire.value.portes;
  const has_portes = this.formulaire.value.has_portes;

  this.devisTache.Donnees = {
    "gammes-produits-creation-murs-non-porteurs--portes": {
      murs_non_porteurs: murs_non_porteurs,
      portes: portes,
      has_portes: has_portes,
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
  
  const murs_non_porteurs = this.formulaire.value.murs_non_porteurs;
  const portes = this.formulaire.value.portes;
  const has_portes = this.formulaire.value.has_portes;

  this.devisTache.Donnees = {
    "gammes-produits-creation-murs-non-porteurs--portes": {
      murs_non_porteurs: murs_non_porteurs,
      portes: portes,
      has_portes: has_portes,
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


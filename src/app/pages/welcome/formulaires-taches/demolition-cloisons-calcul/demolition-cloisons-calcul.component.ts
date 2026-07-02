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
prix_coutant_mode=false
   constructor(private calculDevisService:CalculDevisService,private fb: NonNullableFormBuilder,private route: ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    }

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const mode = params['mode'];
        if (mode === 'modification') {
          // Mode modification activé
          console.log('On est en mode modification');
          this.edit_mode=true
        } else if (mode === 'prix_coutant') {
          // Mode prix_coutant activé
          console.log('On est en mode prix_coutant');
          this.prix_coutant_mode=true
        }
        else {
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
                ndp: [mur.ndp],
                cloison: [mur.cloison],
                artisan_pose: [mur.artisan_pose],
                fournisseur_pose: [mur.fournisseur_pose],
              });
            })
          ),
          ouverturePartielle: this.fb.array(
            this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle.map((ouverture: any) => {
              return this.fb.group({
                longueur: [ouverture.longueur],
                hauteur: [ouverture.hauteur],
                longueur_ouverture: [ouverture.longueur_ouverture],
                hauteur_ouverture: [ouverture.hauteur_ouverture],
                hauteur_depuis_le_sol: [ouverture.hauteur_depuis_le_sol],
                hauteur_depuis_le_plafond: [ouverture.hauteur_depuis_le_plafond],
                cloison: [ouverture.cloison],
                image: [ouverture.image],
                artisan_pose: [ouverture.artisan_pose],
                fournisseur_pose: [ouverture.fournisseur_pose],
              });
            })
          ),
          tp1: [this.donnees["gammes-produits-murs-non-porteurs"].tp1 || false],
          tp3: [this.donnees["gammes-produits-murs-non-porteurs"].tp3 || false]
        });
        

        this.load_artisans_fournisseurs()
        
        
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

  gammes_cloison_partielle:any

  gammes_cloison_complete:any

  load_gammes(){
    this.userService.getGammesByTravailAndType(3,"cloison-demolition-complete").subscribe(
      (response: any) => {
        console.log('recuperation des gammes cloison:', response);
        this.gammes_cloison_complete=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes cloison :', error);
      }
    );

    this.userService.getGammesByTravailAndType(3,"cloison-ouverture-partielle").subscribe(
      (response: any) => {
        console.log('recuperation des gammes cloison:', response);
        this.gammes_cloison_partielle=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des gammes cloison :', error);
      }
    );
  
  }


  
artisans_pose_ouverture:any[] = []
fournisseurs_pose_ouverture:any[] = []
artisans_pose_mur:any[] = []
fournisseurs_pose_mur:any[] = []



load_artisans_fournisseurs(){

  this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle.map((ouverture:any, i:number) => {
    let rev_a_poser_id=parseInt(ouverture.cloison.split(":")[0]);

    this.userService.getArtisansFournisseursElementsByGammeReference(rev_a_poser_id,'artisan').subscribe(
      (response: any) => {
        console.log('recuperation des artisans_pose_ouverture:', response);
        this.artisans_pose_ouverture[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_pose_ouverture :', error);
      }
    );

    this.userService.getArtisansFournisseursElementsByGammeReference(rev_a_poser_id,'fournisseur').subscribe(
      (response: any) => {
        console.log('recuperation des fournisseurs_pose_ouverture:', response);
        this.fournisseurs_pose_ouverture[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des fournisseurs_pose_ouverture :', error);
      }
    );


  });



   this.donnees["gammes-produits-murs-non-porteurs"].mursNonporteurs.map((ouverture: any, i:number) => {
    let rev_a_poser_id=parseInt(ouverture.cloison.split(":")[0]);

    this.userService.getArtisansFournisseursElementsByGammeReference(rev_a_poser_id,'artisan').subscribe(
      (response: any) => {
        console.log('recuperation des artisans_pose_mur:',rev_a_poser_id, response);
        this.artisans_pose_mur[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_pose_mur :', error);
      }
    );

    this.userService.getArtisansFournisseursElementsByGammeReference(rev_a_poser_id,'fournisseur').subscribe(
      (response: any) => {
        console.log('recuperation des fournisseurs_pose_mur:', response);
        this.fournisseurs_pose_mur[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des fournisseurs_pose_mur :', error);
      }
    );

  });


}


submit(){
  console.log(this.formulaire.value);

  const mursNonporteurs = this.formulaire.value.mursNonporteurs;
  const ouverturePartielle = this.formulaire.value.ouverturePartielle;
  const tp1 = this.formulaire.value.tp1;
  const tp3 = this.formulaire.value.tp3;

  this.devisTache.Donnees = {
    "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
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
    let formule_marge = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule_marge;

    // Si formule existe, on remplace les \n par des <br>
    if (formule) {
      formule = formule.replace(/\n/g, '<br>');

      // On réinjecte la formule modifiée dans l'objet
      this.detailsCalcul.resultats[this.element.TravailSlug] = {
        ...this.detailsCalcul.resultats[this.element.TravailSlug],
        formule: formule
      };
    }
    if (formule_marge) {
        formule_marge = formule_marge.replace(/\n/g, '<br>');

        // On réinjecte la formule_marge modifiée dans l'objet
        this.detailsCalcul.resultats[this.element.TravailSlug] = {
          ...this.detailsCalcul.resultats[this.element.TravailSlug],
          formule_marge: formule_marge
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
     "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
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
    let formule_marge = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule_marge;
    if (formule_marge) {
      formule_marge = formule_marge.replace(/\n/g, '<br>');

      // On réinjecte la formule_marge modifiée dans l'objet
      this.detailsCalcul.resultats[this.element.TravailSlug] = {
        ...this.detailsCalcul.resultats[this.element.TravailSlug],
        formule_marge: formule_marge
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
        if(!this.prix_coutant_mode){
          setTimeout(() => {
            this.router.navigate(['/administration/devis-pieces', 'modifier-devis-piece', this.devisTache.DevisPieceID]);
          }, 2000);
        }
       
      },
      (error) => {
        console.error('Erreur lors de la modification de la tache :', error);
      }
    );
  }).catch(error => {
    console.error('Erreur lors du calcul du prix:', error);
  });
}




  get_prix_vente(i:number,type:string){
    let prix = 0
    switch (type) {
      case 'murs':
        prix = parseFloat(this.donnees["gammes-produits-murs-non-porteurs"].mursNonporteurs[i].cloison.split(':')[2]);
        break;
      case 'ouverture':
        prix = parseFloat(this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle[i].cloison.split(':')[2]);
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  get_prix_coutant(i:number,type:string){
    let prix = 0
    switch (type) {
      case 'murs':
        prix += parseFloat(this.donnees["gammes-produits-murs-non-porteurs"].mursNonporteurs[i].fournisseur_pose?.split(':')[2] || '0')
        prix += parseFloat(this.donnees["gammes-produits-murs-non-porteurs"].mursNonporteurs[i].artisan_pose?.split(':')[2] || '0')
        break;
      case 'ouverture':
        prix += parseFloat(this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle[i].artisan_pose?.split(':')[2] || '0')
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  get_client_choice_label(i:number,type:string){
    let label = ''
    switch (type) {
      case 'murs':
        label = this.donnees["gammes-produits-murs-non-porteurs"].mursNonporteurs[i].cloison?.split(':')[1] 
        break;
      case 'ouverture':
        label = this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle[i].cloison?.split(':')[1] 
        break;
    
      default:
        break;
    }
    return `"${label}"`
  }

  get_dimensions(i:number,type:string){
    let label = 'quantité : 1 <br>'
   
    
       
    switch (type) {
      case 'murs':
        label += `longueur : ${this.donnees["gammes-produits-murs-non-porteurs"].mursNonporteurs[i].longueur} cm <br>` 
        label += `hauteur : ${this.donnees["gammes-produits-murs-non-porteurs"].mursNonporteurs[i].hauteur } cm <br>`
        break;
      case 'ouverture':
        label += `longueur : ${this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle[i].longueur} cm <br>` 
        label += `hauteur : ${this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle[i].hauteur } cm <br>`
        label += `longueur ouverture : ${this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle[i].longueur_ouverture } cm <br>`
        label += `hauteur ouverture : ${this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle[i].hauteur_ouverture } cm <br>`
        label += `hauteur depuis le sol : ${this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle[i].hauteur_depuis_le_sol } cm <br>`
        label += `hauteur depuis le plafond : ${this.donnees["gammes-produits-murs-non-porteurs"].ouverturePartielle[i].hauteur_depuis_le_plafond } cm <br>`
        break;
    
      default:
        break;
    }
    
    return label
  }



}

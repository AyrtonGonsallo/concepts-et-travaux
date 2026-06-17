import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';

@Component({
  selector: 'app-pose-de-revetements-muraux-calcul',
  templateUrl: './pose-de-revetements-muraux-calcul.component.html',
  styleUrl: './pose-de-revetements-muraux-calcul.component.css'
})
export class PoseDeRevetementsMurauxCalculComponent {
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
    this.load_types()
    this.load_gammes()
    this.load_etats()
    this.load_historiques()
    
  }

  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          murs: this.fb.array(this.donnees["dimensions-pose-murs"].murs.map((mur:any, i:number) => {
            return this.fb.group({
              hauteur: mur.hauteur,
              longueur: mur.longueur,
              depose: mur.depose,
              etat: this.donnees["etat-surfaces-pose-murs"].murs[i].etat,
              gamme: this.donnees["gammes-produits-pose-murs"].murs[i].gamme,
              artisan_depose:(this.donnees["gammes-produits-pose-murs"].murs[i].artisan_depose)?this.donnees["gammes-produits-pose-murs"].murs[i].artisan_depose:"",
              artisan_surfaces:(this.donnees["gammes-produits-pose-murs"].murs[i].artisan_surfaces)?this.donnees["gammes-produits-pose-murs"].murs[i].artisan_surfaces:"",
              artisan_pose:(this.donnees["gammes-produits-pose-murs"].murs[i].artisan_pose)?this.donnees["gammes-produits-pose-murs"].murs[i].artisan_pose:"",
              fournisseur_pose:(this.donnees["gammes-produits-pose-murs"].murs[i].fournisseur_pose)?this.donnees["gammes-produits-pose-murs"].murs[i].fournisseur_pose:"",
              
            });
          }))
        });
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);

        this.load_artisans_fournisseurs()
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }

  get murs() {
    return this.formulaire.get('murs') as FormArray;
  }

  historique:any
  load_historiques(){
     this.userService.getHistoriqueDevisTacheById( parseInt(this.tacheId) ).subscribe(
      (response) => {
        this.historique=response
       
       // this.validateForm.patchValue(response);
        console.log("historique ",this.historique);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
  }
  restaurer(id:number){
    this.userService.restaurerDevisTache( parseInt(this.tacheId),id ).subscribe(
      (response) => {
        console.log("devis restauré ",response);
        this.reloadCurrentRoute()

      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
  }

  type_de_depose:any
  load_types(){
    this.userService.getGammesByTravailAndTypeOrdered(5,"service-depose-murs").subscribe(
      (response: any) => {
        console.log('recuperation des types service-depose-murs	:', response);
        this.type_de_depose=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des types service-depose-murs	 :', error);
      }
    );
  }
etat_des_surfaces:any
load_etats(){
  this.userService.getGammesByTravailAndTypeOrdered(5,"etat-des-surfaces-murs").subscribe(
    (response: any) => {
      console.log('recuperation des etat-des-surfaces-murs	:', response);
      this.etat_des_surfaces=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des etat-des-surfaces-murs	 :', error);
    }
  );
}
    
  gammes_peinture:any
  gammes_enduit:any
  gammes_papier:any
  gammes_carrelage:any
  gammes_bois:any
  gammes_tissus:any
  load_gammes(){
  this.userService.getGammesByTravailAndType(5,"peinture-mur").subscribe(
    (response: any) => {
      console.log('recuperation des gammes peinture-mur:', response);
      this.gammes_peinture=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes peinture-mur :', error);
    }
  );
  this.userService.getGammesByTravailAndType(5,"bois").subscribe(
    (response: any) => {
      console.log('recuperation des gammes bois:', response);
      this.gammes_bois=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes bois :', error);
    }
  );
  this.userService.getGammesByTravailAndType(5,"tissus-mur").subscribe(
    (response: any) => {
      console.log('recuperation des gammes tissus-mur:', response);
      this.gammes_tissus=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes tissus-mur :', error);
    }
  );
  this.userService.getGammesByTravailAndType(5,"enduit-decoratif-mur").subscribe(
    (response: any) => {
      console.log('recuperation des gammes enduit-decoratif-mur:', response);
      this.gammes_enduit=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes enduit-decoratif-mur :', error);
    }
  );
  this.userService.getGammesByTravailAndType(5,"	papier-peint-mur").subscribe(
    (response: any) => {
      console.log('recuperation des gammes 	papier-peint-mur:', response);
      this.gammes_papier=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes 	papier-peint-mur :', error);
    }
  );
  this.userService.getGammesByTravailAndType(5,"carrelage-mur").subscribe(
    (response: any) => {
      console.log('recuperation des gammes carrelage-mur:', response);
      this.gammes_carrelage=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des gammes carrelage-mur :', error);
    }
  );
}


artisans_depose:any[] = []
artisans_surfaces:any[] = []
artisans_pose:any[] = []
fournisseurs_pose:any[] = []



load_artisans_fournisseurs(){

  this.donnees["dimensions-pose-murs"].murs.map((mur:any, i:number) => {
    let rev_a_poser_id=parseInt(this.donnees["gammes-produits-pose-murs"].murs[i].gamme.split(":")[0]);
    let etat_id=parseInt(this.donnees["etat-surfaces-pose-murs"].murs[i].etat.split("-")[0]);
    let rev_a_deposer_id=parseInt(mur.depose.split(":")[0]);

    this.userService.getArtisansFournisseursElementsByGammeReference(rev_a_deposer_id,'artisan').subscribe(
      (response: any) => {
        console.log('recuperation des artisans_depose:', response);
        this.artisans_depose[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_depose :', error);
      }
    );

    this.userService.getArtisansFournisseursElementsByGammeReference(etat_id,'artisan').subscribe(
      (response: any) => {
        console.log('recuperation des artisans_surfaces:', response);
        this.artisans_surfaces[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_surfaces :', error);
      }
    );


    this.userService.getArtisansFournisseursElementsByGammeReference(rev_a_poser_id,'artisan').subscribe(
      (response: any) => {
        console.log('recuperation des artisans_pose:',rev_a_poser_id,'artisan', response);
        this.artisans_pose[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_pose :', error);
      }
    );

    this.userService.getArtisansFournisseursElementsByGammeReference(rev_a_poser_id,'fournisseur').subscribe(
      (response: any) => {
        console.log('recuperation des fournisseurs_pose:', response);
        this.fournisseurs_pose[i] = response;
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des fournisseurs_pose :', error);
      }
    );
  });
}


  submit(){
    console.log(this.formulaire.value)
    const mursFormArray = this.formulaire.value.murs;
    this.devisTache.Donnees = {
      "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
      "dimensions-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          hauteur: mur.hauteur,
          longueur: mur.longueur,
          depose: mur.depose,
          image: null // ou garde l’ancienne valeur si dispo
        }))
      },
      "etat-surfaces-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          etat: mur.etat
        }))
      },
      "gammes-produits-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          gamme: mur.gamme,
          carrelage: 0,
          papier: 0,
          enduit: 0,
          peinture: 0,
          artisan_depose:mur.artisan_depose,
          artisan_surfaces:mur.artisan_surfaces,
          artisan_pose:mur.artisan_pose,
          fournisseur_pose:mur.fournisseur_pose,
        }))
      }
    };
    console.log("donnees", this.devisTache)
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
    console.log(this.formulaire.value)
    const mursFormArray = this.formulaire.value.murs;
    this.devisTache.Donnees = {
      "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
      "dimensions-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          hauteur: mur.hauteur,
          longueur: mur.longueur,
          depose: mur.depose,
          image: null // ou garde l’ancienne valeur si dispo
        }))
      },
      "etat-surfaces-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          etat: mur.etat
        }))
      },
      "gammes-produits-pose-murs": {
        murs: mursFormArray.map((mur: any) => ({
          gamme: mur.gamme,
          artisan_depose:mur.artisan_depose,
          artisan_surfaces:mur.artisan_surfaces,
          artisan_pose:mur.artisan_pose,
          fournisseur_pose:mur.fournisseur_pose,
          carrelage: 0,
          papier: 0,
          enduit: 0,
          peinture: 0
        }))
      }
    };
  
    console.log("Données avant modification", this.devisTache);

    this.calculDevisService.calculer_prix_tache(this.devisTache).then((result) => {
      this.detailsCalcul = result;
      let formule = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule;
      let formule_marge = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule_marge;
      if (formule) {
        formule = formule.replace(/\n/g, '<br>');
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
      const prixCalcule = (this.detailsCalcul?.resultats?.[this.element.TravailSlug]?.prix/1.25);
      console.log("Prix calculé", this.element.TravailSlug, prixCalcule);

      if (prixCalcule !== undefined) {
        this.devisTache.Prix = prixCalcule;
      }

      console.log("Données après modification", this.devisTache);

      this.userService.updateDevistache(parseInt(this.tacheId),this.devisTache).subscribe(
        (response) => {
          console.log('Tache modifiée avec succès :', response);
          this.message.create('success', `Tache modifié avec succès`);
          setTimeout(() => {
          this.reloadCurrentRoute()
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


  reloadCurrentRoute(): void {
  const currentUrlTree = this.router.parseUrl(this.router.url); // récupère URL + query params

  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentUrlTree.root.children['primary'].segments.map(it => it.path).join('/')], {
      queryParams: currentUrlTree.queryParams
    });
  });
}



}





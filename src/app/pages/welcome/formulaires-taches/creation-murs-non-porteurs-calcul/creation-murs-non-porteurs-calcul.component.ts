import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { forkJoin } from 'rxjs';

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
      this.load_types()
      this.load_parametres()
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
                artisan_pose:[mur.artisan_pose],
              });
            })
          ),
          portes: this.fb.array(
            this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].portes.map((porte: any) => {
              return this.fb.group({
                largeur: [porte.largeur],
                gamme: [porte.gamme],
              });
            })
          ),
          has_portes: [this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].has_portes || false]
        });
        

        this.load_artisans_fournisseurs()

         
        if (this.prix_coutant_mode) {
          this.modifier()
        }
        
        
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }


  getDetails2(id: number): void {
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
                artisan_pose:[mur.artisan_pose],
              });
            })
          ),
          portes: this.fb.array(
            this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].portes.map((porte: any) => {
              return this.fb.group({
                largeur: [porte.largeur],
                gamme: [porte.gamme],
              });
            })
          ),
          has_portes: [this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].has_portes || false]
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

  
  get murs_non_porteurs() {
    return this.formulaire.get('murs_non_porteurs') as FormArray;
  }
  get portes() {
    return this.formulaire.get('portes') as FormArray;
  }

 type_epaisseur:any
load_types(){
  this.userService.getGammesByTravailAndTypeOrdered(4,"epaisseur-creation-mur-non-porteur").subscribe(
    (response: any) => {
      console.log('recuperation des types service-depose-murs	:', response);
      this.type_epaisseur=response
    },
    (error: any) => {
      console.error('Erreur lors de la recuperation des types service-depose-murs	 :', error);
    }
  );
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





artisans_pose:any[] = []
all_artisans:any = []
one_artisan_for_all=0



load_artisans_fournisseurs() {

  const requests: any[] = [];

  this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].murs_non_porteurs.forEach((mur:any) => {

    const rev_a_poser_id = parseInt(mur.epaisseur.split(":")[0]);

    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(
        rev_a_poser_id,
        'artisan'
      )
    );

  });


  forkJoin(requests).subscribe({

    next: (responses:any[]) => {

      this.artisans_pose = [];

      responses.forEach((response:any, i:number) => {

        this.artisans_pose[i] = response;

      });

        // Artisans distincts
      this.all_artisans = [
        ...new Map(
          [
            ...this.artisans_pose.flat().map((x:any) => x.Artisan),
          ]
          .map((a:any) => [a.Id, a])
        ).values()
      ];


      console.log('artisans_pose:', this.artisans_pose);
      console.log('all_artisans', this.all_artisans);


    },

    error: (error:any) => {
      console.error('Erreur lors de la recuperation des artisans_pose :', error);
    }

  });

}


 coefficient = 0
  load_parametres(){
    
    this.userService.get_parametre_by_id_or_nom(1,"coefficient")
      .subscribe(
        (data) => {
          this.coefficient=data.Valeur;
        },
        (error) => {
          console.error('Erreur lors de la recupération des parametres', error);
        }
      );
  }

onArtisanForAllChange(artisanId: number): void {

  this.selectArtisanFormArray(
    artisanId,
    this.artisans_pose,
    this.murs_non_porteurs,
    'artisan_pose'
  );

 

}


private selectArtisanFormArray(
  artisanId: number,
  optionsArray: any[][],
  formArray: any,
  controlName: string
): void {



  optionsArray.forEach((options, index) => {

    const option = options.find(
      (o:any) => o.Artisan?.Id === artisanId
    );

    if (!option) {
      return;
    }

    formArray.at(index)
      .get(controlName)
      ?.setValue(
        `${option.ID}:${option.Prix}:${option.Label}`
      );

  });

}



submit(){
  console.log(this.formulaire.value);

  const murs_non_porteurs = this.formulaire.value.murs_non_porteurs;
  const portes = this.formulaire.value.portes;
  const has_portes = this.formulaire.value.has_portes;

  this.devisTache.Donnees = {
     "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
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
  
  const murs_non_porteurs = this.formulaire.value.murs_non_porteurs;
  const portes = this.formulaire.value.portes;
  const has_portes = this.formulaire.value.has_portes;

  this.devisTache.Donnees = {
    "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
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
        }else{
           this.getDetails2(parseInt(this.tacheId, 10))
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






get_prix_vente(i:number){
    let prix = 0
    prix = parseFloat(this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].murs_non_porteurs[i].epaisseur.split(':')[1]);
        prix*=this.coefficient
    return `${prix} €`
  }


  get_prix_debourse(i:number){
    let prix = 0
    prix = parseFloat(this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].murs_non_porteurs[i].epaisseur.split(':')[1]);
        
    return `${prix} €`
  }

  get_prix_coutant(i:number){
    let prix = 0
    prix += parseFloat(this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].murs_non_porteurs[i].artisan_pose?.split(':')[1] || '0')
       
    return `${prix} €`
  }

  get_client_choice_label(i:number){
    let label = ''
   
      
    label = this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].murs_non_porteurs[i].epaisseur?.split(':')[2] 
       
    return `"${label}"`
  }

  get_dimensions(i:number){
    let label = 'quantité : 1 <br>'
    label += `longueur : ${this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].murs_non_porteurs[i].longueur} cm <br>` 
    label += `hauteur : ${this.donnees["gammes-produits-creation-murs-non-porteurs--portes"].murs_non_porteurs[i].hauteur } cm <br>`
     
    return label
  }


}


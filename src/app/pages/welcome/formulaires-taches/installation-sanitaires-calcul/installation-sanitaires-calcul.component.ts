import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { Equipement } from '../../../../Models/Equipement';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-installation-sanitaires-calcul',
  templateUrl: './installation-sanitaires-calcul.component.html',
  styleUrl: './installation-sanitaires-calcul.component.css'
})
export class InstallationSanitairesCalculComponent {
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
      this.loadAppareils()

    }

devispiece:any
  getDetails(id: number): void {
    this.userService.get_devis_tache(id ).subscribe(
      (response) => {
        this.devisTache=response

        this.userService.getDevisPieceMinimumDatasById(this.devisTache.DevisPieceID).subscribe(
          (response) => {
            this.devispiece=response
            console.log('this.devispiece',this.devispiece)
            
          },
          (error) => {
            console.error('Erreur lors de la recuperation des details devis :', error);
          }
        );
        
        this.element =response
        this.donnees = JSON.parse(response.Donnees) 
        this.formulaire = this.fb.group({
          appareils_salle_de_bain_form: this.fb.array([]),
          gammes_depose_form: this.fb.array(
            this.donnees["dimensions-pose-app-san"].gammes_depose_form.map((gamme: any) => {
              return this.fb.group({
                quantite: [gamme.quantite],
                titre: [gamme.titre],
                prix: [gamme.prix],
                id: [gamme.id],
                artisan_depose:[gamme.artisan_depose??'']
              });
            })
          )
        });
        
        
        this.load_artisans_fournisseurs();
        this.load_parametres()
         
             
     
        
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
          appareils_salle_de_bain_form: this.fb.array([]),
          gammes_depose_form: this.fb.array(
            this.donnees["dimensions-pose-app-san"].gammes_depose_form.map((gamme: any) => {
              return this.fb.group({
                quantite: [gamme.quantite],
                titre: [gamme.titre],
                prix: [gamme.prix],
                id: [gamme.id],
                artisan_depose:[gamme.artisan_depose??'']
              });
            })
          )
        });
        
        
        this.load_artisans_fournisseurs();
        this.load_parametres()
         
       
        
       // this.validateForm.patchValue(response);
        console.log("donnees ",this.donnees);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
    
  }


  appareils_salle_de_bain:Equipement[]=[]

  gammes_depose: any[] = [];
   // Getter pour accéder à la FormArray "gammes"
   get gammes_depose_form(): FormArray {
    return this.formulaire.get('gammes_depose_form') as FormArray;
  }
  get appareils_salle_de_bain_form(): FormArray {
    return this.formulaire.get('appareils_salle_de_bain_form') as FormArray;
  }
tableauIds = [9, 37, 10, 2,35,38,6,36,34,42,39,40,41,];

 loadAppareils(): void {

  forkJoin({
    appareils: this.userService.getEquipementsByPiece(5),
    gammesDepose: this.userService.getGammesByTravailAndTypeOrdered(
      16,
      'service-depose-salle-de-bain-salle-d-eau'
    )
  }).subscribe({
    next: ({ appareils, gammesDepose }) => {

      /* =====================================================
       * GAMMES DEPOSE
       * ===================================================== */

      this.gammes_depose = gammesDepose;

      console.log(
        'Réponse get depose salle de bain :',
        this.gammes_depose
      );


      /* =====================================================
       * APPAREILS
       * ===================================================== */

      const tableauIds = this.tableauIds;

      this.appareils_salle_de_bain = appareils
        .filter(
          (equipement:any) =>
            equipement.Modeles &&
            equipement.Modeles.length > 0
        )
        .sort((a:any, b:any) => {

          const indexA = tableauIds.indexOf(a.ID);
          const indexB = tableauIds.indexOf(b.ID);

          const positionA =
            indexA === -1
              ? Number.MAX_SAFE_INTEGER
              : indexA;

          const positionB =
            indexB === -1
              ? Number.MAX_SAFE_INTEGER
              : indexB;

          return positionA - positionB;
        });

      console.log(
        'Réponse getEquipementsByPiece:salledebain :',
        this.appareils_salle_de_bain
      );


      /* =====================================================
       * DONNEES EXISTANTES
       * ===================================================== */

      const donneesExistantes =
        this.donnees['gammes-produits-pose-app-san']
          ?.appareils_salle_de_bain ?? [];


      /* =====================================================
       * FORM ARRAY
       * ===================================================== */

      const formArray =
        this.formulaire.get(
          'appareils_salle_de_bain_form'
        ) as FormArray;

      // Important si loadAppareils() peut être appelé plusieurs fois
      formArray.clear();


      /* =====================================================
       * CREATION DES FORM GROUPS
       * ===================================================== */

      this.appareils_salle_de_bain.forEach(
        (appareil, index) => {

          const donnees =
            donneesExistantes[index] ?? {};


          const appareilGroup = this.fb.group({
            id: [
              donnees.id ?? 0
            ],

            longueur: [
              donnees.longueur ?? 0
            ],

            largeur: [
              donnees.largeur ?? 0
            ],

            nombre_de_vasque: [
              donnees.nombre_de_vasque ?? 0
            ],

            encastre_ou_apparente: [
              donnees.encastre_ou_apparente ?? false
            ],

            active: [
              donnees.active ?? false
            ],

            modele: [
              donnees.modele ?? ''
            ],

            titre: [
              donnees.titre ?? ''
            ],

            artisan_pose: [
              donnees.artisan_pose ?? ''
            ],

            fournisseur_pose: [
              donnees.fournisseur_pose ?? ''
            ]
          });


          /* =================================================
           * CONTROLES
           * ================================================= */

          const activeControl =
            appareilGroup.get('active');

          const modeleControl =
            appareilGroup.get('modele');


          /* =================================================
           * VALIDATION MODELE
           * ================================================= */

          activeControl?.valueChanges.subscribe(
            (isActive: boolean) => {

              if (isActive) {

                modeleControl?.setValidators(
                  Validators.required
                );

              } else {

                modeleControl?.clearValidators();

              }

              modeleControl?.updateValueAndValidity({
                emitEvent: false
              });
            }
          );


          // Appliquer immédiatement la validation
          // correspondant à la valeur initiale
          if (activeControl?.value) {

            modeleControl?.setValidators(
              Validators.required
            );

          } else {

            modeleControl?.clearValidators();

          }

          modeleControl?.updateValueAndValidity({
            emitEvent: false
          });


          /* =================================================
           * AJOUT AU FORM ARRAY
           * ================================================= */

          formArray.push(appareilGroup);
        }
      );


         if (this.prix_coutant_mode) {
          this.modifier()
        }
    },

    error: (error) => {

      console.error(
        'Erreur lors du chargement des appareils / gammes :',
        error
      );

    }
  });
}


loadAppareils2(): void {

  forkJoin({
    appareils: this.userService.getEquipementsByPiece(5),
    gammesDepose: this.userService.getGammesByTravailAndTypeOrdered(
      16,
      'service-depose-salle-de-bain-salle-d-eau'
    )
  }).subscribe({
    next: ({ appareils, gammesDepose }) => {

      /* =====================================================
       * GAMMES DEPOSE
       * ===================================================== */

      this.gammes_depose = gammesDepose;

      console.log(
        'Réponse get depose salle de bain :',
        this.gammes_depose
      );


      /* =====================================================
       * APPAREILS
       * ===================================================== */

      const tableauIds = this.tableauIds;

      this.appareils_salle_de_bain = appareils
        .filter(
          (equipement:any) =>
            equipement.Modeles &&
            equipement.Modeles.length > 0
        )
        .sort((a:any, b:any) => {

          const indexA = tableauIds.indexOf(a.ID);
          const indexB = tableauIds.indexOf(b.ID);

          const positionA =
            indexA === -1
              ? Number.MAX_SAFE_INTEGER
              : indexA;

          const positionB =
            indexB === -1
              ? Number.MAX_SAFE_INTEGER
              : indexB;

          return positionA - positionB;
        });

      console.log(
        'Réponse getEquipementsByPiece:salledebain :',
        this.appareils_salle_de_bain
      );


      /* =====================================================
       * DONNEES EXISTANTES
       * ===================================================== */

      const donneesExistantes =
        this.donnees['gammes-produits-pose-app-san']
          ?.appareils_salle_de_bain ?? [];


      /* =====================================================
       * FORM ARRAY
       * ===================================================== */

      const formArray =
        this.formulaire.get(
          'appareils_salle_de_bain_form'
        ) as FormArray;

      // Important si loadAppareils() peut être appelé plusieurs fois
      formArray.clear();


      /* =====================================================
       * CREATION DES FORM GROUPS
       * ===================================================== */

      this.appareils_salle_de_bain.forEach(
        (appareil, index) => {

          const donnees =
            donneesExistantes[index] ?? {};


          const appareilGroup = this.fb.group({
            id: [
              donnees.id ?? 0
            ],

            longueur: [
              donnees.longueur ?? 0
            ],

            largeur: [
              donnees.largeur ?? 0
            ],

            nombre_de_vasque: [
              donnees.nombre_de_vasque ?? 0
            ],

            encastre_ou_apparente: [
              donnees.encastre_ou_apparente ?? false
            ],

            active: [
              donnees.active ?? false
            ],

            modele: [
              donnees.modele ?? ''
            ],

            titre: [
              donnees.titre ?? ''
            ],

            artisan_pose: [
              donnees.artisan_pose ?? ''
            ],

            fournisseur_pose: [
              donnees.fournisseur_pose ?? ''
            ]
          });


          /* =================================================
           * CONTROLES
           * ================================================= */

          const activeControl =
            appareilGroup.get('active');

          const modeleControl =
            appareilGroup.get('modele');


          /* =================================================
           * VALIDATION MODELE
           * ================================================= */

          activeControl?.valueChanges.subscribe(
            (isActive: boolean) => {

              if (isActive) {

                modeleControl?.setValidators(
                  Validators.required
                );

              } else {

                modeleControl?.clearValidators();

              }

              modeleControl?.updateValueAndValidity({
                emitEvent: false
              });
            }
          );


          // Appliquer immédiatement la validation
          // correspondant à la valeur initiale
          if (activeControl?.value) {

            modeleControl?.setValidators(
              Validators.required
            );

          } else {

            modeleControl?.clearValidators();

          }

          modeleControl?.updateValueAndValidity({
            emitEvent: false
          });


          /* =================================================
           * AJOUT AU FORM ARRAY
           * ================================================= */

          formArray.push(appareilGroup);
        }
      );


        
    },

    error: (error) => {

      console.error(
        'Erreur lors du chargement des appareils / gammes :',
        error
      );

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


artisans_depose:any[] = []
artisans_pose:any[] = []
fournisseurs_pose:any[] = []
all_artisans:any = []
one_artisan_for_all=0
all_fournisseurs:any = []
one_fournisseur_for_all=0




load_artisans_fournisseurs() {

  const requests: any[] = [];

  // Dépose
  this.donnees["dimensions-pose-app-san"].gammes_depose_form.forEach((gamme: any, i: number) => {

    requests.push(
      this.userService.getArtisansFournisseursElementsByGammeReference(gamme.id, 'artisan')
    );

  });

  // Pose artisans + fournisseurs
  this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain.forEach((appareil: any, i: number) => {

    const ref_id = appareil.modele ? parseInt(appareil.modele.split(":")[0]) : 0;

    requests.push(
      this.userService.getArtisansFournisseursModelesByReference(ref_id, 'artisan')
    );

    requests.push(
      this.userService.getArtisansFournisseursModelesByReference(ref_id, 'fournisseur')
    );

  });

  forkJoin(requests).subscribe({

    next: (responses: any[]) => {

      let index = 0;

      this.artisans_depose = [];
      this.artisans_pose = [];
      this.fournisseurs_pose = [];

      // Dépose
      this.donnees["dimensions-pose-app-san"].gammes_depose_form.forEach((g: any, i: number) => {
        this.artisans_depose[i] = responses[index++];
      });

      // Pose
      this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain.forEach((a: any, i: number) => {
        this.artisans_pose[i] = responses[index++];
        this.fournisseurs_pose[i] = responses[index++];
      });

      // Artisans distincts
      this.all_artisans = [
        ...new Map(
          [
            ...this.artisans_depose.flat().map((x: any) => x.Artisan),
            ...this.artisans_pose.flat().map((x: any) => x.Artisan)
          ].map((a: any) => [a.Id, a])
        ).values()
      ];

      // Fournisseurs distincts
      this.all_fournisseurs = [
        ...new Map(
          this.fournisseurs_pose
            .flat()
            .map((x: any) => x.Fournisseur)
            .map((f: any) => [f.Id, f])
        ).values()
      ];

      console.log('total artisans_depose:', this.artisans_depose);
      console.log('total artisans_pose:', this.artisans_pose);
      console.log('total fournisseurs_pose:', this.fournisseurs_pose);
      console.log('this.all_artisans',this.all_artisans);
      console.log('this.all_fournisseurs',this.all_fournisseurs);

    

    },

    error: err => console.error(err)

  });

}


onArtisanForAllChange(artisanId: number): void {

  this.selectArtisansFormArray(
    artisanId,
    this.artisans_depose,
    this.gammes_depose_form,
    'artisan_depose'
  );

  this.selectArtisansFormArray(
    artisanId,
    this.artisans_pose,
    this.appareils_salle_de_bain_form,
    'artisan_pose'
  );

}


private selectArtisansFormArray(
  artisanId: number,
  optionsGroups: any[][],
  formArray: any,
  controlName: string
): void {

  optionsGroups.forEach((options, index) => {

    const option = options?.find(o => o.Artisan?.Id === artisanId);

    if (!option) {
      formArray.at(index).get(controlName)?.setValue(
        ``
      );
      return;
    }

    const label = option.Label ?? option.Titre;

    formArray.at(index).get(controlName)?.setValue(
      `${option.ID}:${label}:${option.Prix}`
    );

  });

}


onFournisseurForAllChange(fournisseurId: number): void {
  

  this.selectFournisseursFormArray(
    fournisseurId,
    this.fournisseurs_pose,
    this.appareils_salle_de_bain_form,
    'fournisseur_pose'
  );

}



private selectFournisseursFormArray(
  fournisseurId: number,
  optionsGroups: any[][],
  formArray: any,
  controlName: string
): void {


  optionsGroups.forEach((options, index) => {

    const option = options?.find(o => o.Fournisseur?.Id === fournisseurId);

    if (!option) {
      formArray.at(index).get(controlName)?.setValue(
      ``
    );
      return;
    }

    const label = option.Label ?? option.Titre;

    formArray.at(index).get(controlName)?.setValue(
      `${option.ID}:${label}:${option.Prix}`
    );

  });

}


submit() {
  console.log(this.formulaire.value);

  const gammes_depose_form = this.formulaire.value.gammes_depose_form;
  const appareils_salle_de_bain_form = this.formulaire.value.appareils_salle_de_bain_form;
 

  this.devisTache.Donnees = {
    "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "gammes-produits-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
    },
    "etat-surfaces-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
    },
    "dimensions-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
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
     let formule_marge = this.detailsCalcul.resultats[this.element.TravailSlug]?.formule_marge;
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
  const gammes_depose_form = this.formulaire.value.gammes_depose_form;
  const appareils_salle_de_bain_form = this.formulaire.value.appareils_salle_de_bain_form;
 

  this.devisTache.Donnees = {
     "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
    "gammes-produits-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
    },
    "etat-surfaces-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
    },
    "dimensions-pose-app-san": {
      gammes_depose_form: gammes_depose_form,
      appareils_salle_de_bain:appareils_salle_de_bain_form,
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
           this.loadAppareils2()
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
      case 'pose':
        if(this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain[i].active){
          prix = parseFloat(this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain[i].modele.split(':')[2]);

        }
        break;
      case 'depose':
        if(this.donnees["dimensions-pose-app-san"].gammes_depose_form[i].quantite>0){
          prix = parseFloat(this.donnees["dimensions-pose-app-san"].gammes_depose_form[i].prix);
        }
        break;
    
      default:
        break;
    }

    prix*=this.coefficient
    return `${prix} €`
  }


  
  get_prix_debourse(i:number,type:string){
    let prix = 0
    switch (type) {
      case 'pose':
        if(this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain[i].active){
          prix = parseFloat(this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain[i].modele.split(':')[2]);

        }
        break;
      case 'depose':
        if(this.donnees["dimensions-pose-app-san"].gammes_depose_form[i].quantite>0){
          prix = parseFloat(this.donnees["dimensions-pose-app-san"].gammes_depose_form[i].prix);
        }
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  get_prix_coutant(i:number,type:string){
    let prix = 0
    switch (type) {
      case 'pose':
        prix += parseFloat(this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain[i].fournisseur_pose?.split(':')[2] || '0')
        prix += parseFloat(this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain[i].artisan_pose?.split(':')[2] || '0')
        break;
      case 'depose':
        prix += parseFloat(this.donnees["dimensions-pose-app-san"].gammes_depose_form[i].artisan_depose?.split(':')[2] || '0')
        break;
    
      default:
        break;
    }
    return `${prix} €`
  }

  get_client_choice_label(i:number,type:string){
    let label = ''
    switch (type) {
      case 'depose':
        label = this.donnees["dimensions-pose-app-san"].gammes_depose_form[i].titre 
        break;
      case 'pose':
        label = `${this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain[i].titre} ${this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain[i].modele?.split(':')[1]}` 
        break;
    
      default:
        break;
    }
    return `"${label}"`
  }

  get_dimensions(i:number,type:string){
    let label = '<br>'

    switch (type) {
      case 'depose':
        label += `quantité : ${this.donnees["dimensions-pose-app-san"].gammes_depose_form[i].quantite}  <br>` 
        break;
      case 'pose':
        label += `longueur : ${this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain[i].longueur} cm <br>` 
        label += `largeur : ${this.donnees["gammes-produits-pose-app-san"].appareils_salle_de_bain[i].largeur } cm <br>`
        label += `quantité : 1 <br>`
        break;
    
      default:
        break;
    }
   

    return label
  }


}
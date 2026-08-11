import { Component } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalculDevisService } from '../../../../Services/calcul-devis.service';
import { DevisTache } from '../../../../Models/DevisTache';
import { Equipement } from '../../../../Models/Equipement';

@Component({
  selector: 'app-renovation-electrique-partielle-calcul',
  templateUrl: './renovation-electrique-partielle-calcul.component.html',
  styleUrl: './renovation-electrique-partielle-calcul.component.css'
})
export class RenovationElectriquePartielleCalculComponent {
  tacheId:string =  this.route.snapshot.paramMap.get('id')??'0';
  element:any
  donnees:any
  formulaire!: FormGroup;
  devisTache!:DevisTache;
  detailsCalcul:any
  appareils_electrique_a_remplacer:Equipement[]=[]
  appareils_a_remplacer_form:Equipement[]=[]
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
        this.load_parametres()
        
      }


    getDetails(id: number): void {
      this.userService.get_devis_tache(id ).subscribe(
        (response) => {
          this.devisTache=response
          this.element =response
          this.donnees = JSON.parse(response.Donnees) 
        
          this.formulaire = this.fb.group({
            artisan_gamme:(this.donnees["gammes-produits-pose-electricite"].artisan_gamme)?this.donnees["gammes-produits-pose-electricite"].artisan_gamme:"",
            fournisseur_gamme:(this.donnees["gammes-produits-pose-electricite"].fournisseur_gamme)?this.donnees["gammes-produits-pose-electricite"].fournisseur_gamme:"",
            
            gamme: [this.donnees["gammes-produits-pose-electricite"].gamme],
            appareils: this.fb.array(
              this.donnees["gammes-produits-pose-electricite"].appareils_electrique_a_remplacer
                .filter((a: any) => a.active) // seulement les appareils actifs
                .map((appareil: any) =>
                  this.fb.group({
                    id: [appareil.id],
                    titre: [appareil.titre],
                    nombre_a_creer: [appareil.nombre_a_creer],
                    nombre_a_remplacer: [appareil.nombre_a_remplacer],
                    active:1
                  })
                )
            )
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


    loadAppareils(){
   
    


      this.userService.getEquipementsByType ("electrique-a-remplacer").subscribe(
        (response: Equipement[]) => {
          this.appareils_electrique_a_remplacer = response;
  
          console.log("réponse de la requette  getEquipementsByType:electrique-a-remplacer",this.appareils_electrique_a_remplacer);
          let i=0
          this.appareils_electrique_a_remplacer.forEach(appareil => {
            let titre=appareil.Titre
            let active=false
            let nombre_a_creer=0
            let nombre_a_remplacer=0
            let id=appareil.ID
           
            // Créer un FormGroup pour chaque appareil
            const appareilGroup2 = this.fb.group({});
            appareilGroup2.addControl("id", this.fb.control(id, ));
            appareilGroup2.addControl("titre", this.fb.control(titre, ));
              appareilGroup2.addControl("nombre_a_creer", this.fb.control(nombre_a_creer, ));
              appareilGroup2.addControl("nombre_a_remplacer", this.fb.control(nombre_a_remplacer, ));
  
              appareilGroup2.addControl("active", this.fb.control(active, ));
             
  
              // Obtenez les contrôles pour pouvoir les manipuler
              const nombre_a_creerControl = appareilGroup2.get('nombre_a_creer');
              const nombre_a_remplacerControl = appareilGroup2.get('nombre_a_remplacer');
              const activeControl = appareilGroup2.get('active');
  
              // Abonnez-vous aux changements de la valeur de 'active'
              activeControl?.valueChanges.subscribe((isActive: boolean) => {
                if (isActive) {
                  // Si 'active' est true, ajouter les validateurs
                  nombre_a_remplacerControl?.setValidators(Validators.required);
                  nombre_a_creerControl?.setValidators(Validators.required);
                } else {
                  // Sinon, supprimer les validateurs
                  nombre_a_creerControl?.clearValidators();
                  nombre_a_remplacerControl?.clearValidators();
                }
                // Mettre à jour la validation pour forcer la vérification des erreurs
                nombre_a_creerControl?.updateValueAndValidity();
                nombre_a_remplacerControl?.updateValueAndValidity();
              });
  
            i++
          });
         
        },
        (error) => {
          console.error('Erreur lors de la recuperation des  appareils_electrique_a_remplacer :', error);
        }
      );
    }

    gammes_appareillage:any
    load_gammes(){
      this.userService.getGammesByTravailAndType(13,"gamme-appareils").subscribe(
        (response: any) => {
          console.log('recuperation des gammes appareillage:', response);
          this.gammes_appareillage=response
        },
        (error: any) => {
          console.error('Erreur lors de la recuperation des gammes appareillage :', error);
        }
      );
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
      

  artisans_gammes:any
  fournisseurs_gammes:any

  load_artisans_fournisseurs(){
    let rev_a_poser_id=parseInt(this.donnees["gammes-produits-pose-electricite"].gamme.split(":")[0]);

   
    this.userService.getArtisansFournisseursElementsByGammeReference(rev_a_poser_id,'artisan').subscribe(
      (response: any) => {
        console.log('recuperation des artisans_pose:',rev_a_poser_id,'artisan', response);
        this.artisans_gammes=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des artisans_pose :', error);
      }
    );

    this.userService.getArtisansFournisseursElementsByGammeReference(rev_a_poser_id,'fournisseur').subscribe(
      (response: any) => {
        console.log('recuperation des fournisseurs_pose:', response);
        this.fournisseurs_gammes=response
      },
      (error: any) => {
        console.error('Erreur lors de la recuperation des fournisseurs_pose :', error);
      }
    );
  }


    get appareils(): FormArray {
      return this.formulaire.get('appareils') as FormArray;
    }



    submit() {
      console.log(this.formulaire.value);
    
      const gamme = this.formulaire.value.gamme;
      const appareils = this.formulaire.value.appareils;
    
      this.devisTache.Donnees = {
        "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
        "gammes-produits-pose-electricite": {
          gamme: gamme,
          fournisseur_gamme:this.formulaire.value.fournisseur_gamme,
          artisan_gamme:this.formulaire.value.artisan_gamme,
          appareils_electrique_a_remplacer: appareils
        }
      };
    
      console.log("Données envoyées :", this.devisTache);
    
      this.calculDevisService.calculer_prix_tache(this.devisTache)
        .then((result) => {
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
    
          console.log("Prix reçu :", this.detailsCalcul);
        })
        .catch((error) => {
          console.error("Erreur lors du calcul :", error);
        });
    }
    


    modifier(){
      const gamme = this.formulaire.value.gamme;
      const appareils = this.formulaire.value.appareils;
    
      this.devisTache.Donnees = {
         "nomtache":this.devisTache.TravailSlug,
      "idtache":this.devisTache.TravailID,
        "gammes-produits-pose-electricite": {
          gamme: gamme,
          fournisseur_gamme:this.formulaire.value.fournisseur_gamme,
          artisan_gamme:this.formulaire.value.artisan_gamme,
          appareils_electrique_a_remplacer: appareils
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


    getprixMultiples(prixMultiples: string): string {

      try {

        return JSON.parse(prixMultiples || '[]')
          .map((item: any) => `${item.nom} : ${item.prix} €`)
          .join('\n');

      } catch {
        return '';
      }

    }



    
  get_prix_coutant(){


    let res = ""

    if(this.donnees["gammes-produits-pose-electricite"].artisan_gamme && this.donnees["gammes-produits-pose-electricite"].fournisseur_gamme){

      this.donnees["gammes-produits-pose-electricite"].appareils_electrique_a_remplacer.forEach((appareil:any) => {
        if(appareil.active){
          let nom_appareil = appareil.titre
          
          const json_datas_artisan_prix = JSON.parse(
            this.donnees["gammes-produits-pose-electricite"].artisan_gamme.split('-')[1]
          );//tableau d'objets nomappareil,prix

          const json_datas_fournisseur_prix = JSON.parse(
            this.donnees["gammes-produits-pose-electricite"].fournisseur_gamme.split('-')[1]
          );//tableau d'objets nomappareil,prix
          

          const appareil_prix_artisan = json_datas_artisan_prix.find((x: any) => x.nom === nom_appareil);
          const appareil_prix_fournisseur = json_datas_fournisseur_prix.find((x: any) => x.nom === nom_appareil);

          let prix = appareil_prix_artisan ? appareil_prix_artisan.prix : 0;

          prix += appareil_prix_fournisseur ? appareil_prix_fournisseur.prix : 0;

          res += `${nom_appareil} : ${prix}€ <br>`
        }
      })


    }

    


    return res
  }


  get_prix_debourse() {

    let res = ""

    this.donnees["gammes-produits-pose-electricite"].appareils_electrique_a_remplacer.forEach((appareil:any) => {
      if(appareil.active){
        let nom_appareil = appareil.titre
        
        const json_datas_prix = JSON.parse(
          this.donnees["gammes-produits-pose-electricite"].gamme.split('-')[1]
        );//tableau d'objets nomappareil,prix
          
        const appareil_prix = json_datas_prix.find((x: any) => x.nom === nom_appareil);

        const prix = appareil_prix ? appareil_prix.prix : 0;

        res += `${nom_appareil} : ${prix}€ <br>`
      }
    })

  

  return res
}





  get_prix_vente() {

    let res = ""

    this.donnees["gammes-produits-pose-electricite"].appareils_electrique_a_remplacer.forEach((appareil:any) => {
      if(appareil.active){
        let nom_appareil = appareil.titre
        
        const json_datas_prix = JSON.parse(
          this.donnees["gammes-produits-pose-electricite"].gamme.split('-')[1]
        );//tableau d'objets nomappareil,prix
          
        const appareil_prix = json_datas_prix.find((x: any) => x.nom === nom_appareil);

        let prix = appareil_prix ? appareil_prix.prix : 0;

        prix*=this.coefficient

        res += `${nom_appareil} : ${prix}€ <br>`
      }
    })

  

  return res
}



  get_client_choice_label(){
    return `"${this.donnees["gammes-produits-pose-electricite"].gamme.split('-')[2]}"`
  }
  

  get_dimensions(){
    let label = ''

    this.donnees["gammes-produits-pose-electricite"].appareils_electrique_a_remplacer.forEach((appareil:any) => {
      if(appareil.active){
        label += `Titre : ${appareil.titre} <br>` 
        label += `à créer : ${appareil.nombre_a_creer}  <br>` 
        label += `à remplacer : ${appareil.nombre_a_remplacer} <br>--------<br>` 
      }
    })
    
    return label
  }

}
    
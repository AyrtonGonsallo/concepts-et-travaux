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

   constructor(private calculDevisService:CalculDevisService,private fb: NonNullableFormBuilder,private route: ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
      }


      ngOnInit(): void {
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
      this.userService.getGammesByTravailAndType(13,"renovation-electrique-partielle").subscribe(
        (response: any) => {
          console.log('recuperation des gammes appareillage:', response);
          this.gammes_appareillage=response
        },
        (error: any) => {
          console.error('Erreur lors de la recuperation des gammes appareillage :', error);
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
        "gammes-produits-pose-electricite": {
          gamme: gamme,
          appareils_electrique_a_remplacer: appareils
        }
      };
    
      console.log("Données envoyées :", this.devisTache);
    
      this.calculDevisService.calculer_prix_tache(this.devisTache)
        .then((result) => {
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
        })
        .catch((error) => {
          console.error("Erreur lors du calcul :", error);
        });
    }
    







}

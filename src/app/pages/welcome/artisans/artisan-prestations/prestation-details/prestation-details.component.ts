import { Component } from '@angular/core';
import { ArtisanFournisseurProjet } from '../../../../../Models/ArtisanFournisseurProjet';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ApiConceptsEtTravauxService } from '../../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../Services/auth.service';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-prestation-details',
  templateUrl: './prestation-details.component.html',
  styleUrl: './prestation-details.component.css'
})
export class PrestationDetailsComponent {

  pres_id:number =  parseInt(this.route.snapshot.paramMap.get('id')??'0');
  returnUrl: string = '/admin/administration';
  computeReturnUrl(): string {
    const url = this.router.url; // ex : "/admin/administration/artisans/modifier-prestation/7"

    // Extraire l'id en fin d'URL
    const match = url.match(/\/(\d+)(?:\?|#|$)/);
    const id = match ? match[1] : null;

    if (!id) {
      return '/administration';
    }

    if (url.includes('/artisans/')) {
      // ⚠️ adapte le nom exact de ta route prestations artisan
      return `/administration/artisans/prestations-artisan/${this.user.Id}`;
    }

    if (url.includes('/fournisseurs/')) {
      return `/administration/fournisseurs/prestations-fournisseur/${this.user.Id}`;
    }

    return '/administration';
  }

 

  user:any
  artisanFournisseurProjet:any

  prestationForm: FormGroup<{
    NatureDesTravaux: FormControl<string>;
    AvisClients: FormControl<number|null>;
    RespectDesDelais: FormControl<number|null>;
    RespectDuPrix: FormControl<number|null>;
    QualiteDesTravaux: FormControl<number|null>;
    TenueDuChantier: FormControl<number|null>;
  }>;

  constructor(private fb: NonNullableFormBuilder,private router: Router,private titleService: Title,private http: HttpClient,  private route: ActivatedRoute,private authService: AuthService,private message: NzMessageService,private userService: ApiConceptsEtTravauxService) {
    
    this.prestationForm = this.fb.group({
      NatureDesTravaux: this.fb.control<string>('', { validators: [Validators.required] }),
      AvisClients: this.fb.control<number | null>(null),
      RespectDesDelais: this.fb.control<number | null>(null),
      RespectDuPrix: this.fb.control<number | null>(null),
      QualiteDesTravaux: this.fb.control<number | null>(null),
      TenueDuChantier: this.fb.control<number | null>(null),
    });

  }
  
  ngOnInit(): void {
    this.titleService.setTitle('Détail de prestation');
    this.load_data()
    
  }
    
 

  load_data(){
    this.userService.getPrestationByID(this.pres_id)
      .subscribe((data: ArtisanFournisseurProjet) => {
        
        this.artisanFournisseurProjet = data;
        console.log("réponse de la requette getArtisanFournisseurByUser",this.artisanFournisseurProjet)

        this.prestationForm.patchValue(data);
        
        this.user = this.artisanFournisseurProjet.Utilisateur
        console.log("réponse de la requette getArtisanFournisseurByUser ",this.artisanFournisseurProjet)
        console.log("user ",this.user)
        ;
      });
      console.log("envoi de la requette getArtisanFournisseurByUser",this.artisanFournisseurProjet);

  }




  tooltipsAvis = ['Terrible', 'Mauvais', 'Moyen', 'Bon', 'Excellent'];
  tooltipsDelais = ['Très en retard', 'En retard', 'Dans les temps', 'En avance', 'Très en avance'];
  tooltipsPrix = ['Très cher', 'Cher', 'Correct', 'Bon rapport', 'Excellent rapport'];
  tooltipsQualite = ['Médiocre', 'Faible', 'Correcte', 'Bonne', 'Excellente'];
  tooltipsChantier = ['Sale', 'Peu soigné', 'Correct', 'Soigné', 'Impeccable'];


  submitForm(): void {
    if (this.prestationForm.invalid) {
      Object.values(this.prestationForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    console.log('Données envoyées :', this.prestationForm.getRawValue());
    console.log('this.computeReturnUrl()',this.computeReturnUrl())
    
    this.userService.updatePrestation(this.pres_id,this.prestationForm.value).subscribe(
        (response) => {
          console.log('prestation modifiée avec succès :', response);
          this.message.create('success', `prestation modifiée avec succès`);
          let return_url = this.computeReturnUrl()
          console.log("return_url",return_url)
          this.router.navigateByUrl(return_url);
        },
        (error) => {
          console.error('Erreur lors de la modification de la prestation :', error);
        }
      );
    
  }

}

import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../../../Models/Roles';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-modifier-compte',
  templateUrl: './modifier-compte.component.html',
  styleUrl: './modifier-compte.component.css'
})
export class ModifierCompteComponent {

  validateForm: FormGroup<{
    RaisonSociale: FormControl<string>;
    NumeroSIRET: FormControl<string>;
    Nom: FormControl<string>;
    Prenom: FormControl<string>;
    Email: FormControl<string>;
    Password: FormControl<string>;
    Telephone: FormControl<string>;
    AdressePostale: FormControl<string>;
    CodePostal: FormControl<string>;
    CommunePostale: FormControl<string>;
    Activite:  FormControl<string>;
    CA: FormControl<number>;
    checkPassword: FormControl<string>;
    Effectif: FormControl<number>;
    References: FormControl<string>;
    QuestionnaireTarif: FormControl<string>;
    AssuranceRCDecennale: FormControl<string>;
    KBis: FormControl<string>;
    RoleId: FormControl<number>;
  }>;
 
  isArtisan(){
    return this.validateForm.value.RoleId==2
  }
  isParticulier(){
    return this.validateForm.value.RoleId==3
  }
  isArtisanorParticulier(){
    return ((this.validateForm.value.RoleId==2) || (this.validateForm.value.RoleId==3))
  }
  submitForm(): void {
    
    if (this.validateForm.valid) {

      console.log('submit', this.validateForm.value);
      this.userService.updateParticulier(this.userId,this.validateForm.value).subscribe(
        (response) => {
          console.log('Utilisateur modifié avec succès :', response);
          this.message.create('success', `Utilisateur modifié avec succès`);
          this.router.navigate(['/administration/comptes']);
        },
        (error) => {
          console.error('Erreur lors de la modification de l\'utilisateur :', error);
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.Password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };



  constructor(private authService: AuthService,private fb: NonNullableFormBuilder,private http: HttpClient,private userService: ApiConceptsEtTravauxService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Email: ['', [Validators.email, Validators.required]],
      Password: ['000', []],
      checkPassword: ['', [ this.confirmationValidator]],
      Nom: ['', [Validators.required]],
      Prenom: ['', [Validators.required]],
      Telephone: ['', [Validators.required]],
      RaisonSociale: ['', []],
      NumeroSIRET: ['', []],
      CodePostal:  ['', []],
      CommunePostale:  ['', []],
      AdressePostale: ['', []],
      Activite:  ['', []],
      CA: [0, []],
      Effectif: [0, []],
      References: ['', []],
      QuestionnaireTarif: ['', []],
      AssuranceRCDecennale: ['', []],
      KBis: ['', []],
      RoleId: [0, []],
    });

    // Watch for changes to RoleId and update validators accordingly
    this.validateForm.get('RoleId')!.valueChanges.subscribe(roleId => {
      this.updateValidators(roleId);
    });
  }

  
   // Function to update validators based on RoleId value
   updateValidators(roleId: number): void {
    if (roleId === 3) {
      this.validateForm.get('CodePostal')!.setValidators([Validators.required]);
      this.validateForm.get('CommunePostale')!.setValidators([Validators.required]);
      this.validateForm.get('AdressePostale')!.setValidators([Validators.required]);
    } else {
      this.validateForm.get('CodePostal')!.clearValidators();
      this.validateForm.get('CommunePostale')!.clearValidators();
      this.validateForm.get('AdressePostale')!.clearValidators();
    }

    // Update the validity of the form controls
    this.validateForm.get('CodePostal')!.updateValueAndValidity();
    this.validateForm.get('CommunePostale')!.updateValueAndValidity();
    this.validateForm.get('AdressePostale')!.updateValueAndValidity();
  }
  file_QuestionnaireTarif: string="";
  file_AssuranceRCDecennale: string="";
  file_KBis: string="";
  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    this.file_QuestionnaireTarif = file.name;
  
    // Mettre à jour la valeur de l'input
    const inputElementQuestionnaireTarif = document.getElementById('QuestionnaireTarif') as HTMLInputElement;
    inputElementQuestionnaireTarif.setAttribute('value', this.file_QuestionnaireTarif);
    const formData = new FormData();
    formData.append('file', file);
  // Envoyer le fichier au serveur
  this.userService.upload_file(formData).subscribe(response => {
    console.log('Fichier téléchargé avec succès:', response);
    // Maintenant, vous avez le chemin d'accès au fichier sur le serveur, que vous pouvez stocker dans votre base de données.
  });
    console.log(file);
  }
  
  handleFileInput2(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    this.file_AssuranceRCDecennale =  file.name;
  
    // Mettre à jour la valeur de l'input
    const inputElementAssuranceRCDecennale = document.getElementById('AssuranceRCDecennale') as HTMLInputElement;
    inputElementAssuranceRCDecennale.setAttribute('value', this.file_AssuranceRCDecennale);
    const formData = new FormData();
    formData.append('file', file);
  // Envoyer le fichier au serveur
  this.userService.upload_file(formData).subscribe(response => {
    console.log('Fichier téléchargé avec succès:', response);
    // Maintenant, vous avez le chemin d'accès au fichier sur le serveur, que vous pouvez stocker dans votre base de données.
  });
    console.log(file);
  }
  
  handleFileInput3(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    this.file_KBis =  file.name;
  
    // Mettre à jour la valeur de l'input
    const inputElementKBis = document.getElementById('KBis') as HTMLInputElement;
    inputElementKBis.setAttribute('value',  file.name);
    const formData = new FormData();
    formData.append('file', file);
  // Envoyer le fichier au serveur
  this.userService.upload_file(formData).subscribe(response => {
    console.log('Fichier téléchargé avec succès:', response);
    // Maintenant, vous avez le chemin d'accès au fichier sur le serveur, que vous pouvez stocker dans votre base de données.
  });
    console.log(file);
  }
  slugify(text: string): string {
    return text
    .toLowerCase() // Convertir le texte en minuscules
    .replace(/[^\w\s.-]/g, '') // Supprimer les caractères non alphanumériques sauf les espaces, les tirets et les points
    .replace(/[\s_-]+/g, '-') // Remplacer les espaces et les tirets par un seul tiret
    .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin de chaîne
  }
  roles: Role[] = [];
  userId:number =  parseInt(this.route.snapshot.paramMap.get('id')??'0');
  ngOnInit(): void {
    // Obtenez l'ID de l'utilisateur à partir de l'URL
    const userId = this.route.snapshot.paramMap.get('id')??'0';
    // Utilisez l'ID pour récupérer les détails de l'utilisateur
    this.getUserDetails(userId);
    // Chargez les rôles
    this.loadRoles();
  }
  apiBaseUrl: string = `${environment.apiUrl}/open-file/`;
 assuranceRCDecennale=this.apiBaseUrl
 kbis= this.apiBaseUrl
 questionnaireTarif=this.apiBaseUrl
 nom_assuranceRCDecennale=""
 nom_kbis= ""
 nom_questionnaireTarif=""
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getUserDetails(userId: string): void {
    this.userService.getUserById( parseInt(userId, 10)).subscribe(
      (response) => {
        response.checkPassword="000"
        response.Password="000"

        // recuperer les liens
        this.assuranceRCDecennale+=this.slugify(response.AssuranceRCDecennale)
        this.kbis+= this.slugify(response.KBis)
        this.questionnaireTarif+= this.slugify(response.QuestionnaireTarif)
        
        //recuperer les noms
        this.nom_assuranceRCDecennale=response.AssuranceRCDecennale
        this.nom_kbis= response.KBis
        this.nom_questionnaireTarif= response.QuestionnaireTarif

        response.AssuranceRCDecennale=""
        response.QuestionnaireTarif=""
        response.KBis=""
        this.validateForm.patchValue(response);
        console.log("réponse de la requette get_user",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details utilisateur :', error);
      }
    );
    
  }
  clear_kbis(){
    this.userService.clear_kbis(this.userId).subscribe(
      (response) => {
        console.log("réponse de la requette clear_kbis",response);
        this.nom_kbis=""
      },
      (error) => {
        console.error('Erreur lors de clear_kbis :', error);
      }
    );
  }
  
  clear_assurance_rc_decennale(){
    this.userService.clear_assurance_rc_decennale(this.userId).subscribe(
      (response) => {
        console.log("réponse de la requette clear_assurance_rc_decennale",response);
        this.nom_assuranceRCDecennale=""
      },
      (error) => {
        console.error('Erreur lors de clear_assurance_rc_decennale :', error);
      }
    );
  }

  clear_questionnaire_tarif(){
    this.userService.clear_questionnaire_tarif(this.userId).subscribe(
      (response) => {
        console.log("réponse de la requette clear_questionnaire_tarif",response);
        this.nom_questionnaireTarif=""
      },
      (error) => {
        console.error('Erreur lors de clear_questionnaire_tarif :', error);
      }
    );
  }
  isnotAdmin(){
    return !this.authService.isAdmin()
  }
  loadRoles(): void {
    this.userService.getRoles().subscribe(
      (response) => {
        this.roles = response;
        console.log("réponse de la requette get_roles",this.roles);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des roles :', error);
      }
    );
  }
}
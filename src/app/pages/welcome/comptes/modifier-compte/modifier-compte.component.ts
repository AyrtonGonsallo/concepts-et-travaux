import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../../../Models/Roles';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../environments/environment';

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
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateUser(this.userId,this.validateForm.value).subscribe(
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



  constructor(private fb: NonNullableFormBuilder,private http: HttpClient,private userService: ApiConceptsEtTravauxService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Email: ['', [Validators.email, Validators.required]],
      Password: ['000', []],
      checkPassword: ['', [ this.confirmationValidator]],
      Nom: ['', [Validators.required]],
      Prenom: ['', [Validators.required]],
      Telephone: ['', [Validators.required]],
      RaisonSociale: ['', []],
      NumeroSIRET: ['', []],
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
  apiBaseUrl: string = `${environment.apiUrl}/api-concepts-et-travaux/open-file/`;
 assuranceRCDecennale=this.apiBaseUrl
 kbis= this.apiBaseUrl
 questionnaireTarif=this.apiBaseUrl
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getUserDetails(userId: string): void {
    this.userService.getUserById( parseInt(userId, 10)).subscribe(
      (response) => {
        response.checkPassword="000"
        response.Password="000"
        this.assuranceRCDecennale+=response.AssuranceRCDecennale
        this.kbis+= response.KBis
        this.questionnaireTarif+= response.QuestionnaireTarif
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
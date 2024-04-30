import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Role } from '../../../../Models/Roles';
import { HttpClient } from '@angular/common/http';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-compte',
  templateUrl: './ajouter-compte.component.html',
  styleUrl: './ajouter-compte.component.css'
})
export class AjouterCompteComponent {

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
    Agree: FormControl<boolean>;
  }>;
  file_QuestionnaireTarif: string="";
  file_AssuranceRCDecennale: string="";
  file_KBis: string="";
  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    this.file_QuestionnaireTarif =  file.name;
  
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
  

  submitForm(): void {
    if (this.validateForm.valid) {
       // Écrasez les valeurs des champs spécifiés avant la soumission
       
      console.log('submit', this.validateForm.value);
      this.userService.addUserWithRole(this.validateForm.value).subscribe(
        (response) => {
          console.log('Utilisateur ajouté avec succès :', response);
          this.message.create('success', `Utilisateur ajouté avec succès`);
              this.router.navigate(['/administration/comptes']);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
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



  constructor(private fb: NonNullableFormBuilder,private http: HttpClient,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Email: ['', [Validators.email, Validators.required]],
      Password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      Nom: ['', [Validators.required]],
      Prenom: ['', [Validators.required]],
      Telephone: ['', [Validators.required]],
      Agree: [false],
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

  roles: Role[] = [];

  ngOnInit(): void {
    this.loadRoles();
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
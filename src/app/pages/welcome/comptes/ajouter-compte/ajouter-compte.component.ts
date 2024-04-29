import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Role } from '../../../../Models/Roles';
import { HttpClient } from '@angular/common/http';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';

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
 

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.addUserWithRole(this.validateForm.value).subscribe(
        (response) => {
          console.log('Utilisateur ajouté avec succès :', response);
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



  constructor(private fb: NonNullableFormBuilder,private http: HttpClient,private userService: ApiConceptsEtTravauxService) {
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
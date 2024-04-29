import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Role } from '../../../../Models/Roles';

@Component({
  selector: 'app-ajouter-compte',
  templateUrl: './ajouter-compte.component.html',
  styleUrl: './ajouter-compte.component.css'
})
export class AjouterCompteComponent {

  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    checkPassword: FormControl<string>;
    nom: FormControl<string>;
    prenom: FormControl<string>;
    phoneNumber: FormControl<string>;
    agree: FormControl<boolean>;
    RaisonSociale: FormControl<string>;
    NumeroSIRET: FormControl<string>;
    AdressePostale: FormControl<string>;
    Activite:  FormControl<string>;
    CA: FormControl<number>;
    Effectif: FormControl<number>;
    References: FormControl<string>;
    QuestionnaireTarif: FormControl<string>;
    AssuranceRCDecennale: FormControl<string>;
    KBis: FormControl<string>;
    RoleId: FormControl<number>;
  }>;
 

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
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
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  constructor(private fb: NonNullableFormBuilder) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      agree: [false],
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
}
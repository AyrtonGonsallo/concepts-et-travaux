import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../Services/api-concepts-et-travaux.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  host: {'class': 'login-layout'}
})
export class LoginComponent {
  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    remember: [true]
  });
  passwordVisible = false;
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.auth.login(this.validateForm.value)
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  isVisible = false;
  showModal(): void {
    this.isVisible = true;
    
  }

  handleOk(): void {
    this.sendEmailRecuperation()
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  email:string=""
  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private message: NzMessageService,private auth:AuthService) {}
  sendEmailRecuperation(){
    let mailData = {
      to: this.email, // Adresse e-mail du destinataire
      subject: 'Réinitialisation du mot de passe', // Sujet de l'e-mail
      text: `Bonjour,

      Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour procéder à la réinitialisation :
      ${environment.apiUrl}/restore_user_password/${this.email}
      
      Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail.
      
      Cordialement,
      Votre équipe support` // Contenu du message
    };
    this.userService.send_mail(mailData).subscribe(
      (response) => {
        console.log('Mail de réinitialisation envoyé :', response);
        this.message.success("Un mail de récupération va vous être envoyé à "+this.email)

      },
      (error) => {
        console.error('Erreur lors de l\'envoi du mail de réinitialisation:', error);
        this.message.create('error', `'Erreur lors de l\'envoi du mail de réinitialisation`);
      }
    );
  }
}

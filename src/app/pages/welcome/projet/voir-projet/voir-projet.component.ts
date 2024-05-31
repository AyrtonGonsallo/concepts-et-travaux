import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-voir-projet',
  templateUrl: './voir-projet.component.html',
  styleUrl: './voir-projet.component.css'
})
export class VoirProjetComponent {

  validateForm: FormGroup<{
    Nom: FormControl<string>;
    Description: FormControl<string>;
    Status: FormControl<string>;
  }>;

   liste_des_status = [
    'devis en cours',
    'devis à finaliser',
    'devis à valider',
    'travaux à démarrer',
    'travaux en cours',
    'travaux achevés',
    'chantier réceptionné'
  ] as const;
  
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateProjet(parseInt(this.projetId??'0'),this.validateForm.value).subscribe(
        (response: any) => {
          console.log('projet modifiée avec succès :', response);
          this.message.create('success', `projet modifiée avec succès`);
          this.router.navigate(['/administration/projets']);
        },
        (error: any) => {
          console.error('Erreur lors de la modification de l\'projet :', error);
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





  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService, private route: ActivatedRoute,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      
      Nom: ['', [Validators.required]],
    Description: ['', [Validators.required]],
    Status: ['', [Validators.required]],
      
    });
  }

  projetId:string =  this.route.snapshot.paramMap.get('id')??'0';

  ngOnInit(): void {
    this.getProjetDetails(this.projetId);
  }
  // Méthode pour récupérer les détails de l'utilisateur à partir de l'API
  getProjetDetails(userId: string): void {
    this.userService.get_projet( parseInt(userId, 10)).subscribe(
      (response) => {
        
        this.validateForm.patchValue(response);
        console.log("réponse de la requette get_projet",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details projet :', error);
      }
    );
    
  }
  
}
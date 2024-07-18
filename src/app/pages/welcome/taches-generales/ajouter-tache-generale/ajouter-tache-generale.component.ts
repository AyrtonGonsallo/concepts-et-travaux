import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { Travail } from '../../../../Models/Travail';

@Component({
  selector: 'app-ajouter-tache-generale',
  templateUrl: './ajouter-tache-generale.component.html',
  styleUrl: './ajouter-tache-generale.component.css'
})
export class AjouterTacheGeneraleComponent {
  validateForm: FormGroup<{
    Label: FormControl<string>;
    Prix: FormControl<number>;
    TravailID: FormControl<number>;
  }>;

  travaux:Travail[]=[]
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.addTacheGenerale(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('tache-generale ajoutée avec succès :', response);
          this.message.create('success', `tache-generale ajoutée avec succès`);
          this.router.navigate(['/administration/taches-generales']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de la tache-generale :', error);
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



  constructor(private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
     
      Label: ['', [Validators.required]],
    
      Prix: [0, [Validators.required]],
      TravailID: [0, [Validators.required]],
      
    });
  }

 
  ngOnInit(): void {
    this.loadtravaux()
  }
loadtravaux(){
  this.userService.getTravaux()
      .subscribe((data: Travail[]) => {
        this.travaux = data;
        console.log("réponse de la requette get_travaux",this.travaux);
      });
}
  
}

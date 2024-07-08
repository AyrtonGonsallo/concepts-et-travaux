import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Piece } from '../../../../Models/Piece';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
interface FormValues {
  Titre?: string;
  Description?: string;
  Pieces?: any[]
}


@Component({
  selector: 'app-ajouter-travail',
  templateUrl: './ajouter-travail.component.html',
  styleUrl: './ajouter-travail.component.css'
})
export class AjouterTravailComponent {
  multipleValue : number[] = [];

  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Description: FormControl<string>;
    
  }>;
  pieces: Piece[] = []; 
  size: NzSelectSizeType = 'default';

  submitForm(): void {
    if (this.validateForm.valid) {
      
          const formValues: FormValues = { ...this.validateForm.value };
          formValues.Pieces = this.multipleValue;

          // Affichage du formulaire modifié
          console.log('valeur soumises :', formValues);
          
          this.userService.addTravail(formValues).subscribe(
            (response) => {
              console.log('travail ajouté avec succès :', response);
              this.message.create('success', `travail ajouté avec succès`);
              this.router.navigate(['/administration/travaux']);
            },
            (error) => {
              console.error('Erreur lors de l\'ajout du travail :', error);
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
      Titre: ['', [Validators.required]],
      Description: ['', [Validators.required]],
    });
  }

 
  ngOnInit(): void {
    this.userService.getPieces().subscribe(
      (response) => {
        this.pieces = response;
        console.log("réponse de la requette get_pieces",this.pieces);
       
      },
      (error) => {
        console.error('Erreur lors de la recuperation des pieces :', error);
      }
    );
  }

  
}

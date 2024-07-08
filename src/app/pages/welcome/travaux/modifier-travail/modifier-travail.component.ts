import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Piece } from '../../../../Models/Piece';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
interface FormValues {
  Titre?: string;
  Description?: string;
  Pieces?: any[]
}


@Component({
  selector: 'app-modifier-travail',
  templateUrl: './modifier-travail.component.html',
  styleUrl: './modifier-travail.component.css'
})
export class ModifierTravailComponent {
  multipleValue : number[] = [];
  travailId:string =  this.route.snapshot.paramMap.get('id')??'0';
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
          
          this.userService.updateTravail(parseFloat(this.travailId),formValues).subscribe(
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


// Méthode pour récupérer les détails de l'utilisateur à partir de l'API
getDetails(id: string): void {
  this.userService.getTravailById( parseInt(id, 10)).subscribe(
    (response) => {
      console.log("réponse de la requette get travail details",response);
      this.validateForm.patchValue(response);
      
      response.Pieces.forEach((piece: any) => {
        // Ajouter l'ID de l'categorie à multipleValue
        this.multipleValue.push(piece.ID);
      });
      
      
    },
    (error) => {
      console.error('Erreur lors de la recuperation des details travail :', error);
    }
  );
  
}


  constructor(private fb: NonNullableFormBuilder,private route:ActivatedRoute,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      Titre: ['', [Validators.required]],
      Description: ['', [Validators.required]],
    });
  }

 
  ngOnInit(): void {
    this.getDetails(this.travailId)
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

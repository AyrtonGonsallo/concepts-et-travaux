import { Component } from '@angular/core';
import { Travail } from '../../../../Models/Travail';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';

@Component({
  selector: 'app-modifier-tache-generale',
  templateUrl: './modifier-tache-generale.component.html',
  styleUrl: './modifier-tache-generale.component.css'
})
export class ModifierTacheGeneraleComponent {
  tache_generaleId:string =  this.route.snapshot.paramMap.get('id')??'0';
  validateForm: FormGroup<{
    
    Label: FormControl<string>;
    Prix: FormControl<number>;
    TravailID: FormControl<number>;
  }>;
  travaux:Travail[]=[]
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.updateTacheGenerale(parseInt(this.tache_generaleId),this.validateForm.value).subscribe(
        (response: any) => {
          console.log('tache_generale ajoutée avec succès :', response);
          this.message.create('success', `tache_generale ajoutée avec succès`);
          this.router.navigate(['/administration/taches-generales']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de la tache_generale :', error);
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



  constructor(private route:ActivatedRoute,private fb: NonNullableFormBuilder,private userService: ApiConceptsEtTravauxService,private message: NzMessageService, private router: Router) {
    this.validateForm = this.fb.group({
      
      Label: ['', [Validators.required]],
      Prix: [0, [Validators.required]],
      TravailID: [0, [Validators.required]],
      
    });
  }

 
  ngOnInit(): void {
    this.loadtravaux()
    this.getDetails(parseInt(this.tache_generaleId) )
  }
  loadtravaux(){
    this.userService.getTravaux()
        .subscribe((data: Travail[]) => {
          this.travaux = data;
          console.log("réponse de la requette get_travaux",this.travaux);
        });
  }
  getDetails(id: number): void {
    this.userService.getTacheGeneraleById(id ).subscribe(
      (response) => {
        
        this.validateForm.patchValue(response);
        console.log("réponse de la requette getdetails",response);
      },
      (error) => {
        console.error('Erreur lors de la recuperation des details  :', error);
      }
    );
  }
}
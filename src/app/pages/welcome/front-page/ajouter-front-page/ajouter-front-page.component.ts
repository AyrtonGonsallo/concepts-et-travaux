import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiConceptsEtTravauxService } from '../../../../Services/api-concepts-et-travaux.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-front-page',
  templateUrl: './ajouter-front-page.component.html',
  styleUrl: './ajouter-front-page.component.css'
})
export class AjouterFrontPageComponent {
  validateForm: FormGroup<{
    Titre: FormControl<string>;
    Url: FormControl<string>;
    Content_balise_title: FormControl<string>;
    Content_balise_description: FormControl<string>;
    Content_balise_keywords: FormControl<string>;
    Content_balise_robots: FormControl<string>;
    Href_balise_canonical: FormControl<string>;
    Content_balise_og_title: FormControl<string>;
    Content_balise_og_description: FormControl<string>;
    Content_balise_og_url: FormControl<string>;
    Content_balise_og_type: FormControl<string>;
    Content_balise_og_image: FormControl<string>;
    Content_balise_og_site_name: FormControl<string>;
  }>;
  listOfTypes=["website","article","profile","video.other"]
  listOfRobotsvalues=["noindex, nofollow","index, nofollow","index, follow","noindex, nosnippet"]
  submitForm(): void {
    this.validateForm.patchValue({
      Content_balise_keywords: this.tags.filter(tag => tag.trim() !== "").toString()
    });
    if (this.validateForm.valid) {
      
      console.log('submit', this.validateForm.value);
      
      this.userService.addFrontPage(this.validateForm.value).subscribe(
        (response: any) => {
          console.log('front_page ajoutée avec succès :', response);
          this.message.create('success', `front_page ajouté avec succès`);
          this.router.navigate(['/administration/front-pages']);
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de l\'front_page :', error);
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
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.validateForm = this.fb.group({
      Titre: ['', [Validators.required]],
      Url: ['', [Validators.required, Validators.pattern(urlRegex)]],
      Content_balise_title: ['', [Validators.required]],
      Content_balise_description: ['', [Validators.required]],
      Content_balise_keywords: ['', []],
      Content_balise_robots: ['', [Validators.required]],
      Href_balise_canonical: ['', [Validators.required, Validators.pattern(urlRegex)]],
      Content_balise_og_title: ['', [Validators.required]],
      Content_balise_og_description: ['', [Validators.required]],
      Content_balise_og_url: ['', [Validators.required, Validators.pattern(urlRegex)]],
      Content_balise_og_type: ['', [Validators.required]],
      Content_balise_og_image: ['', [Validators.required]],
      Content_balise_og_site_name: ['', [Validators.required]],
      
    });
  }

 
  ngOnInit(): void {
    
  }


  tags:string[] = [""];
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;
  }
  fileSizeError = false;
  maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
  file_Content_balise_og_image: string="";
  slugify(text: string) {
    const lastDotIndex = text.lastIndexOf('.'); // Trouver l'index du dernier point
  
    if (lastDotIndex === -1) {
      // S'il n'y a pas de point, appliquer les transformations sur tout le texte
      return text
        .toLowerCase()
        .replace(/[^\w\s.-]/g, '') // Supprimer les caractères non alphanumériques sauf les espaces, les tirets et les points
        .replace(/[\s_-]+/g, '-') // Remplacer les espaces et les tirets par un seul tiret
        .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin de chaîne
    }
  
    // Séparer le nom de fichier et l'extension
    const name = text.substring(0, lastDotIndex);
    const extension = text.substring(lastDotIndex);
  
    // Appliquer les transformations sur le nom de fichier uniquement
    const slugifiedName = name
      .toLowerCase()
      .replace(/[^\w\s.-]/g, '') // Supprimer les caractères non alphanumériques sauf les espaces, les tirets et les points
      .replace(/[\s_-]+/g, '-') // Remplacer les espaces et les tirets par un seul tiret
      .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin de chaîne
  
    // Combiner le nom de fichier transformé avec l'extension
    return slugifiedName + extension;
  }
  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    if (file.size > this.maxFileSize) {
      this.fileSizeError = true;
      // Clear the input field to prevent further processing of the large file
      inputElement.value = '';
      
    }else{
      const timestamp = Date.now();
      const uniqueFileName = this.slugify(`${timestamp}_${file.name}`);
      this.file_Content_balise_og_image =  uniqueFileName;
    
      // Mettre à jour la valeur de l'input
      this.validateForm.patchValue({
        Content_balise_og_image: uniqueFileName
      });
      const formData = new FormData();
      const renamedFile = new File([file], uniqueFileName, { type: file.type });
      formData.append('file', renamedFile);
    // Envoyer le fichier au serveur
    this.userService.upload_file(formData).subscribe(response => {
      console.log('Fichier téléchargé avec succès:', response);
      // Maintenant, vous avez le chemin d'accès au fichier sur le serveur, que vous pouvez stocker dans votre base de données.
    });
      console.log(file);
  }
  }
  
}
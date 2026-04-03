import { Component } from '@angular/core';
import { LoaderService } from '../Services/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.css'
})
export class BlankComponent {

    loading = true;
    
    constructor(
      private router: Router,
      public loader: LoaderService
    ) {
  
      this.loader.show();
       setTimeout(() => {
        this.loading = false;
        this.loader.hide();
        this.router.navigate(['login']);
      }, 800);
  
      
  
    }
  
}

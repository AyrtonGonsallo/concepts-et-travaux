import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../Services/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.css'
})
export class BlankComponent implements OnInit {

    loading = true;
    
    constructor(
      private router: Router,
      public loader: LoaderService
    ) {
  

  
      
  
    }


    ngOnInit() {
      this.loader.show();

      setTimeout(() => {
        this.loading = false;
        this.loader.hide();
      }, 1800);
    }
  
}

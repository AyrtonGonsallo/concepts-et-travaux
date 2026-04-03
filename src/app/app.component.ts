import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoaderService } from './Services/loader.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  loading = true;
  isCollapsed = false;
  
  constructor(
    private router: Router,
    public loader: LoaderService
  ) {

    this.loader.show();
     setTimeout(() => {
      this.loading = false;
      this.loader.hide();
    }, 800);

    /*

    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {

       
       
          this.loader.show();
          this.loading = true;
        
        
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loader.hide();
        this.loading = false;
      }

    });

    */

  }
}
import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoaderService } from './Services/loader.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  loading = true;
  isCollapsed = false;
  
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
  }, 800);
}
}
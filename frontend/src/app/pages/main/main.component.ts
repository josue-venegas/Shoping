import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    //BrowserModule, 
    //BrowserAnimationsModule, 
    RouterOutlet, 
    NavbarComponent, 
    FooterComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  title = 'frontend';

  routesWithoutNavbar: string[] = ['/login', '/register', '/forgot-password'];

  constructor(public router: Router) {}

  showNavbar(): boolean {
    return !this.routesWithoutNavbar.includes(this.router.url);
  }
}

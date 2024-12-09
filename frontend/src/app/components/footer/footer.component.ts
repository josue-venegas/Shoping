import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    MenubarModule,
    DropdownModule,
    CarouselModule,
    DropdownModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}

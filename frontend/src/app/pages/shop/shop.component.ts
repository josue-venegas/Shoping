import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { ShopService } from '../../services/shop/shop.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    HttpClientModule,
    ButtonModule,
    InputTextModule,
    MenubarModule,
    DropdownModule,
    CarouselModule,
    DropdownModule,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})

export class ShopComponent implements OnInit {
  menuItems: any[] = [];
  categories: any[] = [];
  highlights: any[] = [];
  latestProducts: any[] = [];

  constructor(
    private router: Router,
    private shopService: ShopService,
  ) {}

  ngOnInit(): void {
    // Definir los elementos del menú de navegación
    this.menuItems = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
      { label: 'All the products', icon: 'pi pi-list', routerLink: '/products' },
      { label: 'Contact', icon: 'pi pi-phone', routerLink: '/contact' },
    ];

    // Obtener las categorías desde la API
    this.shopService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    // Obtener promociones desde la API
    this.shopService.getHighlights().subscribe((highlights) => {
      this.highlights = highlights;
    });

    // Obtener los últimos productos desde la API
    this.shopService.getProducts().subscribe((products) => {
      // Suponiendo que `isFeatured` se usa para los últimos productos destacados
      this.latestProducts = products.filter((product) => product.isFeatured);
    });
  }

  // Función para navegar a una categoría
  navigateToCategory(category: any) {
    this.router.navigate(['/products'], { queryParams: { category: category.name } });
  }
}


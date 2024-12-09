import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    MenubarModule,
    DropdownModule,
    CarouselModule,
    DropdownModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  menuItems: any[] = [];
  categories: any[] = [];
  promotions: any[] = [];
  latestProducts: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Definir los elementos del menú de navegación
    this.menuItems = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
      { label: 'All the products', icon: 'pi pi-list', routerLink: '/products' },
      { label: 'Contact', icon: 'pi pi-phone', routerLink: '/contact' },
    ];

    // Definir las categorías (con imágenes)
    this.categories = [
      { label: 'Electrónica', image: 'assets/electronics.png' },
      { label: 'Ropa', image: 'assets/clothing.png' },
      { label: 'Hogar', image: 'assets/home.png' },
      { label: 'Libros', image: 'assets/books.png' },
    ];

    // Definir promociones para el carrusel
    this.promotions = [
      { title: 'Descuento en Electrónica', description: 'Hasta 50% en productos seleccionados.', image: 'assets/banner1.png' },
      { title: '2x1 en Ropa', description: '¡Oferta por tiempo limitado!', image: 'assets/banner2.png' },
      { title: 'Descuentos en Belleza', description: 'Aprovecha estos descuentos', image: 'assets/banner3.png' },
      { title: 'Summer Sale', description: '¡Nuestros mejores productos al 50% de descuento!', image: 'assets/banner4.png' },
    ];

    // Definir los últimos productos (mock)
    this.latestProducts = [
      { name: 'Smartphone', price: 499.99, image: 'assets/smartphone.png' },
      { name: 'Camiseta', price: 29.99, image: 'assets/tshirt.png' },
      { name: 'Libro de programación', price: 39.99, image: 'assets/book.png' },
      { name: 'Sofá', price: 299.99, image: 'assets/sofa.png' },
      { name: 'Laptop', price: 799.99, image: 'assets/laptop.png' },
    ];
  }

  // Función para navegar a una categoría
  navigateToCategory(category: any) {
    this.router.navigate(['/products'], { queryParams: { category: category.label } });
  }
}

import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token); // Almacena el token
        // Redirigir a la página deseada después de iniciar sesión
        console.log('Inicio de sesión correcto');
        console.log(response);
      },
      (error) => {
        this.errorMessage = 'Credenciales incorrectas';
        console.log('Error al iniciar sesión');
        console.log(error);
      }
    );
  }
}

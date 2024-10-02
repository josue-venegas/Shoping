import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Asegúrate de que esta URL es correcta

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login?lang=en`, credentials);
  }

  logout() {
    localStorage.removeItem('token'); // o cualquier lógica de cierre de sesión
    this.router.navigate(['/login']); // redirigir a la página de inicio de sesión
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

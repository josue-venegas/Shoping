import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AppComponent } from './app.component';
import { ProtectedComponent } from './components/protected/protected.component';

const routes: Routes = [
  { path: 'login', component: AppComponent },
  { path: 'protected-route', component: ProtectedComponent, canActivate: [AuthGuard] }, // Ejemplo de ruta protegida
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Otras rutas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

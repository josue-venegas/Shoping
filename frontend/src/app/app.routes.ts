import { Routes } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    { path: '',             component: AppComponent },
    { path: 'login',        component: LoginComponent },
    { path: 'dashboard',    component: DashboardComponent },
    { path: '**',           component: NotFoundComponent }
];

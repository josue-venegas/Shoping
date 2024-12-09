import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';

import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { path: '',                 component: ShopComponent },
    { path: 'login',            component: LoginComponent },
    { path: 'register',         component: RegisterComponent },
    { path: 'forgot-password',  component: ForgotPasswordComponent },
    { path: 'contact',          component: ContactComponent },
    { path: '**',               component: NotFoundComponent }
];

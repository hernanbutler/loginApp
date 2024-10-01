import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';




export const routes: Routes = [

      {
        path: 'login',
        loadComponent: () => import('./login/login.page').then( m => m.LoginComponent),
      
      },

      {
        path: 'register',
        loadComponent: () => import('./register/register.page').then( m => m.RegisterComponent),
        
      },
      
      { 
      path: 'home',
        loadComponent: () => import('./home/home.page').then( m => m.HomePage),
        canActivate : [AuthGuard],
      },

      {
        path: 'edit-profile',
        loadComponent: () => import('./edit-profile/edit-profile.page').then(m => m.EditProfilePage),
        canActivate : [AuthGuard]
      },

      {
        path: '', 
        redirectTo: 'login',
        pathMatch: 'full'
      },
      
];

export default routes;
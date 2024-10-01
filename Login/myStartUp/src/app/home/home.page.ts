import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule], 
})
export class HomePage implements OnInit ,OnDestroy {
  userName: string | null = null;
  private userSubscription: Subscription | undefined; 

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  
  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.userSubscription = this.authService.currentUser$.subscribe({
      next: (profileData) => {
        if (profileData) {
          this.userName = profileData.name;
        }
      },
      error: (error) => {
        console.error('Error en la carga del perfil:', error);
      }


    });
  }

  async logout() {
    try {
      const response = await this.authService.logout();
      console.log('Salida exitosa', response);
      await this.router.navigate(['/login'], { replaceUrl: true });
    } catch (err) {
      console.error('Error de salida', err);
    }
  }

  // Cancelar la suscripción 
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}

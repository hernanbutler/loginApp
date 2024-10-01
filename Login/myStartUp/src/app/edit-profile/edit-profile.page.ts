import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';

import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
  ]
})
export class EditProfilePage {

  profileForm: FormGroup;
  updateSuccess: boolean | undefined;
  updateError: string | undefined;
  user: Omit<User, 'password'> | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  // Cargar los datos del perfil del usuario
  private loadUserProfile() {
    this.authService.getUserProfile().subscribe({
      next: (profileData) => {
        console.log(profileData);
        if (profileData) {
          this.profileForm.patchValue({
            name: profileData.name,
            email: profileData.email
          });
        }

        console.log(this.profileForm.value)

      },
      error: (error) => {
        this.updateError = 'Ha fallado tu carga de perfil.';
        console.error('Error en la carga de perfil', error);
      }
    });
  }

  // Muestra un mensaje de alerta al usuario cuando la actualización es exitosa
  private async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Excelente!',
      message:'Tu perfil ha sido actualizado',
      buttons: ['OK']
    });

    await alert.present();
  }

  async guardar() {
  
    if (this.profileForm.valid) {

      const updatedName = this.profileForm.get('name')?.value;
      const updatedEmail = this.profileForm.get('email')?.value;
      

      // Verificar si el email ha cambiado y si el nuevo email ya está registrado
      if (this.user && updatedEmail !== this.user.email) {
        try {
          const emailExists = await this.authService.sendSignInLinkToEmail(updatedEmail);
            this.updateError = 'Email en uso. Ingrese otra dirección de correo electrónico.';
            console.error(this.updateError);
            return;
          
        } catch (error) {
          this.updateError = 'Error al verificar email.Ingrese nuevamente';
          console.error('Error al checkear email:', error);
          return;
        }
      }
  
      try {
        // Llamar al servicio para actualizar el perfil
        this.authService.updateProfile({
          name: updatedName,
          email: updatedEmail,

        });
  

        this.updateSuccess = true;
        console.log('Perfil actualizado con éxito');
        this.showSuccessAlert();
        this.router.navigate(['/home'], { replaceUrl: true }); // Navegar de vuelta a home o a la pantalla que desees
      } catch (error) {
        this.updateError = 'Ha fallado la actualización del perfil. Ingrese nuevamente.';
        console.error('Error de actualización del perfil de usuario:', error);
      }
    } else {
      this.updateError = 'Por favor. ingrese de forma correcta los nuevos datos.';
      console.error(this.updateError);
    }
  }

  async logout() {
    try {
      const response = await this.authService.logout();
      console.log('Realizó el logout con éxito', response);
      await this.router.navigate(['/login'], { replaceUrl: true });
    } catch (err) {
      console.error('Logout error', err);
    }
  }
}


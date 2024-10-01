import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router , RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule , RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginSuccess: boolean | undefined;
  loginError: string | undefined;
  formSubmitted = false; 

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    this.formSubmitted = true;  
    if (this.loginForm.valid) {
      console.log('Login Submitted', this.loginForm.value);
      try {
        const response = await this.authService.login
        (this.loginForm.value.email, 
          this.loginForm.value.password);
        console.log('Login successful', response);
        this.router.navigate(['/home'], { replaceUrl: true });
      } catch (error) {
        this.loginError = 'Login failed. Please try again.';
      }
    }
  }

  // Función para abrir enlaces de redes sociales en una nueva pestaña
  openSocial(url: string): void {
    window.open(url, '_blank');
  }
}
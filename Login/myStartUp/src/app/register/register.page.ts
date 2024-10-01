import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerSuccess: boolean | undefined;
  registerError: string | undefined;
  formSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator.bind(this)]]
    });
  }

  passwordMatchValidator(control: any): { [key: string]: boolean } | null {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = control.value;

    if (password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  async onRegister() {
    this.formSubmitted = true;
    if (this.registerForm.valid)
      console.log('Formulario válido. Intentando registrar...'); {
      try {
        // Modificado para pasar el objeto completo del formulario
        const result = await this.authService.register(this.registerForm.value);
        console.log('Registro completado con éxito:', result);
        // Opcional: iniciar sesión automáticamente
        await this.authService.login(this.registerForm.value.email, this.registerForm.value.password);
        this.router.navigate(['/home'], { replaceUrl: true });
      } catch (error: any) { // Especificar el tipo como 'any'
        if (error.code === 'auth/email-already-in-use') {
          this.registerError = 'Este correo ya está en uso.';
        } else if (error.code === 'auth/weak-password') {
          this.registerError = 'La contraseña es demasiado débil.';
        } else {
          this.registerError = 'El registro ha fallado. Intente nuevamente.';
        }
      }
    }
  }
}

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/models/user.model';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Omit<User, 'password'> | null> = new BehaviorSubject<Omit<User, 'password'> | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkUserState();
  }

  // Método para verificar el estado de autenticación al iniciar la aplicación
  async checkUserState(): Promise<void> {
    try {
      const result = await FirebaseAuthentication.getCurrentUser();
      if (result?.user) {
        const user = result.user;
        this.currentUserSubject.next({ name: user.displayName || '', email: user.email! });
      } else {
        this.currentUserSubject.next(null);
      }
    } catch (error) {
      console.error('Error al verificar el estado del usuario:', this.handleError(error));
    }
  }

  // Método que verifica si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const result = await FirebaseAuthentication.signInWithEmailAndPassword({ email, password });
      if (result.user) {
        const user = result.user;
        this.currentUserSubject.next({ name: user.displayName || '', email: user.email! });
        return { success: true };
      } else {
        return Promise.reject(new Error('Usuario no encontrado'));
      }
    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }

  async logout(): Promise<any> {
    try {
      await FirebaseAuthentication.signOut();
      this.currentUserSubject.next(null);
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', this.handleError(error));
    }
  }

  async register(userData: { name: string, email: string, password: string }): Promise<any> {
    console.log('Intentando registrar en Firebase usuario y contraseña:');
    try {
      const result = await FirebaseAuthentication.createUserWithEmailAndPassword({ email: userData.email, password: userData.password });
      if (result.user) {
        await FirebaseAuthentication.updateProfile({ displayName: userData.name });
        this.currentUserSubject.next({ name: userData.name, email: userData.email });
        return { success: true };
      }
    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }

  // Método para obtener el perfil del usuario autenticado
  getUserProfile(): Observable<Omit<User, 'password'> | null> {
    return this.currentUser$;
  }

  // Método para obtener el estado actual del usuario
  async getCurrentUser(): Promise<User | null> {
    const result = await FirebaseAuthentication.getCurrentUser();
    return result?.user ? { name: result.user.displayName || '', email: result.user.email! } : null;
  }

  async updateProfile(profileData: { name?: string; email?: string }): Promise<any> {
    try {
      const currentUser = await FirebaseAuthentication.getCurrentUser();
      if (!currentUser || !currentUser.user) {
        return Promise.reject(new Error('Usuario no autenticado'));
      }

      const user = currentUser.user;
      if (profileData.name && profileData.name !== user.displayName) {
        await FirebaseAuthentication.updateProfile({ displayName: profileData.name });
      }

      if (profileData.email && profileData.email !== user.email) {
        await FirebaseAuthentication.updateEmail({ newEmail: profileData.email });
      }

      this.currentUserSubject.next({
        name: profileData.name || user.displayName || '',
        email: profileData.email || user.email || ''
      });

      return { success: true };
    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }

  async sendSignInLinkToEmail(email: string): Promise<void> {
    try {
      const actionCodeSettings = {
        url: 'http://localhost:8100', // Cambiar a la URL de producción en su momento.
        handleCodeInApp: true,
      };

      await FirebaseAuthentication.sendSignInLinkToEmail({ email, actionCodeSettings });
      console.log('Enlace de autenticación enviado al correo electrónico:', email);
    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }

  // Método para manejar errores
  private handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    } else {
      console.error('Error desconocido:', error);
      return 'Error desconocido';
    }
  }
}

import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { appsOutline, 
        chevronBackCircleOutline, 
        clipboardOutline, 
        cogOutline, 
        homeOutline, 
        logoFacebook, 
        logoInstagram, 
        logOutOutline, 
        logoX, 
        pencilOutline, 
        personCircleOutline } from 'ionicons/icons';
import { StatusBar, Style } from '@capacitor/status-bar';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth'; // Importa Auth
import { environment } from './environments/environment';  // Tu archivo de configuración de Firebase

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // Inicializa Firebase
    provideAuth(() => getAuth()), // Provee el servicio de autenticación
  ],
});

addIcons({
  'person-circle-outline': personCircleOutline,
  'clipboard-outline': clipboardOutline,
  'log-out-outline': logOutOutline,
  'home-outline': homeOutline,
  'cog-outline': cogOutline,
  'apps-outline': appsOutline,
  'pencil-outline': pencilOutline,
  'logo-x': logoX,
  'logo-instagram': logoInstagram,
  'logo-facebook': logoFacebook,
  'chevron-back-circle-outline': chevronBackCircleOutline
});

// StatusBar.setBackgroundColor({ color: '#cbcbcd' }); 
// StatusBar.setStyle({ style: Style.Light}); 
// StatusBar.show(); 
// StatusBar.hide();

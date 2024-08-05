import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"textme-807e6","appId":"1:363748677023:web:88f1561915d4b7079f19aa","storageBucket":"textme-807e6.appspot.com","apiKey":"","authDomain":"textme-807e6.firebaseapp.com","messagingSenderId":"363748677023","measurementId":"G-9SYEM0RZ0R"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideFunctions(() => getFunctions()), provideMessaging(() => getMessaging()), provideStorage(() => getStorage()), provideRemoteConfig(() => getRemoteConfig())
  ]
})
  .catch(err => console.error(err));

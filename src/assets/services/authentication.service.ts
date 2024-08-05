import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, getDocs } from '@angular/fire/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // Registration form
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    privacyPolicy: new FormControl(false, [Validators.requiredTrue]),
  });

  constructor() {}

  // Method to login with email and password
  async loginEmailPassword(email: string, password: string): Promise<boolean> {
    try {
      const userCredentials = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User logged in:', userCredentials.user);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  // Method to create a new user account
  async createAccount(email: string, password: string, firstName: string, lastName: string, city: string, country: string, telephone: string): Promise<boolean> {
    try {
      const userCredentials = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredentials.user;

      // Save user details to Firestore
      await setDoc(doc(this.firestore, 'users', user.uid), {
        firstName,
        lastName,
        city,
        country,
        telephone,
        email
      });

      console.log('User created:', user);
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }

  // Method to log out user
  async logOut() {
    try {
      await signOut(this.auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Method to get the currently logged-in user's ID
  async getCurrentUserId(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }

  // Method to get all users, excluding the current user
  async getUsers(): Promise<User[]> {
    try {
      const currentUserId = await this.getCurrentUserId();
      const usersCollectionRef = collection(this.firestore, 'users');
      const userSnapshot = await getDocs(usersCollectionRef);

      // Extract user data and map to User interface
      const users: User[] = userSnapshot.docs.map(doc => {
        const data = doc.data();
        const user: User = {
          id: doc.id, // Use doc.id as the user ID
          ...data as Omit<User, 'id'> // Ensure the rest of the data matches the User interface
        };
        return user;
      });

      // Filter out the current user
      return users.filter(user => user.id !== currentUserId);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
}

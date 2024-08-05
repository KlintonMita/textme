import { Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../assets/services/authentication.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [MatCardModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  signInForm: FormGroup;
  authService = inject(AuthenticationService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const email = this.signInForm.get('email')?.value;
      const password = this.signInForm.get('password')?.value;

      this.authService.loginEmailPassword(email, password);
    }
    this.router.navigate(['/main'])
  }

  btnCreate() {
    this.router.navigate(['/createAccount']);
    }
}

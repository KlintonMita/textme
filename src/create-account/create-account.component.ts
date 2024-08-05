import { Component, inject, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../assets/services/authentication.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [MatCardModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent implements OnInit {
  userForm!: FormGroup;
  authService = inject(AuthenticationService);


  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.create();
  }

  async create() {
    const email = this.userForm.get('email')?.value;
    const password = this.userForm.get('password')?.value;
    const firstName = this.userForm.get('firstName')?.value;
    const lastName = this.userForm.get('lastName')?.value;
    const city = this.userForm.get('city')?.value;
    const country = this.userForm.get('country')?.value;
    const telephone = this.userForm.get('telephone')?.value;

    const accountCreated = await this.authService.createAccount(email, password, firstName, lastName, city, country, telephone);
    if (accountCreated) {
      this.router.navigate(['']);
    }
  }
}

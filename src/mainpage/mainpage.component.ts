import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MainBodyComponent } from '../main-body/main-body.component';
import { DialogAddMessageComponent } from '../dialog/dialog-add-message/dialog-add-message.component';
import { CommonModule } from '@angular/common';
import { User } from '../assets/services/models/user.model';
import { AuthenticationService } from '../assets/services/authentication.service';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MainBodyComponent,
    CommonModule,
  ],
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainpageComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  authService = inject(AuthenticationService);
  auth = getAuth();
  user: FirebaseUser | null = null;

  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initAuthState();
  }

  initAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      this.cdr.markForCheck();
    });
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(DialogAddMessageComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((user: User | null) => {
      if (user) {
        const userExists = this.users.some(
          (existingUser) => existingUser.id === user.id
        );
        if (!userExists) {
          this.users.push(user);
          this.cdr.markForCheck();
        }
      }
    });
  }

  signOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }

  openMessage(user: User) {
    this.selectedUser = user;
    this.cdr.markForCheck();
  }
}

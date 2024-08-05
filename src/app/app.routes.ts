import { Routes } from '@angular/router';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { LogInComponent } from '../log-in/log-in.component';
import { MainpageComponent } from '../mainpage/mainpage.component';

export const routes: Routes = [
    {path: '', component: LogInComponent},
    {path: 'createAccount', component: CreateAccountComponent},
    {path: 'main', component: MainpageComponent}
];

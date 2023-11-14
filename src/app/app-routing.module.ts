import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { EnregistrementsComponent } from './auth/enregistrements/enregistrements.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserAddComponent } from './users/user-add/user-add.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserViewComponent } from './users/user-view/user-view.component';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { CohorteListComponent } from './cohortes/cohorte-list/cohorte-list.component';
import { CohorteViewComponent } from './cohortes/cohorte-view/cohorte-view.component'; 
import { BanqueListComponent } from './banques/banque-list/banque-list.component';
import { banquesGuard, beneficiairesGuard, cohortesGuard, configurationGuard, dashboardGuard, usersGuard } from './shared/guard/role.guard';
import { BeneficiareListComponent } from './beneficiaires/beneficiare-list/beneficiare-list.component';
import { BeneficiareAddComponent } from './beneficiaires/beneficiare-add/beneficiare-add.component';
import { BeneficiareViewComponent } from './beneficiaires/beneficiare-view/beneficiare-view.component';
import { BeneficiareEditComponent } from './beneficiaires/beneficiare-edit/beneficiare-edit.component';
import { SecteurComponent } from './secteurs/secteur/secteur.component';
import { BanqueConfigComponent } from './banques/banque-config/banque-config.component';
import { LogUserListComponent } from './logs/log-user-list/log-user-list.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent, children: [
    { path: 'login', component: LoginComponent }, 
    { path: 'forgot-password', component: ForgotPasswordComponent }, 
    { path: 'register', component: EnregistrementsComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full'},
  ]},
  { path: 'layouts', component: LayoutsComponent, children: [

    { path: 'profil', component: ProfileComponent },
    { path: 'reset-password', component: ResetPasswordComponent, canActivate: [usersGuard]},
    { path: 'users/user-list', component: UserListComponent, canActivate: [usersGuard]},
    { path: 'users/user-add', component: UserAddComponent, canActivate: [usersGuard]},
    { path: 'users/:id/user-edit', component: UserEditComponent, canActivate: [usersGuard]},
    { path: 'users/:id/user-view', component: UserViewComponent, canActivate: [usersGuard]},
    { path: 'users/logs', component: LogUserListComponent, canActivate: [configurationGuard]},

    { path: 'dashboard', component: DashboardComponent, canActivate: [dashboardGuard]},

    { path: 'cohortes/cohorte-list', component: CohorteListComponent, canActivate: [cohortesGuard]}, 
    { path: 'cohortes/:id/cohorte-view', component: CohorteViewComponent, canActivate: [cohortesGuard]}, 

    { path: 'banques/:id/banque-list', component: BanqueListComponent, canActivate: [banquesGuard]},
    { path: 'banques/config', component: BanqueConfigComponent, canActivate: [configurationGuard]},

    { path: 'beneficiaires/beneficiaire-list', component: BeneficiareListComponent, canActivate: [beneficiairesGuard]},
    { path: 'beneficiaires/:id/beneficiaire-add', component: BeneficiareAddComponent, canActivate: [beneficiairesGuard]},
    { path: 'beneficiaires/:id/beneficiaire-view', component: BeneficiareViewComponent, canActivate: [beneficiairesGuard]},
    { path: 'beneficiaires/:id/beneficiaire-edit', component: BeneficiareEditComponent, canActivate: [beneficiairesGuard]},
    { path: 'beneficiaires/secteur-list', component: SecteurComponent, canActivate: [configurationGuard]},

    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  ]},

  { path: '', redirectTo: 'auth', pathMatch: 'full'},
  { path: '**', redirectTo: 'auth', pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

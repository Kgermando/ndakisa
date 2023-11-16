import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgxEchartsModule } from 'ngx-echarts';
import { QuillModule } from 'ngx-quill';
import { DatePipe } from '@angular/common'; 
import { ErrorStateMatcher, MAT_DATE_LOCALE, ShowOnDirtyErrorStateMatcher } from '@angular/material/core'; 
import { ToastrModule } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common'
import localeFr from '@angular/common/locales/fr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { SharedModule } from './shared/shared.module';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { CustomizerSettingsComponent } from './common/customizer-settings/customizer-settings.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { EnregistrementsComponent } from './auth/enregistrements/enregistrements.component';
import { ChangePasswordDialogBox, ChangePhotoDialogBox, ProfileComponent, UpdateInfoDialogBox } from './auth/profile/profile.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { InfoProfileComponent } from './auth/profile/info-profile/info-profile.component';
import { UserExportXLSXDialogBox, UserListComponent, UserUploadCSVDialogBox } from './users/user-list/user-list.component';
import { UserAddComponent } from './users/user-add/user-add.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserViewComponent } from './users/user-view/user-view.component';
import { UserService } from './users/user.service';
import { AuthService } from './auth/auth.service';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { AuthComponent } from './auth/auth.component';
import { CohorteExportXLSXDialogBox, CohorteListComponent, CreateCohorteDialogBox } from './cohortes/cohorte-list/cohorte-list.component'; 
import { BanqueListComponent, CreateBanqueDialogBox, EditBanqueDialogBox } from './banques/banque-list/banque-list.component';
import { CohorteViewComponent, EditCohorteDialogBox } from './cohortes/cohorte-view/cohorte-view.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CredentialInterceptor } from './common/interceptors/credential.interceptor';
import { BeneficiareListComponent } from './beneficiaires/beneficiare-list/beneficiare-list.component';
import { CohorteService } from './cohortes/cohorte.service';
import { BanqueService } from './banques/banque.service';
import { BeneficiareViewComponent } from './beneficiaires/beneficiare-view/beneficiare-view.component';
import { BeneficiareEditComponent, EditPlanRemboursementDialogBox } from './beneficiaires/beneficiare-edit/beneficiare-edit.component';
import { BeneficiareAddComponent } from './beneficiaires/beneficiare-add/beneficiare-add.component';
import { DashboardService } from './dashboard/dashboard.service';
import { BeneficiareService } from './beneficiaires/beneficiare.service';
import { CohorteProgressComponent } from './cohortes/cohorte-list/cohorte-progress/cohorte-progress.component'; 
import { BeneficiareInputComponent } from './beneficiaires/beneficiare-input/beneficiare-input.component';
import { PlanRemboursementService } from './beneficiaires/plan_remboursement.service';
import { BeneficiaireInfoComponent, EditStatutBeneficiaireDialogBox } from './beneficiaires/beneficiare-view/beneficiaire-info/beneficiaire-info.component';
import { AddDelaiReajustelentDialogBox, AddRemboursementDialogBox, BeneficiaireRemboursementsComponent } from './beneficiaires/beneficiare-view/beneficiaire-remboursements/beneficiaire-remboursements.component'; 
import { MontantRembourserComponent } from './beneficiaires/montant-rembourser/montant-rembourser.component';
import { ResteARembourserComponent } from './beneficiaires/reste-a-rembourser/reste-a-rembourser.component';
import { BanqueProgessComponent } from './banques/banque-progess/banque-progess.component';
import { RemboursementIndiceComponent } from './beneficiaires/beneficiare-view/beneficiaire-remboursements/remboursement-indice/remboursement-indice.component';
import { CohorteGarantieComponent } from './cohortes/cohorte-garantie/cohorte-garantie.component';
import { StatsNombreComponent } from './dashboard/stats-nombre/stats-nombre.component';
import { StatsProgressComponent } from './dashboard/stats-progress/stats-progress.component';
import { StatsSexeComponent } from './dashboard/stats-sexe/stats-sexe.component';
import { StatsBeneficiaireProvinceComponent } from './dashboard/stats-beneficiaire-province/stats-beneficiaire-province.component'; 
import { StatsBeneficiaireStatutComponent } from './dashboard/stats-beneficiaire-statut/stats-beneficiaire-statut.component';
import { StatsBanqueComponent } from './dashboard/stats-banque/stats-banque.component';
import { StatsGarantieRemboursementComponent } from './dashboard/stats-garantie-remboursement/stats-garantie-remboursement.component';
import { StatsCohorteRemboursementComponent } from './dashboard/stats-cohorte-remboursement/stats-cohorte-remboursement.component';
import { TrancheAgeComponent } from './dashboard/tranche-age/tranche-age.component';
import { StatsChorteStatutComponent } from './dashboard/stats-chorte-statut/stats-chorte-statut.component';
import { StatsSecteurActiviteComponent } from './dashboard/stats-secteur-activite/stats-secteur-activite.component';
import { ResteARembourserViewComponent } from './beneficiaires/beneficiare-view/reste-a-rembourser-view/reste-a-rembourser-view.component';
import { EditSecteurDialogBox, SecteurComponent } from './secteurs/secteur/secteur.component';
import { SecteurItemComponent } from './secteurs/secteur-item/secteur-item.component';
import { BanqueConfigComponent } from './banques/banque-config/banque-config.component';
import { LogUserListComponent } from './logs/log-user-list/log-user-list.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    NotFoundComponent,
    InternalErrorComponent,
    CustomizerSettingsComponent,
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    EnregistrementsComponent,
    LoginComponent,
    ProfileComponent,
    ResetPasswordComponent,
    LayoutsComponent,
    InfoProfileComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    UserViewComponent,
    ChangePasswordDialogBox,
    UpdateInfoDialogBox,
    NumberFormatPipe,
    DateAgoPipe,
    DashboardComponent, 
    ChangePhotoDialogBox,
    UpdateInfoDialogBox,
    UserUploadCSVDialogBox,
    UserExportXLSXDialogBox,
    CohorteListComponent, 
    BanqueListComponent,
    CohorteViewComponent,
    BeneficiareListComponent,
    BeneficiareViewComponent,
    BeneficiareEditComponent,
    BeneficiareAddComponent,
    CohorteProgressComponent,
    CreateCohorteDialogBox,
    EditCohorteDialogBox,
    CohorteExportXLSXDialogBox,
    CreateBanqueDialogBox,
    EditBanqueDialogBox,
    BeneficiareInputComponent,
    BeneficiaireInfoComponent,
    BeneficiaireRemboursementsComponent, 
    AddRemboursementDialogBox,
    EditPlanRemboursementDialogBox,
    MontantRembourserComponent,
    ResteARembourserComponent,
    EditStatutBeneficiaireDialogBox,
    BanqueProgessComponent,
    RemboursementIndiceComponent,
    CohorteGarantieComponent,
    StatsNombreComponent,
    StatsProgressComponent,
    StatsSexeComponent,
    StatsBeneficiaireProvinceComponent, 
    StatsBeneficiaireStatutComponent,
    StatsBanqueComponent,
    StatsGarantieRemboursementComponent,
    StatsCohorteRemboursementComponent,
    TrancheAgeComponent,
    StatsChorteStatutComponent,
    StatsSecteurActiviteComponent,
    ResteARembourserViewComponent,
    SecteurComponent,
    EditSecteurDialogBox,
    SecteurItemComponent,
    AddDelaiReajustelentDialogBox,
    BanqueConfigComponent,
    LogUserListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    NgxEchartsModule.forRoot({
        echarts: () => import('echarts')
    }),
    QuillModule.forRoot(),
    ToastrModule.forRoot(),
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    // }),
  ],
  providers: [
    DatePipe,
    UserService,
    AuthService,
    CohorteService,
    BanqueService,
    BeneficiareService,
    DashboardService,
    PlanRemboursementService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    {provide: LOCALE_ID, useValue: "fr-FR" },
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    provideAnimations(), // required animations providers
    provideToastr(),
    NumberFormatPipe,
    DateAgoPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

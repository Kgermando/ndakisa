import { Component, OnInit } from '@angular/core';
import { SecteurModel } from '../models/secteur.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { LogUserService } from 'src/app/logs/log-user.service'; 
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { UserModel } from 'src/app/users/models/user.model';
import { PlanRemboursementModel } from 'src/app/beneficiaires/models/plan_remousement.model';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';
import { SecteurService } from '../secteur.service';

@Component({
  selector: 'app-secteur-view',
  templateUrl: './secteur-view.component.html',
  styleUrls: ['./secteur-view.component.scss']
})
export class SecteurViewComponent implements OnInit {
  secteur: SecteurModel;
  
  ELEMENT_DATA: BeneficiaireModel[] = [];
  remvoursementList: PlanRemboursementModel[] = [];

  isLoading = false; 

  currentUser: UserModel | any; 

  totalCreditAccorde = 0; 
  pourcent = 0;

  // totalGarantie = 0; 
  interet = 0;
  montant_A_Rembourser = 0;
  montantRembourse = 0;
  reste_A_Rembourser = 0;

  
  constructor( 
      public themeService: CustomizerSettingsService, 
      private route: ActivatedRoute, 
      private router: Router, 
      private authService: AuthService,
      private secteurService: SecteurService,
      private logService: LogUserService,
      public dialog: MatDialog, 
      private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => { 
      this.loadData(routeParams['id']);
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;  
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  public loadData(id: any): void {
    this.isLoading = true;
    this.secteurService.get(Number(id)).subscribe(res => {

      this.secteur = res; 
      this.ELEMENT_DATA = this.secteur.beneficiaires;
      this.remvoursementList = this.secteur.plan_remboursements;

      // this.totalGarantie = this.ELEMENT_DATA.reduce(function(sum, value){
      //   return sum + parseFloat(value.montant_garantie); 
      // }, 0);
      this.totalCreditAccorde = this.ELEMENT_DATA.reduce(function(sum, value){
        return sum + parseFloat(value.credit_accorde); 
      }, 0);
      this.interet = this.ELEMENT_DATA.reduce(function(sum, value){
        return sum + parseFloat(value.interet_beneficiaire); 
      }, 0);
      this.montant_A_Rembourser = this.ELEMENT_DATA.reduce(function(sum, value){
        return sum + parseFloat(value.montant_a_debourser);
      }, 0);
       

      this.montantRembourse = this.remvoursementList.reduce(function(sum, value){
        return sum + parseFloat(value.montant_payer); 
       }, 0);
 
      var pourcents = this.montantRembourse * 100 / this.montant_A_Rembourser;
      this.pourcent = parseFloat(pourcents.toFixed(2));
 
      this.reste_A_Rembourser = this.montantRembourse - this.montant_A_Rembourser;
      this.isLoading = false;
    });
  }

 
  

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.logService.createLog(
        this.currentUser.id, 
        'Delete', 
        'User', 
        `${this.secteur.name_secteur}`,
        'Suppression de la banque.'
      ).subscribe(() => {
        this.secteurService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Supprimé avec succès!', 'Success!');
            this.router.navigate(['/layouts/users/user-list']);
          },
          error: err => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      });
      
    }
  } 

  toggleTheme() {
    this.themeService.toggleTheme();
  }


}

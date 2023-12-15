import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { BeneficiaireModel } from '../models/beneficiaire.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficiareService } from '../beneficiare.service';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/users/models/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { PlanRemboursementModel } from '../models/plan_remousement.model'; 
import { LogUserService } from 'src/app/logs/log-user.service'; 
import { PlanRemboursementService } from '../plan_remboursement.service';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-beneficiare-view',
  templateUrl: './beneficiare-view.component.html',
  styleUrls: ['./beneficiare-view.component.scss']
})
export class BeneficiareViewComponent implements OnInit, OnChanges {
  isLoading = false; 
  currentUser: UserModel | any;
  beneficiaire: BeneficiaireModel; 
  ELEMENT_DATA: PlanRemboursementModel[] = []; 

  delai_de_reajustement = 0;
  date_maturite_reajustement: Date;

  pourcent = 0;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router, 
    private authService: AuthService,
    private beneficiareService: BeneficiareService,
    private planRemboursementService: PlanRemboursementService, 
    private logService: LogUserService,
    public dialog: MatDialog,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id'); 
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;  
          this.beneficiareService.get(Number(id)).subscribe(item => {
            this.beneficiaire = item;
            this.planRemboursementService.refreshDataList$.subscribe(() => {
              this.getAllDataPlan(this.beneficiaire.id);
            });
            this.getAllDataPlan(this.beneficiaire.id);  
            this.isLoading = false;
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });  
    }

    ngOnChanges(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id'); 
      this.beneficiareService.get(Number(id)).subscribe(item => {
        this.beneficiaire = item; 
        this.planRemboursementService.refreshDataList$.subscribe(() => {
          this.getAllDataPlan(this.beneficiaire.id);
        });
        this.getAllDataPlan(this.beneficiaire.id);  
        this.isLoading = false;
      });
    }


    getAllDataPlan(id: number) {
      this.planRemboursementService.getAllData(id).subscribe((res) => {
          this.ELEMENT_DATA = res;
          this.beneficiareService.tauxProgessionBeneficiaire(id).subscribe(res => {
            this.pourcent = res[0].pourcentage;
          });

          this.delai_de_reajustement = this.ELEMENT_DATA.reduce(function(sum, value) {
            return sum + value.delai_reajustement;
          },0);
          
          if (this.delai_de_reajustement > 0) {
            var days = this.delai_de_reajustement * 30;
            var date = new Date(this.beneficiaire.date_maturite);
            this.date_maturite_reajustement = new Date(date);
            this.date_maturite_reajustement.setDate(date.getMonth() + days); 
          }
        }
      );
    }

    getCompareDate(date1: Date, date2: Date): boolean {
      var isTrue = false;
      var isDate1 = formatDate(date1, 'yyyy-MM-dd', 'en-US');
      var isDate2 = formatDate(date2, 'yyyy-MM-dd', 'en-US');
      if (isDate1 === isDate2) {
        isTrue = true;
      } else {
        isTrue = false;
      }
      return isTrue;
    }

    edit(id: number) {
      this.router.navigate(['/layouts/beneficiaires', id, 'beneficiaire-edit']);
    }

    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.logService.createLog(
          this.currentUser.id, 
          'Delete', 
          'Beneficiaire', 
          `${this.beneficiaire.name_beneficiaire}`, 
          'Suppression du Beneficiaire'
        ).subscribe(() => {
          this.beneficiareService
          .delete(id)
          .subscribe({
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/layouts/beneficiaires/beneficiaire-list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
          });
        });
        
      }
    }
 
    exportExcel() {
      this.isLoading = true; 
      var dateNow = new Date();
    var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
      this.planRemboursementService.downloadReport(
          this.beneficiaire.id
        ).subscribe({
        next: (res) => {
          this.logService.createLog(
            this.currentUser.id, 
            'Export', 
            'Beneficiaire', 
            `De ${this.beneficiaire.name_beneficiaire}`, 
            'Exportation des données.'
          ).subscribe(() => {
            this.isLoading = false;
            const blob = new Blob([res], {type: 'text/xlsx'});
            const downloadUrl = window.URL.createObjectURL(res);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `Beneficiaire-${dateNowFormat}.xlsx`;
            link.click(); 
            this.toastr.success('Success!', 'Extraction effectuée!'); 
          }); 
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          console.log(err); 
        }
      });
    } 


  toggleTheme() {
      this.themeService.toggleTheme();
  }

  toggleCardBorderTheme() {
      this.themeService.toggleCardBorderTheme();
  }

  toggleCardBorderRadiusTheme() {
      this.themeService.toggleCardBorderRadiusTheme();
  }
}



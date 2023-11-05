import { Component, Inject, OnInit } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { BeneficiaireModel } from '../models/beneficiaire.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficiareService } from '../beneficiare.service';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/users/models/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { PlanRemboursementModel } from '../models/plan_remousement.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-beneficiare-view',
  templateUrl: './beneficiare-view.component.html',
  styleUrls: ['./beneficiare-view.component.scss']
})
export class BeneficiareViewComponent implements OnInit {
  isLoading = false; 
  currentUser: UserModel | any;
  beneficiaire: BeneficiaireModel; 
  ELEMENT_DATA: PlanRemboursementModel[] = [];

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router, 
    private authService: AuthService,
    private beneficiareService: BeneficiareService,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id'); 
      this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user; 
            this.beneficiareService.get(Number(id)).subscribe(res => {
              this.beneficiaire = res;
              this.ELEMENT_DATA = this.beneficiaire.plan_remboursements; 
              
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

    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.beneficiareService
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
      }
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



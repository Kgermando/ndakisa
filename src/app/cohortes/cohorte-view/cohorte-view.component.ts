import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserModel } from 'src/app/users/models/user.model';
import { CohorteService } from '../cohorte.service';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { StatutList } from 'src/app/shared/tools/statut';
import { CohorteModel } from '../models/cohorte.model';  
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';  
import { LogUserService } from 'src/app/logs/log-user.service';
import { BeneficiareService } from 'src/app/beneficiaires/beneficiare.service';
import { PlanRemboursementService } from 'src/app/beneficiaires/plan_remboursement.service';
import { PlanRemboursementModel } from 'src/app/beneficiaires/models/plan_remousement.model';

@Component({
  selector: 'app-cohorte-view',
  templateUrl: './cohorte-view.component.html',
  styleUrls: ['./cohorte-view.component.scss']
})
export class CohorteViewComponent implements OnInit {
  isLoading = false;

  currentUser: UserModel | any;

  cohorte: CohorteModel; 

  ELEMENT_DATA: BeneficiaireModel[] = [];
  remvoursementList: PlanRemboursementModel[] = [];

  banques: string[] = [];
  banqueFilter: string[] = [];

  montant_global = 0;
  totalBanque = 0;
  totalCreditAccorde = 0;
  montant_A_Rembourser = 0;
  totalRembourse = 0;
  resteARembouser = 0;
  totalInteret = 0;

  constructor(
    public themeService: CustomizerSettingsService, 
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService, 
    private cohorteService: CohorteService,
    private beneficiaireService: BeneficiareService,
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
          this.cohorteService.get(Number(id)).subscribe(res => {
            this.cohorte = res;
            this.beneficiaireService.getAllCohorte(this.cohorte.id).subscribe(beneficiaires => {
              this.planRemboursementService.getAllPlanRemboursementCohorte(this.cohorte.id).subscribe(plan_remboursements => {
                this.ELEMENT_DATA = beneficiaires;
                this.remvoursementList = plan_remboursements;
    
                this.montant_global = this.ELEMENT_DATA.reduce(function(sum, value){
                  return sum + parseFloat(value.montant_garantie); 
                }, 0);
    
                this.totalCreditAccorde = this.ELEMENT_DATA.reduce(function(sum, value){
                  return sum + parseFloat(value.credit_accorde); 
                }, 0);
                this.montant_A_Rembourser = this.ELEMENT_DATA.reduce(function(sum, value){
                  return sum + parseFloat(value.montant_a_debourser);
                }, 0);
                this.totalInteret = this.ELEMENT_DATA.reduce(function(sum, value){
                  return sum + parseFloat(value.interet_beneficiaire); 
                }, 0);
                this.totalRembourse = this.remvoursementList.reduce(function(sum, value){
                  return sum + parseFloat(value.montant_payer); 
                 }, 0);
    
                for (let item of this.ELEMENT_DATA) {
                  if (item.banque) {
                    this.banques.push(item.banque.name_banque);
                  }
                };
                
                this.resteARembouser = this.totalRembourse - this.montant_A_Rembourser;
                
                this.banqueFilter = this.banques.filter((item, i, arr) => arr.findIndex((t) => t=== item) === i);
                this.totalBanque = this.banqueFilter.length; 
                this.isLoading = false;
              });
            });
          });
        },
        error: (error) => {
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });  
     
    } 

    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir mettre cet enregistrement en corbeil ?')) {
        this.logService.createLog(
          this.currentUser.id, 
          'Corbeil', 
          'Cohorte', 
          `${this.cohorte.name_cohorte}`, 
          'Mise en corbeil de la cohorte.'
        ).subscribe(() => {
          var body = {
            is_delete: true,
            update_created: new Date(),
          };
          this.cohorteService
          .update(id, body)
          .subscribe({
            next: () => {
              this.toastr.info('Mise en corbeil avec succès!', 'Success!');
              this.router.navigate(['layouts/cohortes/cohorte-list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            }
          })
        }
       );
        
      }
    }

    // delete(id: number): void {
    //   if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
    //     this.logService.createLog(
    //       this.currentUser.id, 
    //       'Delete', 
    //       'Cohorte', 
    //       `${this.cohorte.name_cohorte}`, 
    //       'Suppression de la cohorte.'
    //     ).subscribe(() => this.cohorteService
    //     .delete(id) 
    //     .subscribe({
    //       next: () => {
    //         this.toastr.info('Success!', 'Supprimé avec succès!');
    //         this.router.navigate(['layouts/cohortes/cohorte-list']);
    //       },
    //       error: err => {
    //         this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
    //       }
    //     }));
        
    //   }
    // }

    openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(EditCohorteDialogBox, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          id: id
        }
      }); 
    } 
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }

}


@Component({
  selector: 'edit-cohorte-dialog',
  templateUrl: './cohorte-edit.html',
})
export class EditCohorteDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;

  currentUser: UserModel | any; 

  cohorte: CohorteModel; 

  statutLIst: string[] = StatutList;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditCohorteDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private cohorteService: CohorteService,
      private logService: LogUserService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      name_cohorte: [''],
      contrat_ref: [''], 
      statut_cohorte: [''],
    }); 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.cohorteService.get(parseInt(this.data['id'])).subscribe(item => {
          this.cohorte = item;
          this.formGroup.patchValue({
            name_cohorte: item.name_cohorte,
            contrat_ref: item.contrat_ref,
            statut_cohorte: item.statut_cohorte,
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }


  onSubmit() {
    try {
      this.isLoading = true;
      this.cohorteService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.logService.createLog(
            this.currentUser.id, 
            'Update', 
            'Cohorte', 
            `${this.cohorte.name_cohorte}`, 
            'Modification de la cohorte.'
          ).subscribe(() => {
            this.isLoading = false;
            this.toastr.success('Modification enregistré!', 'Success!');
            window.location.reload();
          });
        },
        error: err => {
          this.isLoading = false;
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
        }
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  close(){
      this.dialogRef.close(true);
  } 

}

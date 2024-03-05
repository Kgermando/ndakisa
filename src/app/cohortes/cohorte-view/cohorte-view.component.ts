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
import { BanqueCohorteService } from 'src/app/banques/banque-cohorte.service';
import { BanqueService } from 'src/app/banques/banque.service'; 

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

  banqueList: any[] = []; 

  totalGarantie = 0;
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
    private banqueCohorteService: BanqueCohorteService,
    private banqueService: BanqueService,
    private logService: LogUserService,
    public dialog: MatDialog,
    private toastr: ToastrService) {}


    ngOnInit(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id');
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user; 
          this.banqueService.getAllNav().subscribe(res => {
            this.banqueList = res;
          });
          this.cohorteService.get(Number(id)).subscribe(res => {
            this.cohorte = res;
            this.beneficiaireService.getAllCohorte(this.cohorte.id).subscribe(beneficiaires => {
              this.planRemboursementService.getAllPlanRemboursementCohorte(this.cohorte.id).subscribe(plan_remboursements => {
                this.banqueCohorteService.getTotalGuarantieCohorte(this.cohorte.id).subscribe(res => {
                  this.ELEMENT_DATA = beneficiaires;
                  this.remvoursementList = plan_remboursements;

                  this.totalGarantie = res[0].montant_garantie;
  
      
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
 
                  this.banqueList = this.ELEMENT_DATA;
                  var banqueIDList = this.banqueList.map(item => item.name_banque); 
  
                  var nBreBanqueList = banqueIDList.filter(element => element !== null);
                  var nBreBanque = nBreBanqueList.filter((element, index) => {
                    return nBreBanqueList.indexOf(element) === index;
                  });

                  this.totalBanque = nBreBanque.length;

                  console.log("nBreBanqueList", nBreBanqueList)
                  console.log("nBreBanque", nBreBanque)
                  
                  this.isLoading = false;
                });
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

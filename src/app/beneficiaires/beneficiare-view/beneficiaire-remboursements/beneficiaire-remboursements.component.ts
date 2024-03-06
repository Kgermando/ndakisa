import { Component, Inject, Input, OnInit } from '@angular/core'; 
import { PlanRemboursementModel } from '../../models/plan_remousement.model';
import { BeneficiaireModel } from '../../models/beneficiaire.model'; 
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserModel } from 'src/app/users/models/user.model';
import { BeneficiareService } from '../../beneficiare.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PlanRemboursementService } from '../../plan_remboursement.service';
import { Validators } from 'ngx-editor';
import { formatDate } from '@angular/common';
import { LogUserService } from 'src/app/logs/log-user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-beneficiaire-remboursements',
  templateUrl: './beneficiaire-remboursements.component.html',
  styleUrls: ['./beneficiaire-remboursements.component.scss']
})
export class BeneficiaireRemboursementsComponent {
  @Input() beneficiaire: BeneficiaireModel;
  @Input() currentUser: UserModel;
 
  isLoadingDowload = false;
 
  planRemboursementList: PlanRemboursementModel[] = [];

  id: any;

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  constructor(
    public themeService: CustomizerSettingsService,  
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private beneficiareService: BeneficiareService,
    private planRemboursement: PlanRemboursementService,
    private logService: LogUserService,
    public dialog: MatDialog,
    private toastr: ToastrService) {}

    ngOnInit(): void { 
      this.id = this.route.snapshot.paramMap.get('id');
      this.beneficiareService.get(this.id).subscribe(item => {
        this.beneficiaire = item;
        this.planRemboursement.refreshDataList$.subscribe(() => {
          this.getAllDataPlan(this.beneficiaire.id);
        });
        this.getAllDataPlan(this.beneficiaire.id);  
      });
    }

    getAllDataPlan(id: number) {
      this.planRemboursement.getAllData(id).subscribe((res) => {
          this.planRemboursementList = res;
        }
      );
    }

    isHiddenBadgeBlue(date_remboursement: Date) {
      return formatDate(new Date(),'yyyy-MM','en_US') < formatDate(new Date(date_remboursement),'yyyy-MM','en_US');
    }

    isActivatedBtn(delai: Date) {
      return formatDate(new Date(),'yyyy-MM','en_US') >= formatDate(new Date(delai),'yyyy-MM','en_US');
    }

    isNotActivatedBtn(delai: Date) {
      return formatDate(new Date(),'yyyy-MM','en_US') < formatDate(new Date(delai),'yyyy-MM','en_US');
    }

    isActivatedReajustementBtn(reajustement: Date) {
      return formatDate(new Date(),'yyyy-MM','en_US') >= formatDate(new Date(reajustement),'yyyy-MM','en_US');
    }

    isNotActivatedReajustementBtn(reajustement: Date) {
      return formatDate(new Date(),'yyyy-MM','en_US') < formatDate(new Date(reajustement),'yyyy-MM','en_US');
    }



  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
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
    }
  }


  downloadRecipicE(date_paiement: Date, url: string) {
    this.isLoadingDowload = true;
    var date = formatDate(new Date(date_paiement),'yyyy-MM','en_US');
      console.log('url', url);
      console.log('date', date);
      
    this.httpClient.get(`${url}`,{responseType: "blob"}).subscribe((res:any) => { 
      const downloadUrl= window.URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${this.beneficiaire.name_beneficiaire}-${date}`;
      link.click();
      this.isLoadingDowload = false;
    });
  } 
  
  downloadBordereau(date_paiement: Date, url: string) {
    try {
      this.isLoadingDowload = true; 
      var date = formatDate(new Date(date_paiement),'yyyy-MM','en_US');
      console.log('url', url);
      console.log('date', date);
      this.planRemboursement.getFile(url).subscribe({
      next: (res) => {
        this.logService.createLog(
          this.currentUser.id, 
          'Download', 
          'Plan de remboursement', 
          `${this.beneficiaire.name_beneficiaire}-${date}`,
          'Téléchargement bordereau.'
        ).subscribe(() => {
          this.isLoadingDowload = false;
          const blob = new Blob([res], {type: 'text/pdf'});
          const downloadUrl = new window.URL(url)
          const link = document.createElement('a');
          // link.href = downloadUrl;
          link.download = `Bordereau-${date}.pdf`;
          link.click(); 
          this.toastr.success('Bordereau téléchargé!', 'Success!'); 
        }); 
      },
      error: (err) => {
        this.isLoadingDowload = false;
        this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
        console.log(err); 
      }
    }); 
    } catch (error) {
      this.toastr.error(`${error}`, 'Oupss!');
    }
  } 


  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string,id: number, name_beneficiaire: string): void {
    this.dialog.open(AddRemboursementDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id,
        name_beneficiaire: name_beneficiaire
      }
    }); 
  }
  
  openDelaiReajustementDialog(enterAnimationDuration: string, exitAnimationDuration: string,id: number): void {
    this.dialog.open(AddDelaiReajustelentDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  }

}


@Component({
  selector: 'add-remboursement-dialog',
  templateUrl: './remboursement-add.html',
})
export class AddRemboursementDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;

  currentUser: UserModel | any; 
 
  montant_payer: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<AddRemboursementDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private remboursementService: PlanRemboursementService,
      private logService: LogUserService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      date_paiement: ['', Validators.required],
      montant_payer: ['', Validators.required],
      observation: [''],
      numero_transaction: [''],
    });
    
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.remboursementService.get(this.data.id).subscribe(item => { 
          this.montant_payer = item.montant_payer;
            this.formGroup.patchValue({
              date_paiement: item.date_paiement,
              montant_payer: item.montant_payer,
              observation: item.observation,
              numero_transaction: item.numero_transaction,
              signature: this.currentUser.matricule, 
              update_created: new Date(),
            });
          }
        );
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    }); 
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        // var body = {
        //   montant_payer: this.formGroup.value.montant_payer,
        //   observation: this.formGroup.value.observation, 
        //   date_paiement: this.formGroup.value.date_paiement, 
        //   file_scan: this.formGroup.value.file_scan, 
        //   signature: this.currentUser.matricule, 
        //   update_created: new Date(),
        // };
        this.remboursementService.update(this.data.id, this.formGroup.getRawValue()).subscribe({
          next: () => this.logService.createLog(
            this.currentUser.id, 
            'Create', 
            'Operation de remboursement',
            `${this.data.name_beneficiaire}`,
            'Téléchargement bordereau.'
          ).subscribe(() => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.close(); 
          }),
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      }
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  } 

  close(){
      this.dialogRef.close(true);
  } 

}



@Component({
  selector: 'add-delai-reajustement-dialog',
  templateUrl: './delai-reajustement-add.html',
})
export class AddDelaiReajustelentDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;

  currentUser: UserModel | any; 
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<AddDelaiReajustelentDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private remboursementService: PlanRemboursementService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      delai_reajustement: [''],
    });
    
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.remboursementService.get(this.data.id).subscribe(item => { 
            this.formGroup.patchValue({
              delai_reajustement: item.delai_reajustement,
              signature: this.currentUser.matricule, 
              update_created: new Date(),
            });
          }
        );
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    }); 
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        this.remboursementService.update(this.data.id, this.formGroup.getRawValue()).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.close(); 
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      }
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  } 

  close(){
      this.dialogRef.close(true);
  } 

}

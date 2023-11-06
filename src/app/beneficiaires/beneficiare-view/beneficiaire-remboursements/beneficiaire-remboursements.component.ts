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
import { RemboursementService } from 'src/app/beneficiaires/remboursement.service'; 
import { RemboursementModel } from '../../models/remboursement.model';
import { PlanRemboursementService } from '../../plan_remboursement.service';

@Component({
  selector: 'app-beneficiaire-remboursements',
  templateUrl: './beneficiaire-remboursements.component.html',
  styleUrls: ['./beneficiaire-remboursements.component.scss']
})
export class BeneficiaireRemboursementsComponent {
  @Input() beneficiaire: BeneficiaireModel; 
  @Input() currentUser: UserModel; 
 
  planRemboursementList: PlanRemboursementModel[] = [];
  remboursementList: RemboursementModel[] = [];

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
    private beneficiareService: BeneficiareService,
    private planRemboursement: PlanRemboursementService,
    private remboursementService: RemboursementService,
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
        
        this.remboursementService.refreshDataList$.subscribe(() => {
          this.getAllData(this.beneficiaire.id);
        });
        this.getAllData(this.beneficiaire.id);
      });
    }

    getAllDataPlan(id: number) {
      this.planRemboursement.getAllData(id).subscribe((res) => {
          this.planRemboursementList = res;
        }
      );
    }

    getAllData(id: number) {
      this.remboursementService.getAllData(id).subscribe((res) => {
          this.remboursementList = res;
        }
      );
    }
 
  

  edit(id: number) {
    this.router.navigate(['/layouts/beneficiaires', id, 'beneficiaire-edit']);
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


  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string,
    id: number, id_cohorte: number, id_banque: number): void {
    this.dialog.open(AddRemboursementDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id,
        id_cohorte: id_cohorte,
        id_banque: id_banque
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
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<AddRemboursementDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private remboursementService: RemboursementService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      montant_payer: [''],
      observation: [''],
      date_paiement: [''],
      file_scan: [''],
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


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          montant_payer: this.formGroup.value.montant_payer,
          observation: this.formGroup.value.observation, 
          date_paiement: this.formGroup.value.date_paiement, 
          file_scan: this.formGroup.value.file_scan,
          cohorte: this.data.id_cohorte,
          banque: this.data.id_banque,
          beneficiaire: this.data.id,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
        };
        this.remboursementService.create(body).subscribe({
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

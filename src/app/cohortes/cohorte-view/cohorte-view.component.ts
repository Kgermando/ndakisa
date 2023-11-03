import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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

  banques: string[] = [];
  banqueFilter: string[] = [];

  totalBanque = 0;
  totalCreditAccorde = 0;
  totalADebourser = 0;
  totalRembourse = 0;
  resteARembouser = 0;
  totalInteret = 0;

  constructor(
    public themeService: CustomizerSettingsService, 
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService, 
    private cohorteService: CohorteService,
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
            this.ELEMENT_DATA = this.cohorte.beneficiaires;
            var rembousement = this.cohorte.remboursements;
            for (let item of this.ELEMENT_DATA) {
              if (item.banque.name_banque) {
                this.banques.push(item.banque.name_banque);
              }
              this.totalCreditAccorde =+ parseFloat(item.credit_accorde);
              this.totalADebourser =+ parseFloat(item.montant_a_debourser);
              this.totalInteret =+ parseFloat(item.interet);
            };
            if (rembousement) {
              for (let item of rembousement) {
                this.totalRembourse =+ parseFloat(item.montant_payer);
              }
            }
            this.resteARembouser = this.totalADebourser - this.totalRembourse;
            
            this.banqueFilter = this.banques.filter((item, i, arr) => arr.findIndex((t) => t=== item) === i);
            this.totalBanque = this.banqueFilter.length;
            console.log('banques', this.banques)
            this.isLoading = false;
          });  
        },
        error: (error) => {
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });  
     
    } 

    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.cohorteService
          .delete(id)
          .subscribe({
            next: () => {
              this.toastr.info('Success!', 'Supprimé avec succès!');
              this.router.navigate(['layouts/cohortes/cohorte-list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            }
          });
      }
    }

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

  statutLIst: string[] = StatutList;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditCohorteDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private cohorteService: CohorteService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      name_cohorte: [''],
      contrat_ref: [''],
      montant_global: [''],
      statut: [''],
    }); 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.cohorteService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            name_cohorte: item.name_cohorte,
            contrat_ref: item.contrat_ref,
            montant_global: item.montant_global,
            statut: item.statut,
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
          this.isLoading = false;
          this.toastr.success('Modification enregistré!', 'Success!');
          window.location.reload();
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

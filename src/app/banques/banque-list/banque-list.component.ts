import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { BanqueService } from '../banque.service';
import { BanqueModel } from '../models/banque.model';
import { UserModel } from 'src/app/users/models/user.model'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model'; 
import { PlanRemboursementModel } from 'src/app/beneficiaires/models/plan_remousement.model';
import { LogUserService } from 'src/app/logs/log-user.service';

@Component({
  selector: 'app-banque-list',
  templateUrl: './banque-list.component.html',
  styleUrls: ['./banque-list.component.scss']
})
export class BanqueListComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'name_banque', 'email', 'telephone', 'update_created'];
  
  banque: BanqueModel;
  
  ELEMENT_DATA: BeneficiaireModel[] = [];
  remvoursementList: PlanRemboursementModel[] = [];

  isLoading = false; 

  currentUser: UserModel | any; 

  totalCreditAccorde = 0; 
  pourcent = 0;

  totalGarantie = 0; 
  interet = 0;
  montant_A_Rembourser = 0;
  montantRembourse = 0;
  reste_A_Rembourser = 0;

  
  constructor( 
      public themeService: CustomizerSettingsService, 
      private route: ActivatedRoute, 
      private router: Router, 
      private authService: AuthService,
      private banqueService: BanqueService,
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
    this.banqueService.get(Number(id)).subscribe(res => {
      this.banque = res; 
      this.ELEMENT_DATA = this.banque.beneficiaires;
      this.remvoursementList = this.banque.plan_remboursements;


      this.totalGarantie = this.ELEMENT_DATA.reduce(function(sum, value){
        return sum + parseFloat(value.montant_garantie); 
      }, 0);
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
 
      this.reste_A_Rembourser = this.montant_A_Rembourser - this.montantRembourse;
      this.isLoading = false;
    });
  }

 
  

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.logService.createLog(
        this.currentUser.id, 
        'Delete', 
        'User', 
        `${this.banque.name_banque}`,
        'Suppression de la banque.'
      ).subscribe(() => {
        this.banqueService
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

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditBanqueDialogBox, {
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
  selector: 'create-banque-dialog',
  templateUrl: './create-banque-dialog.html', 
})
export class CreateBanqueDialogBox {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 

  constructor(
    public dialogRef: MatDialogRef<CreateBanqueDialogBox>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private banqueService: BanqueService, 
    private logService: LogUserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    this.formGroup = this._formBuilder.group({
      name_banque: ['', Validators.required],
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          name_banque: this.capitalizeTest(this.formGroup.value.name_banque),
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
        };
        this.banqueService.create(body).subscribe({
          next: (res) => {
            this.logService.createLog(
              this.currentUser.id, 
              'Create', 
              'Banque', 
              `${res.name_banque}`, 
              'Création d\'une banque.'
            ).subscribe(() => {
              this.isLoading = false;
              this.formGroup.reset();
              this.toastr.success('Ajouter avec succès!', 'Success!');
              this.close();
            });
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


  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }


  close(){
    this.dialogRef.close(true);
  }

}


@Component({
  selector: 'edit-banque-dialog',
  templateUrl: './banque-edit.html',
})
export class EditBanqueDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditBanqueDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private banqueService: BanqueService,
      private logService: LogUserService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      name_banque: [''],
    }); 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.banqueService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            name_banque: item.name_banque,
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
      this.banqueService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
      .subscribe({
        next: (res) => {
          this.logService.createLog(
            this.currentUser.id, 
            'Update', 
            'Banque', 
            `${res.name_banque}`, 
            'Modification de la banque.'
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

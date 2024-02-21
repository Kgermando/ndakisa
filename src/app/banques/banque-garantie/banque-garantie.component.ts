import { Component, Inject, Input, OnInit } from '@angular/core';
import { BanqueModel } from '../models/banque.model';
import { BanqueCohorteService } from '../banque-cohorte.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CohorteService } from 'src/app/cohortes/cohorte.service';
import { LogUserService } from 'src/app/logs/log-user.service';
import { ToastrService } from 'ngx-toastr';
import { CohorteModel } from 'src/app/cohortes/models/cohorte.model';
import { UserModel } from 'src/app/users/models/user.model';
import { BanqueCohorteGarantieModel } from '../models/banque-cohorte.model';

@Component({
  selector: 'app-banque-garantie',
  templateUrl: './banque-garantie.component.html',
  styleUrls: ['./banque-garantie.component.scss']
})
export class BanqueGarantieComponent implements OnInit { 
  @Input() item: BanqueModel; 
  @Input() currentUser: UserModel; 

  guarantieBanqueList:BanqueCohorteGarantieModel[] = [];

  constructor(
    private router: Router,
    private banqueCohorteService: BanqueCohorteService,
    private logService: LogUserService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void { 
    this.banqueCohorteService.refreshDataList$.subscribe(() => {
      this.getAllData();
    });
    this.getAllData();
  }

  getAllData() {
    this.banqueCohorteService.getGuarantieBanque(this.item.id).subscribe(res => { 
      this.guarantieBanqueList = res; 
    });
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.logService.createLog(
        this.currentUser.id, 
        'Delete', 
        'User', 
        `${this.item.name_banque}`,
        'Suppression de la banque.'
      ).subscribe(() => {
        this.banqueCohorteService
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


  openBanqueCohorteDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(CreateBanqueCohorteDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  }

  openEditBanqueCohorteDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditBanqueCohorteDialogBox, {
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
  selector: 'create-banque-cohorte-dialog',
  templateUrl: './create-banque-cohorte-dialog.html', 
})
export class CreateBanqueCohorteDialogBox {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 

  cohorteList: CohorteModel[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateBanqueCohorteDialogBox>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private banqueCohorteService: BanqueCohorteService,
    private cohorteService: CohorteService,
    private logService: LogUserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.cohorteService.getAllNav().subscribe(res => {
          this.cohorteList = res;
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    this.formGroup = this._formBuilder.group({ 
      cohorte: ['', Validators.required],
      montant_garantie: ['', Validators.required],
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          banque: parseInt(this.data['id']),
          cohorte: this.formGroup.value.cohorte,
          montant_garantie: this.formGroup.value.montant_garantie,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
        };
        this.banqueCohorteService.create(body).subscribe({
          next: (res) => {
            this.logService.createLog(
              this.currentUser.id, 
              'Create', 
              'Banque-Cohorte', 
              `${res.name_banque}`, 
              'Ajout de la guarantie.'
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
  selector: 'edit-banque-cohorte-dialog',
  templateUrl: './banque-cohorte-edit.html',
})
export class EditBanqueCohorteDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;  

  cohorteList: CohorteModel[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditBanqueCohorteDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private banqueCohorteService: BanqueCohorteService,
      private cohorteService: CohorteService,
      private logService: LogUserService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      cohorte: [''],
      montant_garantie: [''],
    }); 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.cohorteService.getAllNav().subscribe(res => {
          this.cohorteList = res;
        });
        this.banqueCohorteService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            cohorte: item.cohorte,
            montant_garantie: item.montant_garantie,
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
      this.banqueCohorteService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
      .subscribe({
        next: (res) => {
          this.logService.createLog(
            this.currentUser.id, 
            'Update', 
            'Banque-Cohorte', 
            `${res.name_banque}`, 
            'Modification de la garantie.'
          ).subscribe(() => {
            this.isLoading = false;
            this.toastr.success('Modification enregistré!', 'Success!');
            this.close();
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

  compareFn(c1: CohorteModel, c2: CohorteModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}

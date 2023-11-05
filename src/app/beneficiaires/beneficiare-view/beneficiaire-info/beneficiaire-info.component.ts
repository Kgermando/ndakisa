import { Component, Inject, Input, OnInit } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { BeneficiaireModel } from '../../models/beneficiaire.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserModel } from 'src/app/users/models/user.model';
import { BeneficiareService } from '../../beneficiare.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-beneficiaire-info',
  templateUrl: './beneficiaire-info.component.html',
  styleUrls: ['./beneficiaire-info.component.scss']
})
export class BeneficiaireInfoComponent {
  @Input('beneficiaire') beneficiaire: BeneficiaireModel;
  @Input() currentUser: UserModel; 
  
    constructor(
      public themeService: CustomizerSettingsService,
      public dialog: MatDialog,
  ) {}


  openEditStatutDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditStatutBeneficiaireDialogBox, {
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
  selector: 'edit-staut-beneficiaire-dialog',
  templateUrl: './staut-beneficiaire-edit.html',
})
export class EditStatutBeneficiaireDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;

  statutList = ['En cours', 'interrompu', 'Complete'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditStatutBeneficiaireDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private beneficiareService: BeneficiareService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      statut: [''], 
    }); 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.beneficiareService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
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
      this.beneficiareService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Statut modifié!', 'Success!');
          this.close();
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
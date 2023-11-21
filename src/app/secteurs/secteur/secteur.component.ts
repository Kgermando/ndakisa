import { Component, Inject, OnInit } from '@angular/core';
import { SecteurService } from '../secteur.service';
import { SecteurModel } from '../models/secteur.model';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { LogUserService } from 'src/app/logs/log-user.service';
import { UserModel } from 'src/app/users/models/user.model';

@Component({
  selector: 'app-secteur',
  templateUrl: './secteur.component.html',
  styleUrls: ['./secteur.component.scss']
})
export class SecteurComponent implements OnInit {

  secteurList: SecteurModel[] = [];

  isLoading = false;
  formGroup!: FormGroup;
  currentUser: UserModel | any; 

  constructor(
    public themeService: CustomizerSettingsService,  
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService, 
    private secteurService: SecteurService,
    private logService: LogUserService,
    public dialog: MatDialog,
    private toastr: ToastrService) {}


  ngOnInit(): void {  
    this.formGroup = this.formBuilder.group({  
      name_secteur: ['', Validators.required],
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.secteurService.refreshDataList$.subscribe(() => {
          this.getAllData();
        });
        this.getAllData();  
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });  
  }

  getAllData() {
    this.secteurService.getAll().subscribe((res) => {
        this.secteurList = res;
      }
    );
  }

  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          name_secteur: this.capitalizeTest(this.formGroup.value.name_secteur),
          statut: true,
          signature: this.currentUser.matricule, 
          created: new Date(),
          update_created: new Date(),
        };
        this.secteurService.create(body).subscribe({
          next: (res) => {
            this.logService.createLog(
              this.currentUser.id, 
              'Create', 
              'Secteur', 
              `${res.name_secteur}`, 
              'Création d\'un secteur d\'activité.'
            ).subscribe(() => {
              this.isLoading = false;
              this.formGroup.reset(); 
              this.toastr.success('Ajouter avec succès!', 'Success!');
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




  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditSecteurDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  } 

  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }

} 


@Component({
  selector: 'edit-secteur-dialog',
  templateUrl: './secteur-edit.html',
})
export class EditSecteurDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;

  currentUser: UserModel | any; 

  secteur: SecteurModel;

  secteurList: SecteurModel[] = [];
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditSecteurDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private secteurService: SecteurService,
      private logService: LogUserService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      name_secteur: [''],
      statut: [''],
    });
    
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.secteurService.refreshDataList$.subscribe(() => {
          this.getAllData();
        });
        this.getAllData();  
        this.secteurService.get(this.data.id).subscribe(item => {
          this.secteur = item;
            this.formGroup.patchValue({
              name_secteur: this.capitalizeTest(item.name_secteur),
              statut: item.statut,
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

  getAllData() {
    this.secteurService.getAll().subscribe((res) => {
        this.secteurList = res; 
      }
    );
  }



  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        // var body = {
        //   name_secteur: this.formGroup.value.name_secteur,
        //   statut: this.formGroup.value.statut,
        //   signature: this.currentUser.matricule, 
        //   update_created: new Date(),
        // };
        this.secteurService.update(this.data.id, this.formGroup.getRawValue()).subscribe({
          next: () => {
            this.logService.createLog(
              this.currentUser.id, 
              'Update', 
              'Secteur', 
              `${this.secteur.name_secteur}`, 
              'Modification d\'un secteur d\'activité.'
            ).subscribe(() => {
              this.isLoading = false;
              this.formGroup.reset();
              this.toastr.success('Modifier avec succès!', 'Success!');
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

  close(){
      this.dialogRef.close(true);
  } 



  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }


}

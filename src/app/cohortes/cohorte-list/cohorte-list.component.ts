import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { UserModel } from 'src/app/users/models/user.model';
import { CohorteModel } from '../models/cohorte.model';
import { CohorteService } from '../cohorte.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { LogUserService } from 'src/app/users/log-user.service';

@Component({
  selector: 'app-cohorte-list',
  templateUrl: './cohorte-list.component.html',
  styleUrls: ['./cohorte-list.component.scss']
})
export class CohorteListComponent implements OnInit {
  isLoading = false;
  currentUser: UserModel | any; 

  cohorteList: CohorteModel[] = [];

  constructor(
    public themeService: CustomizerSettingsService, 
    private cohorteService: CohorteService, 
    public dialog: MatDialog, 
  ) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.cohorteService.refreshDataList$.subscribe(() => {
      this.getAllData();
    });
    this.getAllData();
  }

  getAllData() {
    this.cohorteService.getAll().subscribe(res => {
      this.cohorteList = res;  
      this.isLoading = false;
    }); 
  }
 
 
  openCreateDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateCohorteDialogBox, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration
    });
  }

  openExportDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CohorteExportXLSXDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  }

  toggleTheme() {
      this.themeService.toggleTheme();
  }
}


@Component({
  selector: 'create-cohorte-dialog',
  templateUrl: './create-cohorte-dialog.html', 
})
export class CreateCohorteDialogBox {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 

  constructor(
    public dialogRef: MatDialogRef<CreateCohorteDialogBox>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private cohorteService: CohorteService,
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
      name_cohorte: ['', Validators.required],
      contrat_ref: ['', Validators.required],
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          name_cohorte: this.capitalizeTest(this.formGroup.value.name_cohorte),
          contrat_ref: this.formGroup.value.contrat_ref, 
          statut_cohorte: 'Ouverte',
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
        };
        this.cohorteService.create(body).subscribe({
          next: (res) => {
            this.logService.createLog(
              this.currentUser.id, 
              'Create', 
              'Cohorte', 
              `${res.name_cohorte}`, 
              'Création d\'une cohorte.'
            ).subscribe(() => {
              this.isLoading = false;
              this.formGroup.reset();
              this.toastr.success('Ajouter avec succès!', 'Success!');
              this.close();
              // this.router.navigate(['/layouts/cohortes/cohorte-list']);
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
  selector: 'cohorte-export-xlsx-dialog',
  templateUrl: './cohorte-export-xlsx.html',
})
export class CohorteExportXLSXDialogBox implements OnInit {
  isLoading = false;
  currentUser: UserModel | any;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor( 
      public dialogRef: MatDialogRef<CohorteExportXLSXDialogBox>, 
      private toastr: ToastrService,
      private cohorteService: CohorteService, 
      private router: Router,
      private authService: AuthService,
      private logService: LogUserService,
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
  }

  

  onSubmit() {
    this.isLoading = true; 
    var dateNow = new Date();
    var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
    var start_date = formatDate(this.dateRange.value.start, 'yyyy-MM-dd', 'en-US');
    var end_date = formatDate(this.dateRange.value.end, 'yyyy-MM-dd', 'en-US') ;
    this.cohorteService.downloadReport(
        start_date,
        end_date
      ).subscribe({
      next: (res) => {
        this.logService.createLog(
          this.currentUser.id, 
          'Export', 
          'Cohorte', 
          `De ${start_date} A ${end_date}`, 
          'Exportation des données.'
        ).subscribe(() => {
          this.isLoading = false;
          const blob = new Blob([res], {type: 'text/xlsx'});
          const downloadUrl = window.URL.createObjectURL(res);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `Cohortes-${dateNowFormat}.xlsx`;
          link.click(); 
          this.toastr.success('Success!', 'Extraction effectuée!');
          // window.location.reload();
          this.close();
        }); 
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
        console.log(err);
        this.close();
      }
    });
  } 


  close(){
      this.dialogRef.close(true);
  } 

}
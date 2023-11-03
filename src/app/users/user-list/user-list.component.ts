import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service'; 
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common'; 
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'matricule', 'fullname', 'email', 'telephone', 'sexe', 'id'];
  
  ELEMENT_DATA: UserModel[] = [];
  
  dataSource = new MatTableDataSource<UserModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<UserModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  isLoading = false;
  currentUser: UserModel | any; 
  
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private userService: UserService, 
      public dialog: MatDialog,
      private toastr: ToastrService,
  ) {}



  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user; 
          this.userService.getAll().subscribe(res => {
              this.ELEMENT_DATA = res; 
              this.dataSource = new MatTableDataSource<UserModel>(this.ELEMENT_DATA);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.isLoading = false;
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });

      
    }

 
  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) { 
      if (sortState.direction) {
          this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
          this._liveAnnouncer.announce('Sorting cleared');
      }
  }


  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(UserUploadCSVDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 


  openExportDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(UserExportXLSXDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  }

  downloadModelReport() {
    try {
      this.isLoading = true;
      this.userService.downloadModelReport().subscribe({
      next: (res) => {
        this.isLoading = false; 
        const downloadUrl = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `Votre_model_users.xlsx`;
        link.click(); 
        this.toastr.info('Extraction effectuée!', 'Info!'); 
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
        console.log(err); 
      }
    });
    } catch (error) {
      
    }
  } 


  toggleTheme() {
    this.themeService.toggleTheme();
  }


}




@Component({
  selector: 'user-upload-csv-dialog',
  templateUrl: './user-upload-csv.html',
})
export class UserUploadCSVDialogBox {
  isLoading = false; 

  constructor( 
      public dialogRef: MatDialogRef<UserUploadCSVDialogBox>, 
      private toastr: ToastrService,
      private userService: UserService,
  ) {}

  upload(event: Event) {
    this.isLoading = true;
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log({files});

    const file = files.item(0);
    const data = new FormData();
    // @ts-ignore
    data.append('file', file); 

    this.userService.uploadCSV(data).subscribe({
      next: () => { 
        window.location.reload();
        this.toastr.success('Success!', 'Ajouté avec succès!');
        this.isLoading = false; 
        // this.close();
      },
      error: (e) => {
        this.isLoading = false;
        this.close();
        this.toastr.error(`${e.error.message}`, 'Oupss!');
        window.alert(e.error.message);
        console.log(e);
        
      }
    });
  } 


  close(){
      this.dialogRef.close(true);
  } 

}

 
@Component({
  selector: 'user-export-xlsx-dialog',
  templateUrl: './user-export-xlsx.html',
})
export class UserExportXLSXDialogBox implements OnInit {
  isLoading = false;
  currentUser: UserModel | any;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor( 
      public dialogRef: MatDialogRef<UserExportXLSXDialogBox>, 
      private toastr: ToastrService,
      private userService: UserService, 
      private router: Router,
      private authService: AuthService,
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
    this.userService.downloadReport(
        start_date,
        end_date
      ).subscribe({
      next: (res) => {
        this.isLoading = false;
        const blob = new Blob([res], {type: 'text/xlsx'});
        const downloadUrl = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `users-${dateNowFormat}.xlsx`;
        link.click();


        this.toastr.success('Success!', 'Extraction effectuée!');
        // window.location.reload();
        this.close();
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
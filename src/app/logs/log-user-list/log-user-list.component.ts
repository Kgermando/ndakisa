import { Component, OnInit } from '@angular/core';
import { LogUserModel } from '../models/log_user.model';
import { LogUserService } from 'src/app/logs/log-user.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common'; 
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserModel } from 'src/app/users/models/user.model';

@Component({
  selector: 'app-log-user-list',
  templateUrl: './log-user-list.component.html',
  styleUrls: ['./log-user-list.component.scss']
})
export class LogUserListComponent implements OnInit {
  isLoading: boolean = false;
  logUserList: LogUserModel[] = [];
  
  dateRange!: FormGroup;
  start_date: string;
  end_date: string; 

  lastPage: number;

  constructor(private logService: LogUserService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    var date = new Date(); 
    var tomorrow = new Date(date);
    tomorrow.setDate(date.getDate()+1);
    // tomorrow.toLocaleDateString();
 
    this.dateRange = this._formBuilder.group({
      start: new FormControl(new Date()),
      end: new FormControl(tomorrow),
    });
 
    this.start_date = formatDate(this.dateRange.value.start, 'yyyy-MM-dd', 'en-US');
    this.end_date = formatDate(this.dateRange.value.end, 'yyyy-MM-dd', 'en-US');

    if (this.start_date && this.end_date) {
      this.getAllData();
    } 

    this.onChanges();
  }


  onChanges(): void {
    this.dateRange.valueChanges.subscribe(val => {
      this.start_date = formatDate(val.start, 'yyyy-MM-dd', 'en-US');
      this.end_date = formatDate(val.end, 'yyyy-MM-dd', 'en-US');

      console.log('start_date 1', this.start_date);
      console.log('end_date 1', this.end_date);

      this.logService.refreshDataList$.subscribe(() => {
        this.getAllData();
      });
      this.getAllData();  
 
    });
  } 

  getAllData() {
    this.logService.allGetLog(this.start_date, this.end_date).subscribe((res) => {
        this.logUserList = res;
      }
    );
  }


  // load(page = 1): void {
  //   this.isLoading = true;
  //   this.logService.allFilter(this.start_date, this.end_date, page).subscribe(res => {
  //       this.logUserList = res.data; 
  //       this.lastPage = res.meta.last_page;
  //       this.isLoading = false;
  //       // load image
  //       // this.products.map(product => {
  //       //   if (!product.image.startsWith("http")) // if it's not an image link from the internet, it was an uploaded image
  //       //     product.image = `${environment.api}/uploads/${product.image}`;
  //       // });
  //     }
  //   );
  // }



  openExportDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(LogExportXLSXDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  }
 
}



@Component({
  selector: 'log-export-xlsx-dialog',
  templateUrl: './log-export-xlsx.html',
})
export class LogExportXLSXDialogBox implements OnInit {
  isLoading = false;
  currentUser: UserModel | any;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor( 
      public dialogRef: MatDialogRef<LogExportXLSXDialogBox>, 
      private toastr: ToastrService,
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
    this.logService.downloadReport(
        start_date,
        end_date
      ).subscribe({
      next: (res) => {
        this.logService.createLog(
          this.currentUser.id, 
          'Export', 
          'Journal', 
          `De ${start_date} A ${end_date}`, 
          'Exportation des données.'
        ).subscribe(() => {
          this.isLoading = false;
          const blob = new Blob([res], {type: 'text/xlsx'});
          const downloadUrl = window.URL.createObjectURL(res);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `Journal-${dateNowFormat}.xlsx`;
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
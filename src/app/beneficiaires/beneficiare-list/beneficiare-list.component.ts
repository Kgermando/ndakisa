import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BeneficiaireModel } from '../models/beneficiaire.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BeneficiareService } from '../beneficiare.service';
import { UserModel } from 'src/app/users/models/user.model'; 
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanRemboursementModel } from '../models/plan_remousement.model';
import { ToastrService } from 'ngx-toastr';
import { LogUserService } from 'src/app/logs/log-user.service';
import { Papa } from 'ngx-papaparse';
import { PlanRemboursementService } from '../plan_remboursement.service';

@Component({
  selector: 'app-beneficiare-list',
  templateUrl: './beneficiare-list.component.html',
  styleUrls: ['./beneficiare-list.component.scss']
})
export class BeneficiareListComponent implements OnInit {
  displayedColumns: string[] = ['identifiant', 'name_beneficiaire', 'montant_a_rembourser', 'montant_rembourser', 'reste_a_rembourser', 'statut'];

  isLoading = false;
  currentUser: UserModel | any; 
  
  ELEMENT_DATA: BeneficiaireModel[] = []; 
 
  dataSource = new MatTableDataSource<BeneficiaireModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<BeneficiaireModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  montant_payer = 0;

  constructor(
    private _liveAnnouncer: LiveAnnouncer, 
    private router: Router,
    private authService: AuthService,
    private beneficiareService: BeneficiareService, 
  ) {}


  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user; 
          this.beneficiareService.refreshDataList$.subscribe(() => {
            this.getAllData();
          });
          this.getAllData();
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      }
    );
  }

  getAllData() {
    this.beneficiareService.getAll().subscribe(res => {
      this.ELEMENT_DATA = res; 
      this.dataSource = new MatTableDataSource<BeneficiaireModel>(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
        this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}



@Component({
  selector: 'remboursement-upload-csv-dialog',
  templateUrl: './remboursement-upload-csv.html',
})
export class RemboursementUploadCSVDialogBox implements OnInit {
  isLoading = false;
  remboursementList: PlanRemboursementModel[] = [];
  remboursement: PlanRemboursementModel;
  currentUser: UserModel; 
  beneficiare: BeneficiaireModel;
 
  duree_credit = 0;

  systeme_remboursement: any;


  pourcent = 0;

  @ViewChild('csvReader') csvReader: any;

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<RemboursementUploadCSVDialogBox>, 
      private toastr: ToastrService,
      private router: Router,
      private authService: AuthService, 
      private planRemboursementService: PlanRemboursementService,
      private papa: Papa,
      private logService: LogUserService, 
  ) {}

  ngOnInit() { 
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

  
  async upload(event: any) {
    const file = event.target.files[0];
    if (this.isValidCSVFile(file)) {
      this.isLoading = true;
      this.papa.parse(file, {
        worker: true,
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        // encoding: 'utf-8',
        complete: (results) => {
          this.remboursementList = results.data;
          if (this.remboursementList.length > 100) {
            this.isLoading = false;
            this.toastr.info('Veuillez reduire les lignes en dessous de 100.', 'Success!');
          } else {
            for (let index = 0; index < this.remboursementList.length; index++) {
              this.remboursement = this.remboursementList[index];

              var body = {
                montant_payer: this.remboursement.montant_payer,
                observation: this.remboursement.observation,
                date_paiement: this.remboursement.date_paiement,
                numero_transaction: this.remboursement.numero_transaction,

                signature: this.currentUser.matricule,
                update_created: new Date(),
              };
              this.planRemboursementService.updateRemboursenent(this.remboursement.numero_transaction, body).subscribe({
                next: () => {
                  var pourcents = (index + 1) * 100 / this.remboursementList.length;
                  this.pourcent = parseInt(pourcents.toFixed(0));
                  if (this.pourcent == 100) {
                    this.isLoading = false;
                    this.toastr.success('Importation effectuée avec succès!', 'Success!');
                  }
                },
                error: (err) => {
                  this.isLoading = false;
                  this.toastr.error(`${err.error.message}`, 'Oupss!');
                  console.log(err);
                  this.close();
                }
              });
            }
            this.logService.createLog(
              this.currentUser.id, 
              'Create', 
              'Plan de remboursement', 
              `${this.beneficiare.name_beneficiaire}`, 
              'Création du plan de remboursement'
            ).subscribe(() => {
              console.log("All done!");
              this.toastr.success('Ajouter avec succès!', 'Success!');
            });
          } 
        },
        error: (error, file) => { 
          this.toastr.error(`${error}`, 'Oupss!');
          console.log(error);
          console.log("file", file);
          // this.close();
        },
      });
    } else {  
      alert("Please import valid .csv file."); 
    }      
  }
 
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  

  close(){
    this.dialogRef.close(true);
  }

}


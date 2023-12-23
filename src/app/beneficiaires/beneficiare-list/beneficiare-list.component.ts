import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BeneficiaireModel } from '../models/beneficiaire.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BeneficiareService } from '../beneficiare.service';
import { UserModel } from 'src/app/users/models/user.model';
import { CohorteExportXLSXDialogBox } from 'src/app/cohortes/cohorte-list/cohorte-list.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-beneficiare-list',
  templateUrl: './beneficiare-list.component.html',
  styleUrls: ['./beneficiare-list.component.scss']
})
export class BeneficiareListComponent implements OnInit {
  displayedColumns: string[] = ['identifiant', 'name_beneficiaire', 'province', 'montant_a_rembourser', 'montant_rembourser', 'reste_a_rembourser', 'statut'];

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
    public themeService: CustomizerSettingsService,
    private router: Router,
    private authService: AuthService,
    private beneficiareService: BeneficiareService,
    private dialog: MatDialog
  ) {}


  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user; 
            this.beneficiareService.getAll().subscribe(res => {
            this.ELEMENT_DATA = res; 
            this.dataSource = new MatTableDataSource<BeneficiaireModel>(this.ELEMENT_DATA);
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
      }
    );
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

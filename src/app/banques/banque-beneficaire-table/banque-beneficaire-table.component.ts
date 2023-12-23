import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BanqueModel } from '../models/banque.model';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';
import { BeneficiareService } from 'src/app/beneficiaires/beneficiare.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-banque-beneficaire-table',
  templateUrl: './banque-beneficaire-table.component.html',
  styleUrls: ['./banque-beneficaire-table.component.scss']
})
export class BanqueBeneficaireTableComponent implements OnInit {
  @Input() item: BanqueModel; 
  
  ELEMENT_DATA: BeneficiaireModel[] = []; 

  searchText: string; 

  displayedColumns: string[] = ['name_cohorte', 'name_beneficiaire', 'sexe', 'province', 'identifiant', 'email', 'telephone'];
  dataSource = new MatTableDataSource<BeneficiaireModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<BeneficiaireModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor( 
    public themeService: CustomizerSettingsService, 
    private _liveAnnouncer: LiveAnnouncer,
    private beneficiareService: BeneficiareService, 
  ) {}

  ngOnInit() { 

    this.beneficiareService.getAllBanque(this.item.id).subscribe(res => {
      this.ELEMENT_DATA = res; 
      this.ELEMENT_DATA = res; 
      this.dataSource = new MatTableDataSource<BeneficiaireModel>(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
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



  toggleTheme() {
    this.themeService.toggleTheme();
  }

  
}
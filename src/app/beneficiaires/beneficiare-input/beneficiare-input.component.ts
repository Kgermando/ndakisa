import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BeneficiaireModel } from '../models/beneficiaire.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-beneficiare-input',
  templateUrl: './beneficiare-input.component.html',
  styleUrls: ['./beneficiare-input.component.scss']
})
export class BeneficiareInputComponent implements OnInit {
  @Input('ELEMENT_DATA') ELEMENT_DATA: BeneficiaireModel[] = [];

  displayedColumns: string[] = ['cohorte', 'name_beneficiaire', 'identifiant', 'telephone', 'sexe', 'province'];
  
  
  dataSource = new MatTableDataSource<BeneficiaireModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<BeneficiaireModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor( 
    private _liveAnnouncer: LiveAnnouncer,) {}

  ngOnInit(): void {  
    this.dataSource = new MatTableDataSource<BeneficiaireModel>(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
   
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


}

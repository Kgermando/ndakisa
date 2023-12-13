import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
export class BeneficiareInputComponent implements OnChanges {
  @Input('ELEMENT_DATA') ELEMENT_DATA: BeneficiaireModel[] = []; 

  
  searchText: string; 

  ngOnChanges(changes: SimpleChanges): void { } 

 
}

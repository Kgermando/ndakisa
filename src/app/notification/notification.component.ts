import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from './notification.service';
import { NotificationModel } from './models/notification.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  displayedColumns: string[] = ['identifiant', 'name_beneficiaire', 'montant_a_rembourser', 'montant_rembourser', 'reste_a_rembourser', 'statut'];
  isLoading: boolean = false;
  monthList: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
   ]; 
  
  ELEMENT_DATA: any[] = []; 
 
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  montant_payer = 0;

  month = '1';
  nombreBeneficiaireInsolvable = 0;

  constructor(
    private _liveAnnouncer: LiveAnnouncer, 
    private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.isLoading = true;
    if (this.month == '1') {
      this.getAllData(this.month);
    }
  }


  onChange(event: any) {
    console.log('event', event.value);
    this.month = event.value;
    this.notificationService.refreshDataList$.subscribe(() => {
      this.getAllData(this.month);
    });
    this.getAllData(this.month);
    
  }


  getAllData(month: string) {
    this.notificationService.getInsolvables(month).subscribe(res => {
      this.ELEMENT_DATA = res; 
      this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.nombreBeneficiaireInsolvable = this.ELEMENT_DATA.length;
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

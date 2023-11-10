import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-stats-nombre',
  templateUrl: './stats-nombre.component.html',
  styleUrls: ['./stats-nombre.component.scss']
})
export class StatsNombreComponent implements OnInit {
  @Input() start_date: string;
  @Input() end_date: string;

  totalGarantieList: any[] = [];
  totalGarantie = 70000;
  totalCreditAccordeList: any[] = [];
  totalCreditAccorde = 62500;
  totalARembourserList: any[] = [];
  totalARembourser = 64500;
  totalRembourseList: any[] = [];
  totalRembourse = 21500;
  resteARembourserList: any[] = [];
  resteARembourser = 21500;

  constructor(
    private dashboardService: DashboardService
  ) {}

  // console.log('start_date', this.start_date);
  // console.log('end_date', this.end_date);
  ngOnInit(): void { 
    this.dashboardService.totalGarantie(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalGarantieList = res;
        this.totalGarantieList.map((item: any) => this.totalGarantie = parseFloat(item.montant_garantie));
      }
    );
    this.dashboardService.totalCreditAccorde(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalCreditAccordeList = res;
        this.totalCreditAccordeList.map((item: any) => this.totalCreditAccorde = parseFloat(item.credit_accorde));
      }
    );
    this.dashboardService.totalARembourser(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalARembourserList = res;
        this.totalARembourserList.map((item: any) => this.totalARembourser = parseFloat(item.montant_a_rembourser));
      }
    );
    this.dashboardService.totalRembourse(this.start_date, this.end_date).subscribe(
      res =>  {
        this.totalRembourseList = res;
        this.totalRembourseList.map((item: any) => this.totalRembourse = parseFloat(item.montant_payer));
      }
     );
    this.dashboardService.resteARembourse(this.start_date, this.end_date).subscribe(
      res =>  {
        this.resteARembourserList = res;
        this.resteARembourserList.map((item: any) => this.resteARembourser = parseFloat(item.reste_a_rembourser));
      }
    );
  }
    
}

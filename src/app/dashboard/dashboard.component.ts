import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomizerSettingsService } from '../common/customizer-settings/customizer-settings.service';
import { DashboardService } from './dashboard.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dateRange!: FormGroup;
  start_date: string;
  end_date: string; 

  totalBeneficiaireList: any[] = [];
  totalBeneficiaire = 0;
  totalCohorteList: any[] = [];
  totalCohorte = 0;
  totalBanqueList: any[] = [];
  totalBanque = 0;

  tauxParticipatiionProvinceList:any[] = []; 

  constructor(
    public themeService: CustomizerSettingsService,
    private _formBuilder: FormBuilder,
    private dashboardService: DashboardService
  ) {}


  ngOnInit(): void { 
    var date = new Date();
    var tomorrow = new Date(date);
    tomorrow.setDate(date.getDate()+1);
    // tomorrow.toLocaleDateString();

    this.start_date = formatDate(new Date('2023-08-01'), 'yyyy-MM-dd', 'en-US');
    this.end_date = formatDate(tomorrow, 'yyyy-MM-dd', 'en-US');

    this.dateRange = this._formBuilder.group({
      start: new FormControl(new Date('2023-08-01')),
      end: new FormControl(tomorrow),
    }); 
    

    this.dashboardService.totalBeneficiaire().subscribe(
      res =>  {
        this.totalBeneficiaireList = res;
        this.totalBeneficiaireList.map((item: any) => this.totalBeneficiaire = parseFloat(item.total));
      }
    );
    this.dashboardService.totalCohorte().subscribe(
      res =>  {
        this.totalCohorteList = res;
        this.totalCohorteList.map((item: any) => this.totalCohorte = parseFloat(item.total));
      }
    );
    this.dashboardService.totalBanque().subscribe(
      res =>  {
        this.totalBanqueList = res;
        this.totalBanqueList.map((item: any) => this.totalBanque = parseFloat(item.total));
      }
    );

    this.dashboardService.tauxParticipatiionProvince(this.start_date, this.end_date).subscribe(
      res => {
        this.tauxParticipatiionProvinceList = res; 
      }
    ); 

    this.onChanges();
  }

  onChanges(): void {
    this.dateRange.valueChanges.subscribe(val => {
      this.start_date = formatDate(val.start, 'yyyy-MM-dd', 'en-US');
      this.end_date = formatDate(val.end, 'yyyy-MM-dd', 'en-US');

      console.log('start_date', this.start_date);
      console.log('end_date', this.start_date);
    });
  }

  onSubmit() {
    var dateNow = new Date();
    var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
    this.start_date = formatDate(this.dateRange.value.start, 'yyyy-MM-dd', 'en-US');
    this.end_date = formatDate(this.dateRange.value.end, 'yyyy-MM-dd', 'en-US');

 
  } 
 

  toggleTheme() {
      this.themeService.toggleTheme();
  }

  toggleCardBorderTheme() {
      this.themeService.toggleCardBorderTheme();
  }

  toggleCardBorderRadiusTheme() {
      this.themeService.toggleCardBorderRadiusTheme();
  }
}

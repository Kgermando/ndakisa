import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexGrid,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
} from "ng-apexcharts";


export type ChartOption = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  colors: any;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-tranche-age',
  templateUrl: './tranche-age.component.html',
  styleUrls: ['./tranche-age.component.scss']
})
export class TrancheAgeComponent implements OnInit {
  public chartOption: Partial<ChartOption>;
  isLoading = false;

  trancheAgeList: any[] = [];

  constructor(private dashboardService: DashboardService) {
      
  }


  ngOnInit(): void {
      // console.log('start_date', this.start_date);
  // console.log('end_date', this.end_date);
    this.getTrancheAge()
    
  }


  getTrancheAge() {
    this.isLoading = true;
    this.dashboardService.ageBeneficiaires().subscribe(
        res => {
            this.trancheAgeList = res;
            this.chartOption = {
                series: [
                    {
                      data: [
                        {
                          x: "De 18-25 ans",
                          y: this.trancheAgeList.map((item: any) => parseFloat(item['De 18-25 ans'])),
                        },
                        {
                          x: "De 25-35 ans",
                          y: this.trancheAgeList.map((item: any) => parseFloat(item['De 25-35 ans'])),
                        },
                        {
                          x: "De 35-45 ans",
                          y: this.trancheAgeList.map((item: any) => parseFloat(item['De 35-45 ans'])),
                        },
                        {
                          x: "De 45-55 ans",
                          y: this.trancheAgeList.map((item: any) => parseFloat(item['De 45-55 ans'])),
                        },
                        {
                          x: "De 55-65 ans",
                          y: this.trancheAgeList.map((item: any) => parseFloat(item['De 55-65 ans'])),
                        }
                      ]
                    }
                  ],
                chart: {
                    height: 360,
                    type: "bar",
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                bar: {
                    horizontal: true
                }
                },
                xaxis: {
                    type: "category"
                },  
            };
        }
    )
    this.isLoading = false;

  }


  
}

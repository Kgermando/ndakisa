import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class TrancheAgeComponent implements OnChanges {
  @Input() trancheAgeList: any[] = [];
  @Input() isLoading: boolean;
  
  public chartOption: Partial<ChartOption>; 

  ngOnChanges(changes: SimpleChanges): void { 
    this.getTrancheAge();
  }

  getTrancheAge() {
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
                x: "De 55 ans et plus",
                y: this.trancheAgeList.map((item: any) => parseFloat(item['De 55 ans et plus'])),
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


  
}

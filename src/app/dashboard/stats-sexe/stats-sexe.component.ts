import { Component, ViewChild } from "@angular/core";
import {
    ChartComponent,
    ApexNonAxisChartSeries,
    ApexChart,
    ApexStroke,
    ApexTooltip,
    ApexDataLabels,
    ApexLegend,
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    stroke: ApexStroke;
    chart: ApexChart;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    labels: any;
    legend: ApexLegend;
    colors: any;
};


@Component({
  selector: 'app-stats-sexe',
  templateUrl: './stats-sexe.component.html',
  styleUrls: ['./stats-sexe.component.scss']
})
export class StatsSexeComponent {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
      this.chartOptions = {
          series: [59.5, 25],
          chart: {
              height: 315,
              type: "pie"
          },
          stroke: {
              width: 0,
              show: true
          },
          colors: ["#757fef", "#ee368c"],
          dataLabels: {
              enabled: true,
              style: {
                  fontSize: '14px',
              },
              dropShadow: {
                  enabled: false
              }
          },
          tooltip: {
              style: {
                  fontSize: '14px',
              },
              y: {
                  formatter: function(val:any) {
                      return val + "%";
                  }
              }
          },
          legend: {
              offsetY: 5,
              position: "bottom",
              fontSize: "14px",
              labels: {
                  colors: '#5B5B98',
              },
          },
          labels: ["Homme", "Femme"]
      };
  }

}
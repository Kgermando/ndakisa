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
  selector: 'app-stats-banque',
  templateUrl: './stats-banque.component.html',
  styleUrls: ['./stats-banque.component.scss']
})
export class StatsBanqueComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor( 
  ) {
      this.chartOptions = {
          series: [45, 20, 20, 15],
          chart: {
              height: 250,
              type: "pie"
          },
          stroke: {
              width: 0,
              show: true
          },
          colors: [
              "#757FEF", "#90C6E0", "#E040FB", "#E9EFFC"
          ],
          dataLabels: {
              enabled: false,
              style: {
                  fontSize: '14px'
              },
              dropShadow: {
                  enabled: false
              }
          },
          tooltip: {
              style: {
                  fontSize: '14px'
              },
              y: {
                  formatter: function(val:any) {
                      return val + "%";
                  }
              }
          },
          legend: {
              offsetY: 0,
              show: true,
              position: "bottom",
              fontSize: "14px",
              labels: {
                  colors: '#5B5B98',
              },
          },
          labels: ["Target", "Last Week", "Last Month", "Last Year"]
      };
  }

}

import { Component, Input, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

import {
    ApexNonAxisChartSeries,
    ApexTooltip,
    ApexLegend,
    ApexStroke,
    ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    labels: any;
    colors: any;
};


@Component({
  selector: 'app-stats-secteur-activite',
  templateUrl: './stats-secteur-activite.component.html',
  styleUrls: ['./stats-secteur-activite.component.scss']
})
export class StatsSecteurActiviteComponent {
  @Input() start_date: string;
  @Input() end_date: string;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
      this.chartOptions = {
          series: [56.2, 43.8],
          colors: ["#ee368c", "#757fef"],
          chart: {
              height: 365,
              type: "donut"
          },
          tooltip: {
              y: {
                  formatter: function (val) {
                      return "" + val + "%";
                  },
              },
          },
          stroke: {
              width: 1,
              show: true
          },
          legend: {
              offsetY: 0,
              fontSize: "14px",
              position: "bottom",
              horizontalAlign: "center"
          },
          labels: ["Transformation", "Energie"]
      };
  }

}
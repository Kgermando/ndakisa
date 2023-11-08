import { Component, ViewChild } from "@angular/core";
import {
    ApexChart,
    ApexAxisChartSeries,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexGrid
} from "ng-apexcharts";

type ApexXAxis = {
    type?: "category" | "datetime" | "numeric";
    categories?: any;
    labels?: {
        style?: {
            colors?: string | string[];
            fontSize?: string;
        };
    };
};

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    grid: ApexGrid;
    colors: string[];
    legend: ApexLegend;
};
@Component({
  selector: 'app-stats-cohorte-remboursement',
  templateUrl: './stats-cohorte-remboursement.component.html',
  styleUrls: ['./stats-cohorte-remboursement.component.scss']
})
export class StatsCohorteRemboursementComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
      this.chartOptions = {
          series: [
              {
                  name: "distibuted",
                  data: [21, 22, 10, 28, 16, 21, 13, 30, 45, 15, 29]
              }
          ],
          chart: {
              height: 350,
              type: "bar",
              events: {
                  click: function(chart, w, e) {
                      // console.log(chart, w, e)
                  }
              }
          },
          colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a",
              "#D10CE8",
              "#546E7A",
              "#26a69a",
              "#D10CE8",
              "#546E7A",
              "#26a69a",
              "#D10CE8",
              "#FEB019",
              "#26a69a",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#D10CE8"
          ],
          plotOptions: {
              bar: {
                  columnWidth: "45%",
                  distributed: true
              }
          },
          dataLabels: {
              enabled: false
          },
          legend: {
              show: false
          },
          grid: {
              show: false
          },
          xaxis: {
              categories: [
                  ["Session janvier 2023"],
                  ["Session Juin 2023"],
                  ["Session octobre 2023"], 
                  ["Session janvier 2024"], 
                  ["Session Mars 2024"], 
                  ["Session Juin 2024"], 
                  ["Session Septembre 2024"], 
                  ["Session Decemnbre 2024"], 
                  ["Session mars 2025"], 
                  ["Session Juillet 2025"], 
                  ["Session Octobre 2025"], 
              ],
              labels: {
                  style: {
                      colors: [
                          "#008FFB",
                          "#00E396",
                          "#FEB019",
                          "#FF4560",
                          "#775DD0",
                          "#546E7A",
                          "#26a69a",
                          "#D10CE8",
                          "#546E7A",
                          "#26a69a",
                          "#D10CE8",
                          "#546E7A",
                          "#26a69a",
                          "#D10CE8",
                          "#FEB019",
                          "#26a69a",
                          "#00E396",
                          "#FEB019",
                          "#FF4560",
                          "#775DD0",
                          "#D10CE8"
                      ],
                      fontSize: "12px"
                  }
              }
          }
      };
  }

}

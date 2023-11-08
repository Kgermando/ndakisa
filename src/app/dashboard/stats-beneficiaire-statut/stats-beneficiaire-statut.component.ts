import { Component, ViewChild } from "@angular/core"; 
import {
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexChart,
    ApexLegend,
    ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    colors: string[];
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
};


@Component({
  selector: 'app-stats-beneficiaire-statut',
  templateUrl: './stats-beneficiaire-statut.component.html',
  styleUrls: ['./stats-beneficiaire-statut.component.scss']
})
export class StatsBeneficiaireStatutComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor( 
  ) {
      this.chartOptions = {
          series: [100, 90, 80],
          chart: {
              height: 300,
              type: "radialBar"
          },
          plotOptions: {
              radialBar: {
                  offsetY: 0,
                  startAngle: 0,
                  endAngle: 270,
                  hollow: {
                      margin: 10,
                      size: "30%",
                      image: undefined,
                      background: "transparent"
                  },
                  dataLabels: {
                      name: {
                          show: false
                      },
                      value: {
                          show: false
                      }
                  }
              }
          },
          colors: [
              "#757FEF", "#9EA5F4", "#C8CCF9"
          ],
          labels: [
            "Terminer", "En cours", "Interrompu"
          ],
          legend: {
              show: true,
              offsetY: 0,
              offsetX: -20,
              floating: true,
              position: "left",
              fontSize: "14px",
              labels: {
                  colors: '#5B5B98'
              },
              formatter: function(seriesName, opts) {
                  return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
              }
          }
      };
  }
}

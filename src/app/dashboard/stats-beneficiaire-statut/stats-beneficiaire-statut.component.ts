import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core"; 
import {
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexChart,
    ApexLegend,
    ChartComponent
} from "ng-apexcharts";
import { DashboardService } from "../dashboard.service";

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
export class StatsBeneficiaireStatutComponent implements OnChanges {
    @Input() statutBeneficiaireList:any[] = []; 
    @Input() isLoading: boolean;
    
 
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>; 

    ngOnChanges(changes: SimpleChanges): void {
     
        this.getPieStatut();
    }

    getPieStatut() {
        this.chartOptions = {
            series: this.statutBeneficiaireList.map((item: any) => parseFloat(item.count)),
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
            colors: this.statutBeneficiaireList.map((item: any) => {
              if(item.statut == "En attente") {
                  return "#FAAA0C";
              } else if(item.statut == "En cours") {
                  return "#16A046";
              } else if(item.statut == "Interrompu") {
                  return "#FD1760";
              } else if(item.statut == "Terminé") {
                  return "#4378FA";
              } else {
                  return "";
              }
          }),
          labels: this.statutBeneficiaireList.map((item: any) => item.statut),
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

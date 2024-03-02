import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
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
export class StatsSexeComponent implements OnChanges { 
    @Input() sexeList: any = []; 
    @Input() isLoading: boolean;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  ngOnChanges(changes: SimpleChanges) {
    
    this.getPieSexe();
  }

  getPieSexe() {
    this.chartOptions = {
        series: this.sexeList.map((item: any) => parseFloat(item.count)),
        chart: {
            height: 315,
            type: "pie"
        },
        stroke: {
            width: 0,
            show: true
        },
        colors: this.sexeList.map((item: any) => {
            if(item.sexe == "Homme") {
                return "#757fef";
            } else if(item.sexe == "Femme") {
                return "#ee368c";
            } else {
                return "";
            }
        }),
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
                formatter: function(val) { 
                    var beneficiaire = "";
                    if(val > 1) {
                        beneficiaire = "Beneficiaires";
                    } else {
                        beneficiaire = "Beneficiaire";
                    } 
                    return val + " " + beneficiaire;
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
        labels: this.sexeList.map((item: any) => item.sexe)
    };
  }

}
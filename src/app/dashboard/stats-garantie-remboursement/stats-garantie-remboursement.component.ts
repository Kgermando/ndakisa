import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexGrid,
    ApexTooltip
} from "ng-apexcharts"; 

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    colors: any;
    legend: ApexLegend;
};


@Component({
  selector: 'app-stats-garantie-remboursement',
  templateUrl: './stats-garantie-remboursement.component.html',
  styleUrls: ['./stats-garantie-remboursement.component.scss']
})
export class StatsGarantieRemboursementComponent implements OnChanges {
    @Input() remboursementList:any[] = [];
    @Input() isLoading: boolean;
  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;  

  ngOnChanges(changes: SimpleChanges) {
    
    this.getRemboursement();
  }

  getRemboursement() {
    this.chartOptions = {
        series: [
            {
                name: "Total à rembourser",
                data: this.remboursementList.map((item: any) => parseFloat(item.total_a_rembourse)),
            },
            {
                name: "Total remboursé",
                data: this.remboursementList.map((item: any) => parseFloat(item.total_rembourse)),
            },
            {
                name: "Reste à rembourser",
                data: this.remboursementList.map((item: any) => parseFloat(item.reste_a_rembourse)),
            }
        ],
        chart: {
            type: "bar",
            height: 350,
            toolbar: {
                show: false
            }
        },
        colors: ["#757fef", "#2db6f5", "#ee368c"],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 3,
            colors: ["transparent"]
        },
        xaxis: {
            categories: this.remboursementList.map((item: any) => {
                if (item.month == 1) {
                    return 'Jan';
                } else if (item.month == 2) {
                    return 'Fev';
                } else if (item.month == 3) {
                    return 'Mar';
                } else if (item.month == 4) {
                    return 'Avr';
                } else if (item.month == 5) {
                    return 'Mai';
                } else if (item.month == 6) {
                    return 'Jui';
                } else if (item.month == 7) {
                    return 'Juil';
                } else if (item.month == 8) {
                    return 'Aout';
                } else if (item.month == 9) {
                    return 'Sep';
                } else if (item.month == 10) {
                    return 'Oct';
                } else if (item.month == 11) {
                    return 'Nov';
                } else if (item.month == 12) {
                    return 'Dec';
                } else {
                    return item.month;
                }
            }),
            labels: {
                style: {
                    colors: "#a9a9c8",
                    fontSize: "14px",
                }
            }
        },
        yaxis: {
            // title: {
            //     text: "$ (thousands)"
            // },
            labels: {
                style: {
                    colors: "#a9a9c8",
                    fontSize: "14px",
                }
            },
            axisBorder: {
                show: false
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val + " " + "usd";
                }
            }
        },
        legend: {
            offsetY: 0,
            position: "bottom",
            fontSize: "14px",
            horizontalAlign: "center",
            labels: {
                colors: '#5B5B98'
            }
        },
        grid: {
            show: true,
            strokeDashArray: 5,
            borderColor: "#EDEFF5"
        }
    }; 
   }

}

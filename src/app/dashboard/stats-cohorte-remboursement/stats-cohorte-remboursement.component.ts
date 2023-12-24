import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
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
export class StatsCohorteRemboursementComponent implements OnChanges {
    @Input() cohorteList: any = [];
    @Input() isLoading: boolean;
  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
 
 
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.getCohorteChart();
  }


 getCohorteChart() {
    this.chartOptions = {
        series: [
            {
                name: "Beneficiares",
                data: this.cohorteList.map((item: any) => parseFloat(item.beneficiaire)),
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
        // colors: [
        //     "#008FFB",
        //     "#00E396",
        //     "#FEB019",
        //     "#FF4560",
        //     "#775DD0",
        //     "#546E7A",
        //     "#26a69a",
        //     "#D10CE8",
        //     "#546E7A",
        //     "#26a69a",
        //     "#D10CE8",
        //     "#546E7A",
        //     "#26a69a",
        //     "#D10CE8",
        //     "#FEB019",
        //     "#26a69a",
        //     "#00E396",
        //     "#FEB019",
        //     "#FF4560",
        //     "#775DD0",
        //     "#D10CE8"
        // ],
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
            categories: this.cohorteList.map((item: any) => item.name_cohorte),
            labels: {
                style: {
                    // colors: [
                    //     "#008FFB",
                    //     "#00E396",
                    //     "#FEB019",
                    //     "#FF4560",
                    //     "#775DD0",
                    //     "#546E7A",
                    //     "#26a69a",
                    //     "#D10CE8",
                    //     "#546E7A",
                    //     "#26a69a",
                    //     "#D10CE8",
                    //     "#546E7A",
                    //     "#26a69a",
                    //     "#D10CE8",
                    //     "#FEB019",
                    //     "#26a69a",
                    //     "#00E396",
                    //     "#FEB019",
                    //     "#FF4560",
                    //     "#775DD0",
                    //     "#D10CE8"
                    // ],
                    fontSize: "12px"
                }
            }
        }
    };
   
 }

}

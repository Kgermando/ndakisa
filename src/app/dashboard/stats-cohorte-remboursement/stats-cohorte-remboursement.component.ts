import { Component, Input, OnInit, ViewChild } from "@angular/core";
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
import { DashboardService } from "../dashboard.service";

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
export class StatsCohorteRemboursementComponent implements OnInit {
    @Input() start_date: string;
  @Input() end_date: string;
  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;


  isLoading = false;

  cohorteList: any = [];

  constructor(private dashboardService: DashboardService ) {
    
  }

  ngOnInit(): void {
    // console.log('start_date', this.start_date);
 // console.log('end_date', this.end_date);

   this.getCohorteChart();
 }

 getCohorteChart() {
    this.isLoading = true;
    this.dashboardService.remboursementCohorte(this.start_date, this.end_date).subscribe(
        res => {
            this.cohorteList = res;
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
            this.isLoading = false;
        }
    )
   
 }

}

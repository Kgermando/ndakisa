import { Component, Input, ViewChild } from "@angular/core";
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexStroke,
    ApexYAxis,
    ApexGrid,
    ApexTitleSubtitle,
    ApexLegend
} from "ng-apexcharts";
import { DashboardService } from "../dashboard.service";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    tooltip: any;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    legend: ApexLegend;
    title: ApexTitleSubtitle;
    colors: any;
};

@Component({
  selector: 'app-stats-progress',
  templateUrl: './stats-progress.component.html',
  styleUrls: ['./stats-progress.component.scss']
})
export class StatsProgressComponent {
    @Input() start_date: string;
    @Input() end_date: string;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  isLoading = false;  
  progressionRemboursementHommeList: any[] = [];
  progressionRemboursementFemmeList: any[] = [];
  progressionRemboursementDateList: any[] = [];

  constructor(private dashboardService: DashboardService) {
      
  }

  ngOnInit(): void {
    // console.log('start_date', this.start_date);
    // console.log('end_date', this.end_date);

     this.getProgression();
    }

    getProgression() {
        this.isLoading = true;
        this.dashboardService.progressionRemboursementSexeDate(this.start_date, this.end_date).subscribe(
            res => {
                this.dashboardService.progressionRemboursementSexeHomme(this.start_date, this.end_date).subscribe(
                    h => {
                        this.dashboardService.progressionRemboursementSexeFemme(this.start_date, this.end_date).subscribe(
                            f => {
                                this.progressionRemboursementDateList = res;
                                this.progressionRemboursementHommeList = h;
                                this.progressionRemboursementFemmeList = f;
                                
                this.chartOptions = { 
                    series: [
                        {
                            name: "Homme",
                            data: this.progressionRemboursementHommeList.map((item: any) => parseFloat(item.montant_payer)),
                        },
                        {
                            name: "Femme",
                            data: this.progressionRemboursementFemmeList.map((item: any) => parseFloat(item.montant_payer)),
                        }
                    ],
                    // series: [
                    //     {
                    //         name: "Homme",
                    //         data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51]
                    //     },
                    //     {
                    //         name: "Femme",
                    //         data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56]
                    //     }
                    // ],
                    chart: {
                        height: 300,
                        type: "line",
                        toolbar: {
                            show: false,
                        }
                    },
                    colors: ["#757fef", "#ee368c"],
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: 3,
                        curve: "smooth",
                    },
                    legend: {
                        offsetY: 3,
                        position: "top",
                        fontSize: "14px",
                        horizontalAlign: "center",
                        labels: {
                            colors: '#5B5B98',
                        },
                    },
                    yaxis: {
                        tickAmount: 4,
                        labels: {
                            style: {
                                colors: "#a9a9c8",
                                fontSize: "14px",
                            },
                        },
                        axisBorder: {
                            show: false,
                        },
                    },
                    xaxis: {
                        axisBorder: {
                            show: false,
                        },
                        labels: {
                            trim: false,
                            style: {
                                colors: "#a9a9c8",
                                fontSize: "14px",
                            },
                        },
                        categories: this.progressionRemboursementDateList.map((item: any) => item.month),
                    },
                    tooltip: {
                        y: {
                            formatter: function(val:any) {
                                return val + " usd";
                            }
                        }
                    },
                    grid: {
                        show: true,
                        borderColor: "#EDEFF5",
                        strokeDashArray: 5,
                    },
                };
               this.isLoading = false; 
                            } 
                        );
                    } 
                ); 
            }
            
        );
    }

}
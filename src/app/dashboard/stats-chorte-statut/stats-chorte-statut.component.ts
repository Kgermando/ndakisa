import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DatePipe } from '@angular/common'; 
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexTooltip,
    ApexGrid,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexFill
} from "ng-apexcharts";
import { CustomizerSettingsService } from "src/app/common/customizer-settings/customizer-settings.service";
import { DashboardService } from "../dashboard.service";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    series2: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    legend: ApexLegend;
    colors: any;
    xaxis: ApexXAxis;
    fill: ApexFill;
    title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-stats-chorte-statut',
  templateUrl: './stats-chorte-statut.component.html',
  styleUrls: ['./stats-chorte-statut.component.scss']
})
export class StatsChorteStatutComponent implements OnInit {
  @Input() start_date: string;
  @Input() end_date: string;

  @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    isLoading = false;

    statutCohorteList: any[] = [];

    totalOuverte = 0;
    totalComplete = 0;

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    constructor(
        private datePipe: DatePipe,
        public themeService: CustomizerSettingsService,
        private dashboardService: DashboardService
    ) { }


    ngOnInit(): void {
        this.isLoading = true;
        this.dashboardService.statutCohorte(this.start_date, this.end_date).subscribe(
            res => {
                this.statutCohorteList = res;
                
                for(let item of this.statutCohorteList) {
                    if (item.statut == 'Ouverte') {
                        this.totalOuverte = item.count;
                    } else if (item.statut == 'Fermée') {
                        this.totalComplete = item.count;
                    }
                }

                this.isLoading = false;
            }
        );


       this.chartOptions = {
            series: [
                {
                    name: "Ouverte",
                    data: [2400, 1398, 5405, 3910, 4398, 3321, 2000]
                }
            ],
            series2: [
                {
                    name: "Fermée",
                    data: [24, 13, 30, 35, 40, 22, 15]
                }
            ],
            chart: {
                height: 90,
                width: 180,
                type: "bar",
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: "15%",
                    distributed: true,
                },
            },
            dataLabels: {
                enabled: false
            },
            colors: [
                "#FFBA69", "#757FEF"
            ],
            xaxis: {
                categories: [
                    "Sat",
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri"
                ],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    show: false
                }
            },
            grid: {
                borderColor: "#f2f2f2",
                strokeDashArray: 2,
                show: true
            },
            legend: {
                show: false
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return "$" + val + "K";
                    }
                }
            }
        };
    }

    currentDate: Date = new Date();
    formattedDate: any = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy');

}
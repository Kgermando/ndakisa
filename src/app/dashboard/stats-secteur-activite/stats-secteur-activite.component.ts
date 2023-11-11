import { Component, Input, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

import {
    ApexNonAxisChartSeries,
    ApexTooltip,
    ApexLegend,
    ApexStroke,
    ApexChart
} from "ng-apexcharts";
import { DashboardService } from "../dashboard.service";

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

  isLoading = false;
  secteurActiviteList:any[] = [];

  constructor(private dashboardService: DashboardService) {
      
  }

    ngOnInit(): void {
        // console.log('start_date', this.start_date);
    // console.log('end_date', this.end_date);

    this.getPieSecteurs();
    }

    getPieSecteurs() {
        this.dashboardService.secteurActivite(this.start_date, this.end_date).subscribe(
            res => {
                this.secteurActiviteList = res;
                this.chartOptions = {
                    series: this.secteurActiviteList.map((item: any) => parseFloat(item.count)),
                    // colors: ["#ee368c", "#757fef"],
                    chart: {
                        height: 365,
                        type: "donut"
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return "" + val + "Beneficiaires";
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
                    labels: this.secteurActiviteList.map((item: any) => item.name_secteur)
                };
            }
        )
    }

}
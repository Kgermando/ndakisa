import { Component, Input, OnInit, ViewChild } from "@angular/core"; 
import {
    ChartComponent,
    ApexNonAxisChartSeries,
    ApexChart,
    ApexStroke,
    ApexTooltip,
    ApexDataLabels,
    ApexLegend,
} from "ng-apexcharts";
import { DashboardService } from "../dashboard.service";

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
  selector: 'app-stats-banque',
  templateUrl: './stats-banque.component.html',
  styleUrls: ['./stats-banque.component.scss']
})
export class StatsBanqueComponent implements OnInit{
    @Input() start_date: string;
  @Input() end_date: string;
  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  isLoading = false;
  banqueList: any = [];

  constructor( 
    private dashboardService: DashboardService
  ) {
      
  }

    ngOnInit(): void {
            // console.log('start_date', this.start_date);
        // console.log('end_date', this.end_date);

        this.getPie();
    }


    getPie() {
        this.isLoading = true;
        this.dashboardService.participationParBanque(this.start_date, this.end_date).subscribe(
            res => {
                this.banqueList = res;
                this.chartOptions = {
                    series: this.banqueList.map((item: any) => parseFloat(item.montant_payer)),
                    chart: {
                        height: 250,
                        type: "pie"
                    },
                    stroke: {
                        width: 0,
                        show: true
                    },
                    // colors: [
                    //     "#757FEF", "#90C6E0", "#E040FB", "#E9EFFC"
                    // ],
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
                            fontSize: '14px'
                        },
                        y: {
                            formatter: function(val:any) {
                                return val + " " + "usd";
                            }
                        }
                    },
                    legend: {
                        offsetY: 0,
                        show: true,
                        position: "bottom",
                        fontSize: "14px",
                        labels: {
                            colors: '#5B5B98',
                        },
                    },
                    labels: this.banqueList.map((item: any) => item.name_banque)
                };
            }
        )
        this.isLoading = false;
    }

}

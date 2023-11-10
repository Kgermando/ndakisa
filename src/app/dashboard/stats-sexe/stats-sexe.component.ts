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
  selector: 'app-stats-sexe',
  templateUrl: './stats-sexe.component.html',
  styleUrls: ['./stats-sexe.component.scss']
})
export class StatsSexeComponent implements OnInit { 
    
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  isLoading = false;

  sexeList: any = [];

  constructor(private dashboardService: DashboardService) {
      
  }
 

  ngOnInit(): void {
     // console.log('start_date', this.start_date);
  // console.log('end_date', this.end_date);

    this.getPieSexe();
  }

  getPieSexe() {
    this.isLoading = true;
    this.dashboardService.sexe().subscribe(
        res => {
            this.sexeList = res;
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
                        formatter: function(val:any) {
                            return val + " " + "Beneficiaires";
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
        
    );
    this.isLoading = false;
  }

}
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
  selector: 'app-stats-banque',
  templateUrl: './stats-banque.component.html',
  styleUrls: ['./stats-banque.component.scss']
})
export class StatsBanqueComponent implements OnChanges {
  @Input() banqueList: any = [];
  @Input() isLoading: boolean;
  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>; 
  

  ngOnChanges(changes: SimpleChanges) {
    
    this.getPieBanque();
  }


    getPieBanque() {
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
                show: false,
                position: "bottom",
                fontSize: "14px",
                labels: {
                    colors: '#5B5B98',
                },
            },
            labels: this.banqueList.map((item: any) => item.name_banque)
        };
    }

}
